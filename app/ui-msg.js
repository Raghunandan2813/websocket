import { escHtml, scrollBottom } from './dom.js';

const time = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function append(el, className, meta, text) {
  const div = document.createElement('div');
  div.className = className;
  div.innerHTML = `${meta ? `<div class="msg-meta">${meta}</div>` : ''}<div class="msg-bubble">${escHtml(text)}</div>`;
  el.appendChild(div);
  scrollBottom(el);
}

export const systemMsg = (el, txt) => append(el, 'msg system', '', txt);

export function addChatMsg(el, { from, text, timestamp }, myId) {
  const own = from.id === myId;
  append(el, `msg ${own ? 'own' : 'other'}`, own ? time(timestamp) : `${from.username} · ${time(timestamp)}`, text);
}

export function addWhisperMsg(el, { from, to, text, timestamp }, myId) {
  const own = from.id === myId;
  const meta = own ? `to ${to} (whisper) · ${time(timestamp)}` : `from ${from.username} (whisper) · ${time(timestamp)}`;
  append(el, 'msg whisper', meta, text);
}
