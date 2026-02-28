# FinPal MCP Server

This directory contains the Model Context Protocol (MCP) server for FinPal.
It exposes the capabilities from the `finpal_mcp_user_stories.md` as tools that an AI agent (like Claude) can use to interact with your data.

## Important Note

This MCP server acts as an intermediary. When tools are called, it forwards the request to your core FinPal backend API. Therefore, **your main backend must be running and accessible** for this to work.

## Setup Locally

1. Install dependencies:
   ```bash
   cd mcp-server
   npm install
   ```
2. Create a `.env` file (optional but recommended for authentication):
   ```env
   # Point to your core backend API (e.g. localhost:3000 or a deployed URL)
   API_URL=http://localhost:3000/api
   # API token if your backend requires one
   API_TOKEN=your_token_here
   ```
3. Start the local server:
   ```bash
   node api/index.js
   ```
   *The server will run on `http://localhost:3001`.*
   *The SSE endpoint is at `http://localhost:3001/api/mcp/sse`.*

## Configuring an MCP Client (e.g., Claude Desktop)

To connect Claude Desktop to this server locally, use the **stdio** entry point. This is the most reliable way for local desktop use.

1. Open your Claude Desktop configuration file:
   - Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Win: `%APPDATA%\Claude\claude_desktop_config.json`
2. Add the following entry (replace `/Users/pratyushbehera/budget-app` with your actual project path):
   ```json
   {
     "mcpServers": {
       "finpal": {
         "command": "node",
         "args": ["/Users/pratyushbehera/budget-app/mcp-server/stdio.js"],
         "env": {
            "API_URL": "http://localhost:3000/api"
         }
       }
     }
   }
   ```
3. **Restart Claude Desktop** completely.

> [!NOTE]
> Using `stdio.js` directly avoids JSON parsing errors often caused by intermediate bridges. We still use the SSE version (`api/index.js`) for the Vercel deployment.

## Deploying to Vercel

Because we used Express + SSE, deployment to Vercel is extremely straightforward.

1. Install Vercel CLI (if not installed): `npm i -g vercel`
2. Run `vercel` from the `mcp-server` directory.
   ```bash
   cd mcp-server
   vercel
   ```
3. Set your `API_URL` and `API_TOKEN` Vercel environment variables directly in the Vercel dashboard.

Vercel will automatically look at `vercel.json` and map `/api/*` requests to the serverless function defined in `api/index.js`. 

Once deployed, your SSE endpoint will be something like:
`https://your-deployment-url.vercel.app/api/mcp/sse`
