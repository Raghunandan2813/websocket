import { $ } from './dom.js';

export function setupEventListeners(client, getUsername, sendChat) {
  $('btn-send').addEventListener('click', sendChat);
  $('msg-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
  });
  $('btn-username').addEventListener('click', () => {
    $('modal-input').value = getUsername() ?? '';
    $('modal-overlay').classList.add('show');
    $('modal-input').focus();
    $('modal-input').select();
  });
  $('modal-cancel').addEventListener('click', () => $('modal-overlay').classList.remove('show'));
  $('modal-confirm').addEventListener('click', () => {
    const name = $('modal-input').value.trim();
    if (name) { client.send('set_username', { username: name }); }
    $('modal-overlay').classList.remove('show');
  });
  $('modal-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') $('modal-confirm').click();
    if (e.key === 'Escape') $('modal-cancel').click();
  });
  $('modal-overlay').addEventListener('click', (e) => {
    if (e.target === $('modal-overlay')) $('modal-overlay').classList.remove('show');
  });
}
