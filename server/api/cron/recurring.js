import connectDB from "../../config/db";
import { runRecurringCron } from "../../jobs/recurringCron";

export default async function handler(req, res) {
  try {
    await connectDB();
    await runRecurringCron();

    res.status(200).json({
      ok: true,
      message: "Recurring cron executed",
    });
  } catch (err) {
    console.error("Vercel recurring cron failed", err);
    res.status(500).json({ message: err.message });
  }
}
