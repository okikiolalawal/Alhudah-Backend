const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAttendanceByDateAndClassName,
  getAttendanceByStudentIdAndTerm
} = require("../controllers/attendance.controller");

router.post("/markAttendance", markAttendance);
router.get("/getAttendanceByDateAndClassName/:className/:date", getAttendanceByDateAndClassName);
router.get('/getAttendanceByStudentIdAndTerm/:studentId/:term',getAttendanceByStudentIdAndTerm)
module.exports = router;