const { createTestClient } = require('./test/test-client');

async function run() {
  console.log('Connecting clients…\n');
  const alice = await createTestClient('Alice');
  const bob   = await createTestClient('Bob');

  await new Promise(r => setTimeout(r, 500));
  alice.send(JSON.stringify({ type: 'chat', payload: { text: 'Hey Bob! WebSockets are awesome 🚀' } }));

  await new Promise(r => setTimeout(r, 500));
  bob.send(JSON.stringify({ type: 'chat', payload: { text: 'Totally agree, Alice! Real-time is the future ✨' } }));

  await new Promise(r => setTimeout(r, 500));
  const pingStart = Date.now();
  alice.send(JSON.stringify({ type: 'ping', payload: {} }));
  alice.once('message', (raw) => {
    const msg = JSON.parse(raw);
    if (msg.type === 'pong') {
      console.log(`\n[Alice] Ping latency: ${Date.now() - pingStart}ms`);
    }
  });

  await new Promise(r => setTimeout(r, 500));
  console.log('\nTest complete. Closing connections.');
  alice.close();
  bob.close();
}

run().catch(console.error);
