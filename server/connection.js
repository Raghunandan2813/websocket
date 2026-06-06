const { clients, getUserList } = require('./user-manager');
const { handleChatMessage, handleSetUsername } = require('./handlers');
const { broadcast, sendTo } = require('./messaging');
const { generateId } = require('./id-gen');
const { handleTyping, handleDisconnectTyping } = require('./typing');

function handleConnection(ws, req, wss) {
  const clientId = generateId();
  const ip = req.socket.remoteAddress;
  const meta = { id: clientId, username: `User-${clientId}`, joinedAt: new Date().toISOString(), ip };
  clients.set(ws, meta);
  console.log(`[+] Connected: ${clientId} (${ip})`);
  sendTo(ws, {
    type: 'welcome',
    payload: { you: { id: meta.id, username: meta.username }, users: getUserList(), serverTime: new Date().toISOString() },
  });
  broadcast(wss, { type: 'user_joined', payload: { id: meta.id, username: meta.username, users: getUserList() } }, ws);

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return sendTo(ws, { type: 'error', payload: { message: 'Invalid JSON' } }); }
    const sender = clients.get(ws);
    if (!sender) return;
    if (msg.type === 'chat') handleChatMessage(ws, wss, sender, msg.payload);
    else if (msg.type === 'set_username') handleSetUsername(ws, wss, sender, msg.payload);
    else if (msg.type === 'typing') handleTyping(ws, wss, sender, msg.payload);
    else if (msg.type === 'ping') sendTo(ws, { type: 'pong', payload: { serverTime: new Date().toISOString() } });
    else sendTo(ws, { type: 'error', payload: { message: `Unknown message type: ${msg.type}` } });
  });

  ws.on('close', (code) => {
    clients.delete(ws);
    console.log(`[-] Disconnected: ${meta.id} code=${code}`);
    handleDisconnectTyping(meta, wss);
    broadcast(wss, { type: 'user_left', payload: { id: meta.id, username: meta.username, users: getUserList() } });
  });
  ws.on('error', (err) => console.error(`[error] client=${meta.id} ${err.message}`));
}

module.exports = { handleConnection };
