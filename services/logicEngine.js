// services/logicEngine.js

class LogicEngine {
    constructor(googleHomeService, broadcastCallback) {
        this.googleHome = googleHomeService;
        this.broadcast = broadcastCallback; // Сохраняем функцию для отправки сообщений
        this.emergencyProtocolActive = false;
        this.emergencyTimeout = null;
        this.EMERGENCY_CONFIRMATION_TIME = 7000; // 7 секунд для демонстрации
    }

    processData(data) {
        let actions = [];
        
        // --- Логика Экстренного Протокола ---
        if (data.spo2 < 90 && data.hr > 120) {
            if (!this.emergencyProtocolActive) {
                const alertMessage = 'EMERGENCY DETECTED! Fall or medical issue suspected. Awaiting user confirmation for 7 seconds.';
                
                if (!this.emergencyTimeout) {
                    console.log(alertMessage); // Лог для консоли сервера
                    this.emergencyTimeout = setTimeout(() => {
                        const protocolActions = this.activateEmergencyProtocol();
                        this.broadcast({ type: 'protocol_actions', actions: protocolActions });
                        this.emergencyTimeout = null;
                    }, this.EMERGENCY_CONFIRMATION_TIME);
                }

                actions.push({ type: 'alert', message: alertMessage });
            }
        } else {
            if (this.emergencyTimeout) {
                clearTimeout(this.emergencyTimeout);
                this.emergencyTimeout = null;
                const cancelMessage = "User status normalized. Emergency alert cancelled.";
                actions.push({ type: 'action', message: cancelMessage });
                console.log(cancelMessage);
            }
        }

        // --- Логика Комфорта и Качества Воздуха (только если нет экстренной ситуации) ---
        if (!this.emergencyProtocolActive && !this.emergencyTimeout) {
            if (data.co2 > 700 && data.hr > 90) {
                actions.push({ type: 'action', message: this.googleHome.toggleVentilation(true) });
            }
            
            if (data.temp > 24) {
                 actions.push({ type: 'action', message: this.googleHome.setThermostat(21) });
            }
        }
        
        return actions;
    }

    activateEmergencyProtocol() {
        this.emergencyProtocolActive = true;
        console.log("User did not respond. Activating Emergency Protocol!");
        
        const protocolActions = [];
        protocolActions.push({ type: 'alert', message: 'PROTOCOL ACTIVATED: Notifying contacts and enabling access.' });
        protocolActions.push({ type: 'action', message: this.googleHome.unlockDoor() });
        protocolActions.push({ type: 'action', message: this.googleHome.activateEmergencyLight() });
        protocolActions.push({ type: 'action', message: this.googleHome.shareCameraFeed('Emergency Contact (Social Worker)') });
        
        return protocolActions;
    }

    deactivateEmergency() {
        if (this.emergencyTimeout) {
            clearTimeout(this.emergencyTimeout);
            this.emergencyTimeout = null;
            console.log("Emergency alert cancelled by user.");
        }
        if (this.emergencyProtocolActive) {
            this.emergencyProtocolActive = false;
            this.googleHome.deactivateEmergencyProtocol();
            console.log("Emergency Protocol deactivated by user or remote party.");
        }
    }
}

module.exports = LogicEngine;