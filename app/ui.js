import { escHtml, scrollBottom } from './dom.js';

export function addChatMsg(elContainer, { from, text, timestamp }, myId) {
  const own = from.id === myId;
  const time = new Date(timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  const el = document.createElement('div');
  el.className = `msg ${own ? 'own' : 'other'}`;
  el.innerHTML = `
    <div class="msg-meta">${own ? time : `${escHtml(from.username)} · ${time}`}</div>
    <div class="msg-bubble">${escHtml(text)}</div>
  `;
  elContainer.appendChild(el);
  scrollBottom(elContainer);
}

export function systemMsg(elContainer, text) {
  const el = document.createElement('div');
  el.className = 'msg system';
  el.innerHTML = `<div class="msg-bubble">${escHtml(text)}</div>`;
  elContainer.appendChild(el);
  scrollBottom(elContainer);
}

export function updateUserList(elList, users, myId) {
  elList.innerHTML = users.map(u => {
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
