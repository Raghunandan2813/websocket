const clients = new Map();

function getUserList() {
  return [...clients.values()].map(({ id, username, joinedAt }) => ({
    id,
    username,
    joinedAt,
  }));
}

module.exports = { clients, getUserList };
