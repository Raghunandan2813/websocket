const { WebSocket } = require('ws');
const URL = 'ws://localhost:8080';

function createTestClient(name) {
  return new Promise((resolve) => {
    const ws = new WebSocket(URL);
    ws.on('open', () => {
      console.log(`[${name}] connected`);
      ws.send(JSON.stringify({ type: 'set_username', payload: { username: name } }));
      resolve(ws);
    });
    ws.on('message', (raw) => {
      const msg = JSON.parse(raw);
      if (msg.type === 'chat') {
        console.log(`[${name}] received from ${msg.payload.from.username}: "${msg.payload.text}"`);
      }
    });
    ws.on('error', (err) => console.error(`[${name}] error:`, err.message));
    ws.on('close', () => console.log(`[${name}] disconnected`));
  });
}

module.exports = { createTestClient };
