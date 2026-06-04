const { WebSocketServer } = require('ws');
const http = require('http');
const { handleConnection } = require('./server/connection');

const PORT = process.env.PORT || 8080;
const httpServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', clients: wss.clients.size }));
  } else {
    res.writeHead(404).end('Not found');
  }
});

const wss = new WebSocketServer({ server: httpServer });
wss.on('connection', (ws, req) => handleConnection(ws, req, wss));

httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  wss.clients.forEach((ws) => ws.terminate());
  httpServer.close(() => process.exit(0));
});
