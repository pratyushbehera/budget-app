require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const connectDB = require("./config/db");
const cron = require("node-cron");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const planRoutes = require("./routes/planRoutes");
const insightRoutes = require("./routes/insightRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const groupRoutes = require("./routes/groupRoutes");
const recurringRoutes = require("./routes/recurringRoutes");

const { runRecurringCron } = require("./jobs/recurringCron");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(compression());

app.get("/", (req, res) => res.send("Budget App API running"));

// Feature routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api", recurringRoutes);

(async () => {
  await connectDB();

  cron.schedule("0 3 * * *", async () => {
    console.log("Running recurring cron...");
    await runRecurringCron();
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
