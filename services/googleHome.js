// This class simulates interactions with Google Home APIs
class GoogleHomeService {
    constructor() {
        this.devices = {
            'thermostat_main': { state: 'off', temperature: 22 },
            'ventilation_system': { state: 'off' },
            'front_door_lock': { state: 'locked' },
            'outdoor_lamp': { state: 'off', color: 'white', blinking: false },
            'main_camera': { streaming_shared: false }
        };
    }

    // This is a helper to log actions for the demo
    logAction(message) {
        console.log(`[Google Home API] ${message}`);
        return message; // Return message to be displayed on dashboard
    }

    setThermostat(temperature) {
        this.devices.thermostat_main.temperature = temperature;
        return this.logAction(`Thermostat set to ${temperature}°C.`);
    }

    toggleVentilation(state) {
        const action = state ? 'ON' : 'OFF';
        this.devices.ventilation_system.state = action.toLowerCase();
        return this.logAction(`Ventilation system turned ${action}.`);
    }

    unlockDoor() {
        this.devices.front_door_lock.state = 'unlocked';
        return this.logAction(`Front door UNLOCKED for emergency services.`);
    }

    activateEmergencyLight() {
        this.devices.outdoor_lamp.state = 'on';
        this.devices.outdoor_lamp.color = 'red';
        this.devices.outdoor_lamp.blinking = true;
        return this.logAction(`Outdoor lamp activated: BLINKING RED.`);
    }

    shareCameraFeed(contact) {
        this.devices.main_camera.streaming_shared = true;
        const link = 'https://home.google.com/camera/stream/xyz123abc'; // Simulated link
        const notification = `Sent to ${contact}: "Hey, this is Sam, check on me. Camera access: ${link}"`;
        return this.logAction(notification);
    }
    
    deactivateEmergencyProtocol() {
        this.devices.front_door_lock.state = 'locked';
        this.devices.outdoor_lamp.state = 'off';
        this.devices.outdoor_lamp.color = 'white';
        this.devices.outdoor_lamp.blinking = false;
        this.devices.main_camera.streaming_shared = false;
        return this.logAction('Emergency Protocol DEACTIVATED. All systems back to normal.');
    }
}

module.exports = GoogleHomeService;