module.exports = (req, res, next) => {
  const secret = req.headers["x-cron-secret"];

  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: "Unauthorized cron" });
  }

  next();
};
