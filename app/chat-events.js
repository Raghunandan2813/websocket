import { $ } from './dom.js';
import { systemMsg, updateUserList } from './ui.js';
import { state } from './state.js';

export const chatEvents = {
  onWelcome: (msg) => {
    state.myId = msg.payload.you.id;
    state.myUsername = msg.payload.you.username;
    updateUserList($('user-list'), msg.payload.users, state.myId);
    systemMsg($('messages'), `Connected as ${state.myUsername}`);
  },
  onUserJoined: (msg) => {
    updateUserList($('user-list'), msg.payload.users, state.myId);
    systemMsg($('messages'), `${msg.payload.username} joined`);
  },
  onUserLeft: (msg) => {
    updateUserList($('user-list'), msg.payload.users, state.myId);
    systemMsg($('messages'), `${msg.payload.username} left`);
  },
  onUsernameChanged: (msg) => {
    updateUserList($('user-list'), msg.payload.users, state.myId);
    const self = msg.payload.id === state.myId;
    if (self) state.myUsername = msg.payload.newUsername;
    systemMsg($('messages'), self ? `You are now ${state.myUsername}` : `${msg.payload.oldUsername} → ${msg.payload.newUsername}`);
  }
};
