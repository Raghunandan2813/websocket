import { $ } from './dom.js';

export function setupChatEvents(client, getUsername, sendChat) {
  $('btn-send').addEventListener('click', sendChat);
  $('msg-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
  });
  $('user-list').addEventListener('click', (e) => {
    const item = e.target.closest('.user-item');
    if (!item) return;
    const name = item.getAttribute('data-username');
    if (name && name !== getUsername()) {
      $('msg-input').value = `/w ${name} `;
      $('msg-input').focus();
    }
  });
}
