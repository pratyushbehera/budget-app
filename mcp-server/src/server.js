import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools.js";

export function getServer(transports) {
    const server = new McpServer({
        name: "FinPal MCP",
        version: "1.0.0",
    });

    registerTools(server, transports);
    return server;
}
