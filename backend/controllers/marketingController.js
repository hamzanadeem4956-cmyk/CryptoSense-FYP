const MarketingStrategy = require("../models/MarketingStrategy");


// Create Strategy
const createStrategy = async (req, res) => {
  try {
    const {
      title,
      description,
      targetAudience,
      budget,
      status,
    } = req.body;

    const strategy = await MarketingStrategy.create({
      title,
      description,
      targetAudience,
      budget,
      status,
      createdBy: req.user._id,
    });

    res.status(201).json(strategy);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get All Strategies
const getStrategies = async (req, res) => {
  try {
    const strategies = await MarketingStrategy.find()
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.json(strategies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Single Strategy
const getStrategyById = async (req, res) => {
  try {
    const strategy = await MarketingStrategy.findById(
      req.params.id
    );

    if (!strategy) {
      return res.status(404).json({
        message: "Strategy not found",
      });
    }

    res.json(strategy);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Update Strategy
const updateStrategy = async (req, res) => {
  try {
    const strategy = await MarketingStrategy.findById(
      req.params.id
    );

    if (!strategy) {
      return res.status(404).json({
        message: "Strategy not found",
      });
    }

    strategy.title =
      req.body.title || strategy.title;

    strategy.description =
      req.body.description || strategy.description;

    strategy.targetAudience =
      req.body.targetAudience ||
      strategy.targetAudience;

    strategy.budget =
      req.body.budget || strategy.budget;

    strategy.status =
      req.body.status || strategy.status;

    await strategy.save();

    res.json(strategy);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Delete Strategy
const deleteStrategy = async (req, res) => {
  try {
    const strategy = await MarketingStrategy.findById(
      req.params.id
    );

    if (!strategy) {
      return res.status(404).json({
        message: "Strategy not found",
      });
    }

    await strategy.deleteOne();

    res.json({
      message: "Strategy deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createStrategy,
  getStrategies,
  getStrategyById,
  updateStrategy,
  deleteStrategy,
};