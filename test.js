const { createTestClient } = require('./test/test-client');

async function run() {
  console.log('Connecting clients…\n');
  const alice = await createTestClient('Alice');
  const bob   = await createTestClient('Bob');
  const wait = () => new Promise(r => setTimeout(r, 500));

  await wait();
  alice.send(JSON.stringify({ type: 'chat', payload: { text: 'Hey Bob! WebSockets are awesome 🚀' } }));
  await wait();
  bob.send(JSON.stringify({ type: 'chat', payload: { text: 'Totally agree, Alice! Real-time is the future ✨' } }));
  await wait();
  const pingStart = Date.now();
  alice.send(JSON.stringify({ type: 'ping', payload: {} }));
  alice.once('message', (r) => {
    if (JSON.parse(r).type === 'pong') console.log(`\n[Alice] Ping latency: ${Date.now() - pingStart}ms`);
  });
  await wait();
  console.log('\nTest complete. Closing connections.');
  alice.close(); bob.close();
}

run().catch(console.error);
