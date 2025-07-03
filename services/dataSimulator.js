class DataSimulator {
    constructor(onData) {
        this.onData = onData; // Callback function to send data to
        this.intervalId = null;
        this.scenario = 'normal'; // can be 'normal', 'stress', 'emergency'

        this.state = {
            hr: 75,      // Heart Rate
            spo2: 98,    // Oxygen Saturation
            co2: 450,    // CO2 level in ppm
            temp: 22     // Room temperature
        };
    }

    start() {
        this.stop(); // Ensure no multiple intervals are running
        this.intervalId = setInterval(() => {
            this.generateData();
            this.onData(this.state);
        }, 2000); // Generate new data every 2 seconds
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    switchToScenario(scenario) {
        this.scenario = scenario;
        // Immediately generate data for the new scenario to show instant change
        this.generateData(); 
        this.onData(this.state);
    }

    generateData() {
        const randomFactor = (Math.random() - 0.5); // -0.5 to 0.5

        switch (this.scenario) {
            case 'stress':
                this.state.hr = 95 + Math.round(randomFactor * 10); // 90-100
                this.state.spo2 = 97 + Math.round(randomFactor * 2); // 96-98
                this.state.co2 = 800 + Math.round(randomFactor * 100); // High CO2
                this.state.temp = 25; // User feels hot
                break;
            
            case 'emergency':
                this.state.hr = 140 + Math.round(randomFactor * 20); // Very high or irregular
                this.state.spo2 = 88 - Math.round(Math.random() * 5); // Low oxygen
                this.state.co2 = 600;
                this.state.temp = 21;
                break;
                
            case 'normal':
            default:
                this.state.hr = 75 + Math.round(randomFactor * 10); // 70-80
                this.state.spo2 = 98 + Math.round(randomFactor * 2); // 97-99
                this.state.co2 = 450 + Math.round(randomFactor * 50); // Normal CO2
                this.state.temp = 22;
                break;
        }
    }
}

module.exports = DataSimulator;