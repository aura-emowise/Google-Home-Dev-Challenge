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
        // Условие срабатывания: очень низкий SpO2 и высокий пульс
        if (data.spo2 < 90 && data.hr > 120) {
            // Если протокол еще не активен...
            if (!this.emergencyProtocolActive) {
                const alertMessage = 'EMERGENCY DETECTED! Fall or medical issue suspected. Awaiting user confirmation for 7 seconds.';
                
                // Если таймер еще не запущен, запускаем его
                if (!this.emergencyTimeout) {
                    console.log(alertMessage); // Лог для консоли сервера
                    this.emergencyTimeout = setTimeout(() => {
                        const protocolActions = this.activateEmergencyProtocol();
                        // Отправляем действия протокола после задержки
                        this.broadcast({ type: 'protocol_actions', actions: protocolActions });
                        this.emergencyTimeout = null; // Сбрасываем ID таймера
                    }, this.EMERGENCY_CONFIRMATION_TIME);
                }

                // ВАЖНО: Добавляем сообщение о тревоге в actions КАЖДЫЙ РАЗ, пока таймер тикает.
                // Это гарантирует, что сообщение будет видно на дашборде.
                actions.push({ type: 'alert', message: alertMessage });
            }
        } else {
             // Если показатели вернулись в норму, а протокол еще не активировался, отменяем тревогу
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
            // Качество воздуха: высокий CO2 и немного повышенный пульс
            if (data.co2 > 700 && data.hr > 90) {
                actions.push({ type: 'action', message: this.googleHome.toggleVentilation(true) });
            }
            
            // Комфорт: пользователю жарко (из сценария "Стресс")
            if (data.temp > 24) {
                 actions.push({ type: 'action', message: this.googleHome.setThermostat(21) });
            }
        }
        
        return actions;
    }

    activateEmergencyProtocol() {
        this.emergencyProtocolActive = true;
        console.log("User did not respond. Activating Emergency Protocol!");
        
        const protocolActions = []; // Создаем новый массив действий
        protocolActions.push({ type: 'alert', message: 'PROTOCOL ACTIVATED: Notifying contacts and enabling access.' });
        protocolActions.push({ type: 'action', message: this.googleHome.unlockDoor() });
        protocolActions.push({ type: 'action', message: this.googleHome.activateEmergencyLight() });
        protocolActions.push({ type: 'action', message: this.googleHome.shareCameraFeed('Emergency Contact (Social Worker)') });
        
        return protocolActions;
    }

    // Этот метод можно будет использовать в будущем для ручной деактивации
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