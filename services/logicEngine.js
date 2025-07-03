// services/logicEngine.js

class LogicEngine {
    constructor(googleHomeService, broadcastCallback) {
        this.googleHome = googleHomeService;
        this.broadcast = broadcastCallback;
        
        // Главные переключатели состояния системы
        this.currentState = 'normal'; // 'normal', 'stress', 'emergency_pending', 'emergency_active'
        this.emergencyTimeout = null;
        this.EMERGENCY_CONFIRMATION_TIME = 7000;
    }

    // Этот метод вызывается из server.js при нажатии кнопки
    setState(newState) {
        // Сбрасываем предыдущее состояние перед установкой нового
        this.resetState();

        switch (newState) {
            case 'normal':
                this.currentState = 'normal';
                // Логируем, что все вернулось в норму
                this.broadcast({ type: 'protocol_actions', actions: [{ type: 'action', message: 'System returned to NORMAL mode.' }] });
                break;
            
            case 'stress':
                this.currentState = 'stress';
                break;

            case 'emergency':
                this.currentState = 'emergency_pending';
                // Запускаем 7-секундный таймер
                this.emergencyTimeout = setTimeout(() => {
                    this.currentState = 'emergency_active';
                    // Отправляем детальные логи активации ОДИН РАЗ
                    const protocolActions = this.activateEmergencyProtocol();
                    this.broadcast({ type: 'protocol_actions', actions: protocolActions });
                }, this.EMERGENCY_CONFIRMATION_TIME);
                break;
        }
    }

    // Внутренний метод для сброса состояний
    resetState() {
        if (this.emergencyTimeout) {
            clearTimeout(this.emergencyTimeout);
            this.emergencyTimeout = null;
        }
        // Если предыдущее состояние было экстренным, логируем деактивацию
        if (this.currentState === 'emergency_active') {
            const deactivationActions = this.deactivateEmergencyProtocol();
            this.broadcast({ type: 'protocol_actions', actions: deactivationActions });
        }
        this.currentState = 'normal';
    }

    // Этот метод вызывается каждые 2 секунды и добавляет ПОСТОЯННЫЕ логи
    processData(data) {
        const actions = [];
        
        switch (this.currentState) {
            case 'stress':
                actions.push({ type: 'action', message: this.googleHome.toggleVentilation(true) });
                actions.push({ type: 'action', message: this.googleHome.setThermostat(21) });
                break;
            
            case 'emergency_pending':
                actions.push({ type: 'alert', message: 'EMERGENCY DETECTED! Awaiting user confirmation for 7 seconds.' });
                break;
                
            case 'emergency_active':
                actions.push({ type: 'alert', message: 'EMERGENCY PROTOCOL IS CURRENTLY ACTIVE.' });
                break;
        }
        
        return actions;
    }

    activateEmergencyProtocol() {
        console.log("Activating Emergency Protocol!");
        const actions = [];
        actions.push({ type: 'alert', message: 'PROTOCOL ACTIVATED: Notifying contacts and enabling access.' });
        actions.push({ type: 'action', message: this.googleHome.unlockDoor() });
        actions.push({ type: 'action', message: this.googleHome.activateEmergencyLight() });
        actions.push({ type: 'action', message: this.googleHome.shareCameraFeed('Emergency Contact (Social Worker)') });
        return actions;
    }

    deactivateEmergencyProtocol() {
        console.log("Deactivating Emergency Protocol.");
        return [{ type: 'action', message: this.googleHome.deactivateEmergencyProtocol() }];
    }
}

module.exports = LogicEngine;