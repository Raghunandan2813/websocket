const { generateId } = require('./id-gen');
const { getUserList } = require('./user-manager');
const { broadcast, sendTo } = require('./messaging');

function handleChatMessage(ws, wss, sender, payload) {
  const text = String(payload?.text ?? '').trim().slice(0, 1000);
  if (!text) return;
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
  broadcast(wss, chatMsg, ws);
  console.log(`[chat] ${sender.username}: ${text}`);
}

function handleSetUsername(ws, wss, sender, payload) {
  const newName = String(payload?.username ?? '').trim().slice(0, 32);
  if (!newName) return;
  const oldName = sender.username;
  sender.username = newName;
  broadcast(wss, {
    type: 'username_changed',
    payload: { id: sender.id, oldUsername: oldName, newUsername: newName, users: getUserList() },
  });
  sendTo(ws, { type: 'username_ack', payload: { username: newName } });
  console.log(`[rename] ${oldName} → ${newName}`);
}

module.exports = { handleChatMessage, handleSetUsername };
