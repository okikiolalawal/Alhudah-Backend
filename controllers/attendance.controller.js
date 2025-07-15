const attendanceModel = require("../models/attendance.model");
const studentModel = require("../models/student.model")
const markAttendance = async (req, res) => {
  try {
    const attendanceData = req.body;
    const today = new Date();
    console.log(today);
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ); // Time set to 00:00:00
    console.log(date);
    const session = "2024/2025";
    const term = "firstTerm";

    for (const data of attendanceData) {
      const { studentId, status, className } = data;
      const normalizedClassName = className.trim().toLowerCase();

      const markedToday = await attendanceModel.findOne({ studentId, date });

      if (markedToday) {
        await attendanceModel.updateOne(
          { studentId, date },
          { status, session, term, className: normalizedClassName }
        );
      } else {
        await attendanceModel.create({
          studentId,
          date,
          status,
          className: normalizedClassName,
          term,
          session,
        });
      }
    }

    return res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getAttendanceByDateAndClassName = async (req, res) => {
  try {
    const { date, className } = req.params;
    // console.log(req.params);

    const parsed = new Date(date);
    const parsedDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    const normalizedClassName = className.trim().toLowerCase();

    const attendance = await attendanceModel.find({
      className: normalizedClassName,
      date: parsedDate,
    })
    
    // console.log(attendance)
    const gottenStudents= []

    for( attend of attendance )
    {
      if(attend.status === "Present")
      {
        // console.log('Present')
        const studentId = attend.studentId
        // console.log(studentId)
        const student = await studentModel.findOne({studentId: studentId})
        console.log(student)
        if(student)
        {
          gottenStudents.push({
            studentName:`${student.surName} ${student.otherNames}`,
            status:attend.status,
            studentId: student.studentId
          })
        }
      }
    }
    return res.send({ status: true, gottenStudents });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res.status(500).send({
      status: false,
      message: "Error fetching attendance",
      error: error.message,
    });
  }
};
const getAttendanceByStudentIdAndTerm = async (req, res) => {
  try {
    const { studentId, term } = req.params;
    const session = '2024/2025';

    const attendance = await attendanceModel.find({
      studentId,
      term,
      session
    });

    const student = await studentModel.findOne({ studentId });

    if (!student) {
      return res.status(404).send({ status: false, message: "Student not found" });
    }
    console.log(student)
    const presentDates = [];
    const absentDates = [];

    attendance.forEach((attend) => {
      const formattedDate = new Date(attend.date).toISOString().split("T")[0]; // "YYYY-MM-DD"
      if (attend.status === "Present") {
        presentDates.push(formattedDate);
      } else {
        absentDates.push(formattedDate);
      }
    });

    const totalPresent = presentDates.length;
    const totalAbsent = absentDates.length;
    const totalSchoolDays = totalPresent + totalAbsent;

    return res.send({
      status: true,
      data: {
        studentName: `${student.surName} ${student.otherNames}`,
        presentDates,
        absentDates,
        totalPresent,
        totalAbsent,
        totalSchoolDays,
      },
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res.status(500).send({
      status: false,
      message: "Error fetching attendance",
      error: error.message,
    });
  }
};

module.exports = { markAttendance, getAttendanceByDateAndClassName,getAttendanceByStudentIdAndTerm };