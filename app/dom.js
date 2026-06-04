export const $ = (id) => document.getElementById(id);
export const escHtml = (str) => str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export const scrollBottom = (el) => { el.scrollTop = el.scrollHeight; };
