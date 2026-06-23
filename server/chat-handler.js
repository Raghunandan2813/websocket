const { generateId } = require('./id-gen');
const { broadcast, sendTo } = require('./messaging');
const { parseWhisper } = require('./whisper-parser');
const { handleWhisper } = require('./whisper-handler');
const { formatText } = require('./formatter');
const { parseCommand } = require('./command-parser');
const { handleCommand } = require('./command-handler');

function handleChatMessage(ws, wss, sender, payload) {
  const raw = String(payload?.text ?? '').trim().slice(0, 1000);
  if (!raw) return;
  const cmd = parseCommand(raw);
  if (cmd) return handleCommand(ws, wss, sender, cmd);
  const whsp = parseWhisper(raw);
  if (whsp) return handleWhisper(ws, wss, sender, whsp.targetName, formatText(whsp.msgText));
  const chatMsg = {
    type: 'chat',
    payload: { id: generateId(), from: { id: sender.id, username: sender.username }, text: formatText(raw), timestamp: new Date().toISOString() },
  };
  sendTo(ws, chatMsg);
  broadcast(wss, chatMsg, ws);
}

module.exports = { handleChatMessage };
