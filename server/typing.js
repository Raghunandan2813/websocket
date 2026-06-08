const { broadcast } = require('./messaging');
const typingUsers = new Map();

function handleTyping(ws, wss, sender, payload) {
  const isTyping = !!payload?.typing;
  if (isTyping) typingUsers.set(sender.id, sender.username);
  else typingUsers.delete(sender.id);
  broadcast(wss, { type: 'typing', payload: { id: sender.id, username: sender.username, typing: isTyping } }, ws);
}

function handleDisconnectTyping(sender, wss) {
  if (typingUsers.delete(sender.id)) {
    broadcast(wss, { type: 'typing', payload: { id: sender.id, username: sender.username, typing: false } });
  }
}

module.exports = { handleTyping, handleDisconnectTyping };
