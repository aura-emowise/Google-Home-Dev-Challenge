// server.js

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

app.use(express.static(path.join(__dirname, 'public')));

const broadcast = (message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

const googleHome = new GoogleHomeService();
const logicEngine = new LogicEngine(googleHome, broadcast);
const simulator = new DataSimulator((data) => {
    const actions = logicEngine.processData(data);
    broadcast({ type: 'update', data, actions });
});

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // При подключении нового клиента сбрасываем состояние на 'normal'
    logicEngine.setState('normal');
    simulator.switchToScenario('normal');

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'trigger_scenario') {
                const scenario = parsedMessage.scenario;
                console.log(`--- User triggered scenario: ${scenario} ---`);
                
                // Явно устанавливаем состояние в движке логики
                logicEngine.setState(scenario);
                // И синхронно меняем данные в симуляторе
                simulator.switchToScenario(scenario);
            }
        } catch (e) {
            console.error('Failed to parse message or invalid message format.');
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

simulator.start();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser.`);
});