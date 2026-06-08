const { getUserList } = require('./user-manager');
const { broadcast, sendTo } = require('./messaging');

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
}

module.exports = { handleSetUsername };
