import { z } from "zod";
import axios from "axios";
import crypto from "crypto";

// Read API URL and optional token from environment variables
const API_URL = process.env.API_URL || "http://localhost:5001/api";
const API_TOKEN = process.env.API_TOKEN || "";

// Helper to get current month in YYYY-MM
const getCurrentMonth = () => {
    return new Date().toISOString().substring(0, 7);
};

export function registerTools(server, transports = {}) {
    // Helper to get categoryId by name
    const getCategoryIdByName = async (name, type, token) => {
        const response = await axios.get(`${API_URL}/categories`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const categories = response.data;
        let cat = categories.find(c => c.name.toLowerCase() === name.toLowerCase());

        if (!cat) {
            // Auto-create category if it doesn't exist
            const createResponse = await axios.post(`${API_URL}/categories`, {
                type: type === 'income' ? 'Income' : 'Expense',
                group: type === 'income' ? 'Income' : 'Others',
                name: name
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            cat = createResponse.data;
        }
        return cat._id;
    };

    const getHeaders = (extra) => {
        const token = transports[extra.sessionId]?.token || API_TOKEN;
        return { Authorization: `Bearer ${token}` };
    };

    // 1. Tool: add_transaction
    server.tool(
        "add_transaction",
        "Create a new income or expense transaction",
        {
            amount: z.number().describe("Transaction amount (must be positive)"),
            type: z.enum(["income", "expense"]).describe("Transaction type"),
            category: z.string().describe("Transaction category"),
            note: z.string().optional().describe("Optional note for transaction"),
            date: z.string().optional().describe("ISO date string for transaction")
        },
        async ({ amount, type, category, note, date }, extra) => {
            const headers = getHeaders(extra);
            try {
                const categoryId = await getCategoryIdByName(category, type, headers.Authorization.replace('Bearer ', ''));
                const id = crypto.randomUUID();
                const response = await axios.post(`${API_URL}/transactions`, {
                    id, amount, type, category, categoryId,
                    notes: note, date: date || new Date().toISOString().split('T')[0]
                }, { headers });
                return { content: [{ type: "text", text: `Transaction created: ${JSON.stringify(response.data)}` }] };
            } catch (error) {
                return { content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }], isError: true };
            }
        }
    );

    // 2. Tool: update_transaction
    server.tool(
        "update_transaction",
        "Update an existing transaction.",
        {
            transactionId: z.string().describe("ID of the transaction to update"),
            amount: z.number().optional().describe("New amount"),
            category: z.string().optional().describe("New category"),
            type: z.enum(["income", "expense"]).optional().describe("Transaction type"),
            note: z.string().optional().describe("New note"),
            date: z.string().optional().describe("New date")
        },
        async ({ transactionId, amount, category, type, note, date }, extra) => {
            const headers = getHeaders(extra);
            try {
                const payload = {};
                if (amount !== undefined) payload.amount = amount;
                if (category !== undefined) {
                    payload.category = category;
                    payload.categoryId = await getCategoryIdByName(category, type || 'expense', headers.Authorization.replace('Bearer ', ''));
                }
                if (note !== undefined) payload.notes = note;
                if (date !== undefined) payload.date = date;

                const response = await axios.put(`${API_URL}/transactions/${transactionId}`, payload, { headers });
                return { content: [{ type: "text", text: `Transaction updated: ${JSON.stringify(response.data)}` }] };
            } catch (error) {
                return { content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }], isError: true };
            }
        }
    );

    // 3. Tool: delete_transaction
    server.tool(
        "delete_transaction",
        "Remove a transaction.",
        { transactionId: z.string().describe("ID of the transaction to delete") },
        async ({ transactionId }, extra) => {
            const headers = getHeaders(extra);
            try {
                await axios.delete(`${API_URL}/transactions/${transactionId}`, { headers });
                return { content: [{ type: "text", text: `Transaction deleted.` }] };
            } catch (error) {
                return { content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }], isError: true };
            }
        }
    );

    // 4. Tool: get_transactions
    server.tool(
        "get_transactions",
        "Retrieve transactions for a specific month.",
        {
            month: z.string().optional().describe("Month (YYYY-MM). Defaults to current."),
            limit: z.number().optional().describe("Results per page")
        },
        async ({ month, limit }, extra) => {
            const headers = getHeaders(extra);
            try {
                const m = month || getCurrentMonth();
                const response = await axios.get(`${API_URL}/transactions?month=${m}&limit=${limit || 50}`, { headers });
                return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
            } catch (error) {
                return { content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }], isError: true };
            }
        }
    );

    // 5. Tool: set_budget
    server.tool(
        "set_budget",
        "Create or update category budget.",
        {
            category: z.string().describe("Budget category"),
            amount: z.number().describe("Budget amount")
        },
        async ({ category, amount }, extra) => {
            const headers = getHeaders(extra);
            try {
                const getResponse = await axios.get(`${API_URL}/plans`, { headers });
                const currentData = getResponse.data || {};
                currentData[category] = amount;
                await axios.post(`${API_URL}/plans`, currentData, { headers });
                return { content: [{ type: "text", text: `Budget updated for ${category}: ${amount}` }] };
            } catch (error) {
                return { content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }], isError: true };
            }
        }
    );

    // 6. Tool: get_budget_status
    server.tool(
        "get_budget_status",
        "Check budget usage for a category.",
        {
            category: z.string().describe("Budget category to check"),
            month: z.string().optional().describe("Month (YYYY-MM).")
        },
        async ({ category, month }, extra) => {
            const headers = getHeaders(extra);
            try {
                const m = month || getCurrentMonth();
                const response = await axios.get(`${API_URL}/dashboard?month=${m}`, { headers });
                const status = response.data.categoryPlanUsage?.[category];
                if (!status) return { content: [{ type: "text", text: `No budget/data for ${category} in ${m}` }] };
                return { content: [{ type: "text", text: JSON.stringify(status) }] };
            } catch (error) {
                return { content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }], isError: true };
            }
        }
    );

    // 7. Tool: get_total_spent
    server.tool(
        "get_total_spent",
        "Calculate total spending for a month.",
        { month: z.string().optional().describe("Month (YYYY-MM)") },
        async ({ month }, extra) => {
            const headers = getHeaders(extra);
            try {
                const m = month || getCurrentMonth();
                const response = await axios.get(`${API_URL}/dashboard?month=${m}`, { headers });
                return { content: [{ type: "text", text: `Total spending for ${m}: ${response.data.overview?.totalExpense || 0}` }] };
            } catch (error) {
                return { content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }], isError: true };
            }
        }
    );

    // 8. Tool: get_category_breakdown
    server.tool(
        "get_category_breakdown",
        "Return spending grouped by category.",
        { month: z.string().optional().describe("Month (YYYY-MM)") },
        async ({ month }, extra) => {
            const headers = getHeaders(extra);
            try {
                const m = month || getCurrentMonth();
                const response = await axios.get(`${API_URL}/dashboard?month=${m}`, { headers });
                return { content: [{ type: "text", text: JSON.stringify(response.data.categorySpend || {}) }] };
            } catch (error) {
                return { content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }], isError: true };
            }
        }
    );

    // 9. Tool: get_spending_trend
    server.tool(
        "get_spending_trend",
        "Return spending trend data.",
        { month: z.string().optional().describe("Month (YYYY-MM)") },
        async ({ month }, extra) => {
            const headers = getHeaders(extra);
            try {
                const m = month || getCurrentMonth();
                const response = await axios.get(`${API_URL}/dashboard?month=${m}`, { headers });
                return { content: [{ type: "text", text: JSON.stringify(response.data.monthlyTrend || {}) }] };
            } catch (error) {
                return { content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }], isError: true };
            }
        }
    );

    // 10. Tool: get_categories
    server.tool(
        "get_categories",
        "List all available transaction categories.",
        {},
        async (_, extra) => {
            const headers = getHeaders(extra);
            try {
                const response = await axios.get(`${API_URL}/categories`, { headers });
                return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
            } catch (error) {
                return { content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }], isError: true };
            }
        }
    );
}
