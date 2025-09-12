const termModel = require("../models/term.model");
const sessionModel = require("../models/session.model");

// Create Term
const createTerm = async (req, res) => {
  try {
    console.log(req.body)
    const { termName, startDate, endDate, session } = req.body;

    const existingTerm = await termModel.findOne({ termName, session });
    if (existingTerm) {
      return res.status(400).json({ status: false, message: "Term already exists for this session" });
    }

    const term = await termModel.create({
      termName,
      startDate,
      endDate,
      session,
      status: "InActive",
    });

    res.status(201).json({ status: true, message: "Term created successfully", term });
  } catch (error) {
    console.error("createTerm error:", error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Get All Terms
const getTerms = async (req, res) => {
  try {
    const terms = await termModel.find().sort({ createdAt: -1 });
    res.json({ status: true, terms });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Update Term
const updateTerm = async (req, res) => {
  try {
    const term = await termModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!term) return res.status(404).json({ status: false, message: "Term not found" });

    res.json({ status: true, message: "Term updated successfully", term });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Delete Term
const deleteTerm = async (req, res) => {
  try {
    const deleted = await termModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: false, message: "Term not found" });

    res.json({ status: true, message: "Term deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Set Active Term
const setActiveTerm = async (req, res) => {
  try {
    const { id } = req.params;

    // Set all terms to inactive
    await termModel.updateMany({}, { status: "Inactive" });

    // Set the selected term to active
    const updatedTerm = await termModel.findByIdAndUpdate(
      id,
      { status: "Active" },
      { new: true }
    );

    if (!updatedTerm) {
      return res.status(404).json({ status: false, message: "Term not found" });
    }

    res.status(200).json({ status: true, message: "Term activated", term: updatedTerm });
  } catch (error) {
    console.error("Error activating term:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};


// Get Active Term
const getActiveTerm = async (_req, res) => {
  try {
    const term = await termModel.findOne({ status: "Active" }).populate("session");
    if (!term) return res.json({ status: false, message: "No active term" });

    res.json({ status: true, term });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

module.exports = {
  createTerm,
  getTerms,
  updateTerm,
  deleteTerm,
  setActiveTerm,
  getActiveTerm,
};