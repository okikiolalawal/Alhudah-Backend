const feesModel = require('../models/fees.model')

const getEvents = async (req, res) => {
    try {
      const events = [
        { title: "Exam Date", date: "2025-04-10" },
        { title: "PTA Meeting", date: "2025-04-15" },
      ];
  
      return res.status(200).json({ status: true, events });
    } catch (error) {
      return res.status(500).json({ status: false, message: "Server error", error });
    }
  };
  
module.exports = { getEvents }