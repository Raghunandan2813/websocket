import { $ } from './dom.js';

export function setupModalEvents(client, getUsername) {
  $('btn-username').addEventListener('click', () => {
    $('modal-input').value = getUsername() ?? '';
    $('modal-overlay').classList.add('show');
    $('modal-input').focus();
    $('modal-input').select();
  });
  $('modal-cancel').addEventListener('click', () => $('modal-overlay').classList.remove('show'));
  $('modal-confirm').addEventListener('click', () => {
    const name = $('modal-input').value.trim();
    if (name) client.send('set_username', { username: name });
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
