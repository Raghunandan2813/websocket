const { parseCommand } = require('../server/command-parser');
const { executeCommand } = require('../server/commands');

function assert(cond, msg) { if (!cond) throw new Error(msg); }

function runTests() {
  const cmd1 = parseCommand('/help');
  assert(cmd1.cmd === 'help', 'Expected cmd help');
  assert(executeCommand('help').includes('joke'), 'Expected joke in help');

  const cmd2 = parseCommand('/joke');
  assert(cmd2.cmd === 'joke', 'Expected cmd joke');
  assert(executeCommand('joke', { username: 'Alice' }).includes('Alice'), 'Expected Alice in joke reply');

  assert(parseCommand('not a command') === null, 'Expected null for non-command');
  console.log('Command tests passed! ✅');
}

runTests();

