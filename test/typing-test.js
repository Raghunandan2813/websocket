const { createTestClient } = require('./test-client');

async function testTyping() {
  console.log('Running typing tests…\n');
  const alice = await createTestClient('Alice');
  const bob   = await createTestClient('Bob');

  bob.on('message', (raw) => {
    const msg = JSON.parse(raw);
    if (msg.type === 'typing') {
      console.log(`[Bob Event] ${msg.payload.username} typing status: ${msg.payload.typing}`);
    }
  });

  await new Promise(r => setTimeout(r, 200));
  alice.send(JSON.stringify({ type: 'typing', payload: { typing: true } }));
  await new Promise(r => setTimeout(r, 500));
  alice.send(JSON.stringify({ type: 'typing', payload: { typing: false } }));
  await new Promise(r => setTimeout(r, 200));
  console.log('\nTyping test complete.');
  alice.close(); bob.close();
}

testTyping().catch(console.error);
