const { WebSocketServer, WebSocket } = require('ws');
const http = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;

const httpServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', clients: wss.clients.size }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const wss = new WebSocketServer({ server: httpServer });

const clients = new Map();

function generateId() {
  return crypto.randomBytes(4).toString('hex');
}

function broadcast(data, excludeWs = null) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function sendTo(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function getUserList() {
  return [...clients.values()].map(({ id, username, joinedAt }) => ({
    id,
    username,
    joinedAt,
  }));
}

wss.on('connection', (ws, req) => {
  const clientId = generateId();
  const ip = req.socket.remoteAddress;

  const meta = {
    id: clientId,
    username: `User-${clientId}`,
    joinedAt: new Date().toISOString(),
    ip,
  };
  clients.set(ws, meta);

  console.log(`[+] Client connected  id=${clientId}  ip=${ip}  total=${wss.clients.size}`);

  sendTo(ws, {
    type: 'welcome',
    payload: {
      you: { id: meta.id, username: meta.username },
      users: getUserList(),
      serverTime: new Date().toISOString(),
    },
  });

  broadcast(
    {
      type: 'user_joined',
      payload: { id: meta.id, username: meta.username, users: getUserList() },
    },
    ws
  );

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return sendTo(ws, { type: 'error', payload: { message: 'Invalid JSON' } });
    }

    const sender = clients.get(ws);
    if (!sender) return;

    switch (msg.type) {
      case 'chat': {
        const text = String(msg.payload?.text ?? '').trim().slice(0, 1000);
        if (!text) break;

        const chatMsg = {
          type: 'chat',
          payload: {
            id: generateId(),
            from: { id: sender.id, username: sender.username },
            text,
            timestamp: new Date().toISOString(),
          },
        };

        sendTo(ws, chatMsg);
        broadcast(chatMsg, ws);
        console.log(`[chat] ${sender.username}: ${text}`);
        break;
      }

      case 'set_username': {
        const newName = String(msg.payload?.username ?? '').trim().slice(0, 32);
        if (!newName) break;

        const oldName = sender.username;
        sender.username = newName;

        broadcast({
          type: 'username_changed',
          payload: { id: sender.id, oldUsername: oldName, newUsername: newName, users: getUserList() },
        });
        sendTo(ws, { type: 'username_ack', payload: { username: newName } });
        console.log(`[rename] ${oldName} → ${newName}`);
        break;
      }

      case 'ping':
        sendTo(ws, { type: 'pong', payload: { serverTime: new Date().toISOString() } });
        break;

      default:
        sendTo(ws, { type: 'error', payload: { message: `Unknown message type: ${msg.type}` } });
    }
  });

  ws.on('close', (code, reason) => {
    const meta = clients.get(ws);
    clients.delete(ws);
    if (meta) {
      console.log(`[-] Client disconnected  id=${meta.id}  code=${code}  total=${wss.clients.size}`);
      broadcast({
        type: 'user_left',
        payload: { id: meta.id, username: meta.username, users: getUserList() },
      });
    }
  });

  ws.on('error', (err) => {
    console.error(`[error] client=${clients.get(ws)?.id}  ${err.message}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
  console.log(`Health check:           http://localhost:${PORT}/health`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down…');
  wss.clients.forEach((ws) => ws.terminate());
  httpServer.close(() => process.exit(0));
});
