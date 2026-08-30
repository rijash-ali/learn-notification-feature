const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { inspectCurrentProject, inspectCurrentProjectWithPackage } = require('./reactPackageAnalyzer');

const server = new Server(
  {
    name: 'react-package-analyzer',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'describe_react_packages',
      description: 'Describe runtime and development packages used by the current React application',
      inputSchema: {
        type: 'object',
        properties: {
          package: {
            type: 'string',
            description: 'Optional package name to analyze usage for'
          }
        },
        additionalProperties: false
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'describe_react_packages') {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const pkgName = request.params.input && request.params.input.package;
  const result = pkgName
    ? inspectCurrentProjectWithPackage(process.cwd(), pkgName)
    : inspectCurrentProject(process.cwd());

  return {
    content: [
      {
          type: 'text',
          text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
      }
    ],
    structuredContent: result
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.info('React package analyzer MCP server running');

  // console.log(inspectCurrentProject(process.cwd()));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
