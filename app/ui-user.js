import { escHtml } from './dom.js';

export function updateUserList(elList, users, myId) {
  elList.innerHTML = users.map(u => {
    const isMe = u.id === myId;
    return `
      <div class="user-item" data-username="${escHtml(u.username)}">
        <div class="user-avatar">${u.username.slice(0, 2).toUpperCase()}</div>
        <div class="user-name">${escHtml(u.username)}</div>
        ${isMe ? '<span class="you-badge">you</span>' : ''}
      </div>`;
  }).join('');
}
