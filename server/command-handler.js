const { executeCommand } = require('./commands');
const { generateId } = require('./id-gen');
const { broadcast, sendTo } = require('./messaging');

function handleCommand(ws, wss, sender, cmdData) {
  const result = executeCommand(cmdData.cmd, sender);
  const isPrivate = ['help', 'uptime'].includes(cmdData.cmd) || result.startsWith('Unknown command');
  const chatMsg = {
    type: 'chat',
    payload: {
      id: generateId(),
      from: { id: 'system', username: 'System 🤖' },
      text: result,
      timestamp: new Date().toISOString()
    }
  };
  if (isPrivate) sendTo(ws, chatMsg);
  else {
    sendTo(ws, chatMsg);
    broadcast(wss, chatMsg, ws);
  }
}

module.exports = { handleCommand };
