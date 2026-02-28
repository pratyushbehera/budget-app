// Redirect all stdout to stderr to prevent non-JSON logs from breaking the MCP connection
const originalStdoutWrite = process.stdout.write;
process.stdout.write = (...args) => process.stderr.write(...args);

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getServer } from "./src/server.js";
import dotenv from 'dotenv';

// Configure dotenv silently if possible
dotenv.config();

async function run() {
    const server = getServer({});
    const transport = new StdioServerTransport();

    // Restore the real stdout for the MCP transport
    process.stdout.write = originalStdoutWrite;

    await server.connect(transport);
    console.error("FinPal MCP Server running on stdio");
}

run().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
