const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const DataSimulator = require('./services/dataSimulator');
const LogicEngine = require('./services/logicEngine');
const GoogleHomeService = require('./services/googleHome');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to broadcast messages to all connected clients
const broadcast = (message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

const googleHome = new GoogleHomeService();
// Pass the broadcast function to the LogicEngine
const logicEngine = new LogicEngine(googleHome, broadcast);
const simulator = new DataSimulator((data) => {
    // This function is called every time new data is generated
    const actions = logicEngine.processData(data);
    
    // Broadcast data and initial actions to all connected clients
    broadcast({ type: 'update', data, actions });
});

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    // Handle messages from client (e.g., manual simulation triggers)
    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'trigger_scenario') {
                simulator.switchToScenario(parsedMessage.scenario);
                console.log(`Switched to scenario: ${parsedMessage.scenario}`);
            }
        } catch (e) {
            console.error('Failed to parse message or invalid message format.');
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the simulation
simulator.start();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser.`);
});