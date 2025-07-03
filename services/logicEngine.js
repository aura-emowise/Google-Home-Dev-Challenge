class LogicEngine {
    constructor(googleHomeService, broadcastCallback) {
        this.googleHome = googleHomeService;
        this.broadcast = broadcastCallback;
        this.emergencyProtocolActive = false;
        this.emergencyTimeout = null;
        this.EMERGENCY_CONFIRMATION_TIME = 7000;
    }

    processData(data) {
        let actions = [];

        // --- Логика Экстренного Протокола ---
        if (data.spo2 < 90 && data.hr > 120) {
            // ЕСЛИ ПРОТОКОЛ УЖЕ ПОЛНОСТЬЮ АКТИВИРОВАН:
            if (this.emergencyProtocolActive) {
                // Постоянно отправляем в лог сообщение о статусе
                actions.push({ type: 'alert', message: 'EMERGENCY PROTOCOL IS CURRENTLY ACTIVE.' });
            } 
            // ИНАЧЕ (протокол еще не активен, но есть условия для его запуска):
            else {
                const alertMessage = 'EMERGENCY DETECTED! Awaiting user confirmation for 7 seconds.';
                // Постоянно отправляем сообщение об ожидании
                actions.push({ type: 'alert', message: alertMessage });

                // Запускаем таймер ТОЛЬКО ОДИН РАЗ
                if (!this.emergencyTimeout) {
                    console.log(alertMessage);
                    this.emergencyTimeout = setTimeout(() => {
                        const protocolActions = this.activateEmergencyProtocol();
                        this.broadcast({ type: 'protocol_actions', actions: protocolActions });
                        this.emergencyTimeout = null;
                    }, this.EMERGENCY_CONFIRMATION_TIME);
                }
            }
        } else {
            // Если показатели вернулись в норму, отменяем ожидание
            if (this.emergencyTimeout) {
                clearTimeout(this.emergencyTimeout);
                this.emergencyTimeout = null;
                const cancelMessage = "User status normalized. Emergency alert cancelled.";
                actions.push({ type: 'action', message: cancelMessage });
                console.log(cancelMessage);
            }
        }

        // --- Логика Комфорта (только если нет экстренной ситуации) ---
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
    
    // В будущем этот метод можно вызывать для ручной деактивации
    deactivateEmergency() {
        if (this.emergencyTimeout) {
            clearTimeout(this.emergencyTimeout);
            this.emergencyTimeout = null;
        }
        if (this.emergencyProtocolActive) {
            this.emergencyProtocolActive = false;
            // Здесь можно добавить команды для возвращения устройств в норму
            console.log("Emergency Protocol deactivated.");
        }
    }
}

module.exports = LogicEngine;