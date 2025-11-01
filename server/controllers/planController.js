const { Plan } = require("../models/Budget");

exports.getPlans = async (req, res) => {
  try {
    const plan = await Plan.findOne({ userId: req.user.id });
    res.json(plan ? plan.data : {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.savePlans = async (req, res) => {
  try {
    const { data } = req.body;
    let plan = await Plan.findOne({ userId: req.user.id });

    if (plan) {
      plan.data = data;
      await plan.save();
      res.json(plan.data);
    } else {
      const newPlan = new Plan({ userId: req.user.id, data });
      await newPlan.save();
      res.status(201).json(newPlan.data);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
