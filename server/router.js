const { handleChatMessage, handleSetUsername } = require('./handlers');
const { handleTyping } = require('./typing');
const { sendTo } = require('./messaging');

function routeMessage(ws, wss, sender, msg) {
  if (msg.type === 'chat') handleChatMessage(ws, wss, sender, msg.payload);
  else if (msg.type === 'set_username') handleSetUsername(ws, wss, sender, msg.payload);
  else if (msg.type === 'typing') handleTyping(ws, wss, sender, msg.payload);
  else if (msg.type === 'ping') sendTo(ws, { type: 'pong', payload: { serverTime: new Date().toISOString() } });
  else sendTo(ws, { type: 'error', payload: { message: `Unknown message type: ${msg.type}` } });
}

module.exports = { routeMessage };
