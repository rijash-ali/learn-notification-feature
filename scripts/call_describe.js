(async () => {
  const path = require('path');
  const sdkBase = path.join(process.cwd(), 'node_modules', '@modelcontextprotocol', 'sdk', 'dist', 'cjs');
  const { Client } = require(path.join(sdkBase, 'client', 'index.js'));
  const { StdioClientTransport } = require(path.join(sdkBase, 'client', 'stdio.js'));
  const types = require(path.join(sdkBase, 'types.js'));

  const client = new Client({ name: 'local-client', version: '1.0.0' });

  const transport = new StdioClientTransport({
    command: 'node',
    args: ['./src/mcp/server.js'],
    cwd: process.cwd(),
    stderr: 'pipe'
  });

  try {
    await client.connect(transport);

    const list = await client.request({ method: 'tools/list' }, types.ListToolsResultSchema);
    console.log('Available tools:', list.tools.map(t => t.name));

    const callResult = await client.request({ method: 'tools/call', params: { name: 'describe_react_packages', input: {} } }, types.CallToolResultSchema);

    console.log('Tool call content:');
    if (callResult.content) {
      for (const block of callResult.content) {
        if (block.type === 'text') console.log(block.text);
        else console.log(block);
      }
    }

    console.log('\nStructured content:');
    console.log(JSON.stringify(callResult.structuredContent, null, 2));

    await client.close();
    await transport.close();
  } catch (err) {
    console.error(err);
    try { await transport.close(); } catch (e) {}
    process.exit(1);
  }
})();
