const { parseCommand } = require('../server/command-parser');
const { executeCommand } = require('../server/commands');

function assert(cond, msg) { if (!cond) throw new Error(msg); }

function runTests() {
  const cmd1 = parseCommand('/help');
  assert(cmd1.cmd === 'help', 'Expected cmd help');
  assert(executeCommand('help').includes('uptime'), 'Expected uptime in help');

  const cmd2 = parseCommand('/uptime');
  assert(cmd2.cmd === 'uptime', 'Expected cmd uptime');
  assert(executeCommand('uptime').includes('uptime'), 'Expected uptime reply');

  assert(parseCommand('not a command') === null, 'Expected null for non-command');
  console.log('Command tests passed! ✅');
}

runTests();
