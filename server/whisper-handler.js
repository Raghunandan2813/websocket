const { generateId } = require('./id-gen');
const { clients } = require('./user-manager');
const { sendTo } = require('./messaging');

function handleWhisper(ws, wss, sender, targetName, msgText) {
  let targetWs = null;
  for (const [clientWs, meta] of clients.entries()) {
    if (meta.username.toLowerCase() === targetName.toLowerCase()) {
      targetWs = clientWs;
      break;
    }
  }
  if (!targetWs) {
    return sendTo(ws, { type: 'error', payload: { message: `User "${targetName}" not found.` } });
  }
  const payload = { id: generateId(), from: { id: sender.id, username: sender.username }, to: targetName, text: msgText, timestamp: new Date().toISOString() };
  sendTo(ws, { type: 'whisper', payload });
  sendTo(targetWs, { type: 'whisper', payload });
}

module.exports = { handleWhisper };
