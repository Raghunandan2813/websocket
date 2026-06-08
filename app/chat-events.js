import { $ } from './dom.js';
import { systemMsg } from './ui-msg.js';
import { updateUserList } from './ui-user.js';
import { state } from './state.js';

export const chatEvents = {
  onWelcome: (m) => {
    state.myId = m.payload.you.id;
    state.myUsername = m.payload.you.username;
    updateUserList($('user-list'), m.payload.users, state.myId);
    systemMsg($('messages'), `Connected as ${state.myUsername}`);
  },
  onUserJoined: (m) => {
    updateUserList($('user-list'), m.payload.users, state.myId);
    systemMsg($('messages'), `${m.payload.username} joined`);
  },
  onUserLeft: (m) => {
    updateUserList($('user-list'), m.payload.users, state.myId);
    systemMsg($('messages'), `${m.payload.username} left`);
  },
  onUsernameChanged: (m) => {
    updateUserList($('user-list'), m.payload.users, state.myId);
    const self = m.payload.id === state.myId;
    if (self) state.myUsername = m.payload.newUsername;
    const desc = self ? `You are now ${state.myUsername}` : `${m.payload.oldUsername} → ${m.payload.newUsername}`;
    systemMsg($('messages'), desc);
  }
};
