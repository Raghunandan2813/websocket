import { $ } from './app/dom.js';
import { addChatMsg, systemMsg, updateUserList } from './app/ui.js';
import { initClient } from './app/client-manager.js';
import { setupEventListeners } from './app/events.js';

const WS_URL = 'ws://localhost:8080';
let myId = null, myUsername = null, pingStart = null;

const client = initClient(WS_URL, {
  onStateChange: (state) => { $('status-dot').className = state; $('status-label').textContent = state; },
  onOpen: () => { $('msg-input').disabled = false; $('btn-send').disabled = false; },
  onClose: () => {
    $('msg-input').disabled = true;
    $('btn-send').disabled = true;
    systemMsg($('messages'), 'Disconnected. Reconnecting in 3s…');
  },
  onPingStart: () => { pingStart = Date.now(); },
  onPong: () => { $('latency').textContent = `${Date.now() - pingStart}ms`; },
  onWelcome: (msg) => {
    myId = msg.payload.you.id;
    myUsername = msg.payload.you.username;
    updateUserList($('user-list'), msg.payload.users, myId);
    systemMsg($('messages'), `Connected as ${myUsername}`);
  },
  onChat: (msg) => addChatMsg($('messages'), msg.payload, myId),
  onUserJoined: (msg) => {
    updateUserList($('user-list'), msg.payload.users, myId);
    systemMsg($('messages'), `${msg.payload.username} joined`);
  },
  onUserLeft: (msg) => {
    updateUserList($('user-list'), msg.payload.users, myId);
    systemMsg($('messages'), `${msg.payload.username} left`);
  },
  onUsernameChanged: (msg) => {
    updateUserList($('user-list'), msg.payload.users, myId);
    const self = msg.payload.id === myId;
    if (self) myUsername = msg.payload.newUsername;
    systemMsg($('messages'), self ? `You are now ${myUsername}` : `${msg.payload.oldUsername} → ${msg.payload.newUsername}`);
  },
  onError: (msg) => systemMsg($('messages'), `Error: ${msg.payload.message}`),
});

function sendChat() {
  const text = $('msg-input').value.trim();
  if (text) { client.send('chat', { text }); $('msg-input').value = ''; }
}

setupEventListeners(client, () => myUsername, sendChat);
