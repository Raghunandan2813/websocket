const WS_URL = 'ws://localhost:8080';

let myId = null;
let myUsername = null;
let pingStart = null;

const $messages  = document.getElementById('messages');
const $input     = document.getElementById('msg-input');
const $send      = document.getElementById('btn-send');
const $dot       = document.getElementById('status-dot');
const $label     = document.getElementById('status-label');
const $latency   = document.getElementById('latency');
const $userList  = document.getElementById('user-list');
const $rename    = document.getElementById('btn-username');
const $overlay   = document.getElementById('modal-overlay');
const $modalInput= document.getElementById('modal-input');
const $modalCancel = document.getElementById('modal-cancel');
const $modalConfirm= document.getElementById('modal-confirm');

let ws;

function connect() {
  setStatus('connecting');
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    setStatus('connected');
    $input.disabled = false;
    $send.disabled  = false;
    startPing();
  };

  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    handleMessage(msg);
  };

  ws.onclose = () => {
    setStatus('disconnected');
    $input.disabled = true;
    $send.disabled  = true;
    systemMsg('Disconnected. Reconnecting in 3s…');
    setTimeout(connect, 3000);
  };

  ws.onerror = () => {
    systemMsg('Connection error');
  };
}

function send(type, payload) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  }
}

function handleMessage(msg) {
  switch (msg.type) {
    case 'welcome':
      myId = msg.payload.you.id;
      myUsername = msg.payload.you.username;
      updateUserList(msg.payload.users);
      systemMsg(`Connected as ${myUsername}`);
      break;

    case 'chat':
      addChatMsg(msg.payload);
      break;

    case 'user_joined':
      updateUserList(msg.payload.users);
      systemMsg(`${msg.payload.username} joined`);
      break;

    case 'user_left':
      updateUserList(msg.payload.users);
      systemMsg(`${msg.payload.username} left`);
      break;

    case 'username_changed':
      updateUserList(msg.payload.users);
      if (msg.payload.id === myId) {
        myUsername = msg.payload.newUsername;
        systemMsg(`You are now ${myUsername}`);
      } else {
        systemMsg(`${msg.payload.oldUsername} → ${msg.payload.newUsername}`);
      }
      break;

    case 'pong': {
      const latency = Date.now() - pingStart;
      $latency.textContent = `${latency}ms`;
      break;
    }

    case 'username_ack':
      break;

    case 'error':
      systemMsg(`Error: ${msg.payload.message}`);
      break;
  }
}

function setStatus(state) {
  $dot.className = state;
  $label.textContent = state;
}

function addChatMsg({ from, text, timestamp }) {
  const own = from.id === myId;
  const time = new Date(timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });

  const el = document.createElement('div');
  el.className = `msg ${own ? 'own' : 'other'}`;
  el.innerHTML = `
    <div class="msg-meta">${own ? time : `${escHtml(from.username)} · ${time}`}</div>
    <div class="msg-bubble">${escHtml(text)}</div>
  `;
  $messages.appendChild(el);
  scrollBottom();
}

function systemMsg(text) {
  const el = document.createElement('div');
  el.className = 'msg system';
  el.innerHTML = `<div class="msg-bubble">${escHtml(text)}</div>`;
  $messages.appendChild(el);
  scrollBottom();
}

function updateUserList(users) {
  $userList.innerHTML = users.map(u => {
    const initials = u.username.slice(0,2).toUpperCase();
    const isMe = u.id === myId;
    return `
      <div class="user-item">
        <div class="user-avatar">${initials}</div>
        <div class="user-name">${escHtml(u.username)}</div>
        ${isMe ? '<span class="you-badge">you</span>' : ''}
      </div>`;
  }).join('');
}

function scrollBottom() {
  $messages.scrollTop = $messages.scrollHeight;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function startPing() {
  setInterval(() => {
    pingStart = Date.now();
    send('ping', {});
  }, 5000);
}

function sendChat() {
  const text = $input.value.trim();
  if (!text) return;
  send('chat', { text });
  $input.value = '';
}

$send.addEventListener('click', sendChat);
$input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
});

$rename.addEventListener('click', () => {
  $modalInput.value = myUsername ?? '';
  $overlay.classList.add('show');
  $modalInput.focus();
  $modalInput.select();
});
$modalCancel.addEventListener('click', () => $overlay.classList.remove('show'));
$modalConfirm.addEventListener('click', () => {
  const name = $modalInput.value.trim();
  if (name) { send('set_username', { username: name }); }
  $overlay.classList.remove('show');
});
$modalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $modalConfirm.click();
  if (e.key === 'Escape') $modalCancel.click();
});
$overlay.addEventListener('click', (e) => {
  if (e.target === $overlay) $overlay.classList.remove('show');
});

connect();
