console.log('hello')

const axios = require('axios');
const fs = require('fs');
const io = require('socket.io-client');
const { v4: uuidv4 } = require('uuid');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const clientId = config.clientId || uuidv4();

const socket = io(config.server);

socket.on('connect', () => {
    console.log(`Connected to server with socket ID ${socket.id}.`);
    
    Object.keys(config.subscriptions).forEach((topic) => {
        socket.emit('subscribe', { clientId, topic  });
        console.log(`Subscribed to ${topic}.`)
    });

    console.log("\n");
});

socket.on('webhook-call', async (webhookCall) => {
    const time = (new Date()).toISOString();

    console.log(`${time}: Received webhook call ${webhookCall.path}`);

    const listeners = config.subscriptions[webhookCall.path];

    if (!listeners || !listeners.length) {
        console.error(`No listeners specified for webhook ${webhookCall.path}`);
        process.exit(1);
    }

    listeners.forEach(async (listener) => {
        console.log(`Calling listener ${listener}...`);
        
        try {
            await axios({
                method: webhookCall.method,
                url: listener,
                headers: extractSafeToReplayHeaders(webhookCall.headers),
                params: webhookCall.query,
                data: webhookCall.body,
            });
    
            console.log(`Listener ${listener} called.`);
        } catch (e) {
            console.log(`Error calling listener ${listener}: ${e.message}`);
        }

        console.log("");
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server.');
});

function extractSafeToReplayHeaders(headers) {
    const safeHeaders = { ...headers };

    delete safeHeaders['content-length'];

    return safeHeaders;
}