const { generateId } = require('./id-gen');
const { broadcast, sendTo } = require('./messaging');
const { parseWhisper } = require('./whisper-parser');
const { handleWhisper } = require('./whisper-handler');
const { formatText } = require('./formatter');

function handleChatMessage(ws, wss, sender, payload) {
  const rawText = String(payload?.text ?? '').trim().slice(0, 1000);
  if (!rawText) return;
  const whisper = parseWhisper(rawText);
  if (whisper) {
    return handleWhisper(ws, wss, sender, whisper.targetName, formatText(whisper.msgText));
  }
  const chatMsg = {
    type: 'chat',
    payload: { id: generateId(), from: { id: sender.id, username: sender.username }, text: formatText(rawText), timestamp: new Date().toISOString() },
  };
  sendTo(ws, chatMsg);
  broadcast(wss, chatMsg, ws);
}

module.exports = { handleChatMessage };
