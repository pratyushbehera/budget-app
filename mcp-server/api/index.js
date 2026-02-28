import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import cors from 'cors';
import { getServer } from '../src/server.js';
import dotenv from 'dotenv';
dotenv.config();

const app = createMcpExpressApp({ host: '0.0.0.0' });
app.use(cors());

// Store transports by session ID (Note: Vercel serverless has caveats for stateful maps!)
const transports = {};

app.get('/api/mcp/sse', async (req, res) => {
    try {
        const transport = new SSEServerTransport('/api/mcp/messages', res);
        const sessionId = transport.sessionId;

        // Extract token from request (header or query param)
        const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;

        transports[sessionId] = {
            transport,
            token: token // Store the user's specific token for this session
        };

        transport.onclose = () => {
            delete transports[sessionId];
        };

        const server = getServer(transports);
        await server.connect(transport);
    } catch (error) {
        console.error('SSE Error:', error);
        if (!res.headersSent) {
            res.status(500).send('Error establishing SSE stream');
        }
    }
});

app.post('/api/mcp/messages', async (req, res) => {
    const sessionId = req.query.sessionId;
    if (!sessionId) {
        return res.status(400).send('Missing sessionId parameter');
    }

    const session = transports[sessionId];
    if (!session) {
        return res.status(404).send('Session not found');
    }

    try {
        await session.transport.handlePostMessage(req, res, req.body);
    } catch (error) {
        console.error('Message Error:', error);
        if (!res.headersSent) {
            res.status(500).send('Error handling request');
        }
    }
});

// For local testing
if (process.env.NODE_ENV !== 'production') {
    app.listen(3001, () => {
        console.log('MCP server running locally on port 3001');
    });
}

export default app;
