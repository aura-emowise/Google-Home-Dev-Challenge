document.addEventListener('DOMContentLoaded', () => {
   const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const ws = new WebSocket(`${protocol}://${window.location.host}`);

    const hrEl = document.getElementById('hr');
    const spo2El = document.getElementById('spo2');
    const co2El = document.getElementById('co2');
    const tempEl = document.getElementById('temp');
    const logBox = document.getElementById('log');

    const btnNormal = document.getElementById('btn-normal');
    const btnStress = document.getElementById('btn-stress');
    const btnEmergency = document.getElementById('btn-emergency');

    const addLog = (message, type) => {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logBox.appendChild(entry);
        logBox.scrollTop = logBox.scrollHeight;
    };

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
        addLog('System connected.', 'info');
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        // Handles the regular data updates
        if (message.type === 'update') {
            const { data, actions } = message;

            // Update metrics
            hrEl.textContent = data.hr;
            spo2El.textContent = data.spo2;
            co2El.textContent = data.co2;
            tempEl.textContent = data.temp;
            
            // Add a visual indicator for bad values
            spo2El.style.color = data.spo2 < 95 ? 'var(--accent-color)' : 'var(--green-color)';
            hrEl.style.color = data.hr > 100 ? 'var(--yellow-color)' : 'var(--green-color)';
            if (data.hr > 120) hrEl.style.color = 'var(--accent-color)';

            // Log initial actions from the logic engine
            actions.forEach(action => {
                addLog(action.message, action.type);
            });
        
        // Handles the delayed actions from the emergency protocol
        } else if (message.type === 'protocol_actions') {
            message.actions.forEach(action => {
                addLog(action.message, action.type);
            });
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
        addLog('SYSTEM DISCONNECTED. Please refresh.', 'alert');
    };
    
    // Scenario trigger buttons
    const triggerScenario = (scenario) => {
        addLog(`Manually triggering '${scenario}' scenario...`, 'info');
        ws.send(JSON.stringify({ type: 'trigger_scenario', scenario: scenario }));
    };

    btnNormal.addEventListener('click', () => triggerScenario('normal'));
    btnStress.addEventListener('click', () => triggerScenario('stress'));
    btnEmergency.addEventListener('click', () => triggerScenario('emergency'));
});