const { clients, getUserList } = require('./user-manager');
const { broadcast, sendTo } = require('./messaging');
const { generateId } = require('./id-gen');
const { handleDisconnectTyping } = require('./typing');
const { routeMessage } = require('./router');

function handleConnection(ws, req, wss) {
  const clientId = generateId();
  const meta = { id: clientId, username: `User-${clientId}`, joinedAt: new Date().toISOString(), ip: req.socket.remoteAddress };
  clients.set(ws, meta);
  sendTo(ws, { type: 'welcome', payload: { you: { id: meta.id, username: meta.username }, users: getUserList(), serverTime: new Date().toISOString() } });
  broadcast(wss, { type: 'user_joined', payload: { id: meta.id, username: meta.username, users: getUserList() } }, ws);

  ws.on('message', (raw) => {
    try {
      const sender = clients.get(ws);
      if (sender) routeMessage(ws, wss, sender, JSON.parse(raw));
    } catch { sendTo(ws, { type: 'error', payload: { message: 'Invalid JSON' } }); }
  });

  ws.on('close', (code) => {
    clients.delete(ws);
    handleDisconnectTyping(meta, wss);
    broadcast(wss, { type: 'user_left', payload: { id: meta.id, username: meta.username, users: getUserList() } });
  });
  ws.on('error', (err) => console.error(`[error] client=${meta.id} ${err.message}`));
}

module.exports = { handleConnection };
