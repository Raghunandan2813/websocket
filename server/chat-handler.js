const { generateId } = require('./id-gen');
const { broadcast, sendTo } = require('./messaging');
const { parseWhisper } = require('./whisper-parser');
const { handleWhisper } = require('./whisper-handler');

function handleChatMessage(ws, wss, sender, payload) {
  const text = String(payload?.text ?? '').trim().slice(0, 1000);
  if (!text) return;
  const whisper = parseWhisper(text);
  if (whisper) {
    return handleWhisper(ws, wss, sender, whisper.targetName, whisper.msgText);
  }
  const chatMsg = {
    type: 'chat',
    payload: { id: generateId(), from: { id: sender.id, username: sender.username }, text, timestamp: new Date().toISOString() },
  };
  sendTo(ws, chatMsg);
  broadcast(wss, chatMsg, ws);
}

module.exports = { handleChatMessage };
