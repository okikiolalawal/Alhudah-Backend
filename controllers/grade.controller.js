const gradeModel = require("../models/grade.model");
const studentModel = require("../models/student.model");
//Helper for ordinal suffix (1st, 2nd, 3rd, etc)
function getOrdinalSuffix(i) {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

const addGrades = async (req, res) => {
  try {
    const gradeArray = Array.isArray(req.body) ? req.body : [req.body];

    const savedGrades = [];

    for (const gradeObj of gradeArray) {
      const {
        studentId,
        className,
        session,
        subjectId,
        term,
        continuousAssesment,
        exam,
        teacherRemarks = "",
      } = gradeObj;

      let termData = {
        continuousAssesment,
        exam,
        subjectId,
      };

      if (exam != null) {
        const weightedAverageScore = continuousAssesment + exam;
      
        let grade;
        let remark;
      
        if (weightedAverageScore >= 75) {
          grade = "A";
          remark = "Excellent";
        } else if (weightedAverageScore >= 70) {
          grade = "B2";
          remark = "Very Good";
        } else if (weightedAverageScore >= 65) {
          grade = "B3";
          remark = "Very Good";
        } else if (weightedAverageScore >= 60) {
          grade = "C4";
          remark = "Good";
        } else if (weightedAverageScore >= 55) {
          grade = "C5";
          remark = "Good";
        } else if (weightedAverageScore >= 50) {
          grade = "C6";
          remark = "Good";
        } else if (weightedAverageScore >= 45) {
          grade = "D7";
          remark = "Fair";
        } else if (weightedAverageScore >= 40) {
          grade = "E8";
          remark = "Average";
        } else {
          grade = "F9";
          remark = "Fail";
        }
      
        termData = {
          ...termData,
          weightedAverageScore,
          grade,
          teacherRemarks: remark, // ✅ use the calculated remark
        };
      }
      

      const gradePayload = {
        studentId,
        className,
        session,
        subjectId,
      };

      if (term === 'firstTerm') {
        gradePayload.firstTermPerSubject = termData;
      } else if (term === 'secondTerm') {
        gradePayload.secondTerm = termData;
      } else if (term === 'thirdTerm') {
        gradePayload.thirdTerm = termData;
      }

      const newGrade = new gradeModel(gradePayload);
      await newGrade.save();
      savedGrades.push(newGrade);
    }

    res.send({
      status: true,
      message: "All grades added successfully.",
      grades: savedGrades,
    });

  } catch (error) {
    console.error("Error marking scores:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateGrade = async (req, res) => {
  try {
    const {
      studentId,
      session,
      subjectId,
      term,
      continuousAssesment,
      exam,
      teacherRemarks,
    } = req.body;

    // Initialize updated term data
    let termData = {
      continuousAssesment,
      exam,
      subjectId,
    };

    // Calculate only if exam is present
    if (exam != null) {
      const weightedAverage = continuousAssesment + exam;

      let grade;
      if (weightedAverage >= 75) grade = "A";
      else if (weightedAverage >= 70) grade = "B2";
      else if (weightedAverage >= 65) grade = "B3";
      else if (weightedAverage >= 60) grade = "C4";
      else if (weightedAverage >= 55) grade = "C5";
      else if (weightedAverage >= 50) grade = "C6";
      else if (weightedAverage >= 45) grade = "D7";
      else if (weightedAverage >= 40) grade = "E8";
      else grade = "F9";

      termData = {
        ...termData,
        weightedAverage,
        grade,
        teacherRemarks,
      };
    }

    // Find and update existing grade record
    const gradeRecord = await Grade.findOne({ studentId, session, subjectId });
    if (!gradeRecord)
      return res.status(404).json({ message: "Grade record not found" });

    gradeRecord[term] = termData;
    await gradeRecord.save();

    res
      .status(200)
      .json({ message: "Grade updated successfully", grade: gradeRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const getStudentGrade = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { session, term } = req.query;

    const student = await studentModel.findById(studentId);
    if (!student)
      return res.send({ status: false, message: "Student Not Found" });

    const studentClassId = student.classTo;
    const classmates = await studentModel.find({ classTo: studentClassId });

    const resultLists = [];

    for (let classmate of classmates) {
      const grades = await gradeModel.find({
        studentId: classmate._studentId,
        session,
      });

      let total = 0;
      let subjectCount = 0;
      let studentTermResults = [];

      grades.forEach((record) => {
        const termData = record[term];
        if (termData) {
          studentTermResults.push({
            subject: record.subjectName || "Unknown Subject",
            weightedAverage: termData.weightedAverage ?? "N/A",
            test1: termData.continuousAssesment ?? "N/A",
            exam: termData.exam ?? "N/A",
            grade: termData.grade ?? 'N/A',
            teacherRemarks: termData.teacherRemarks ?? 'N/A'
          });

          if (termData.weightedAverage != null) {
            total += termData.weightedAverage;
            subjectCount++;
          }
        }
      });

      // Optional: sort results by subject name
      studentTermResults.sort((a, b) => a.subject.localeCompare(b.subject));

      const overallTotal = subjectCount * 100;
      const percentage = subjectCount > 0 ? (total / overallTotal) * 100 : 0;

      resultLists.push({
        studentId: classmate.studentId,
        name: `${classmate.surName} ${classmate.otherNames}`,
        totalMarkObtained: total,
        percentage: Number(percentage.toFixed(2)),
        overallTotal,
        studentTermResults,
      });
    }

    resultLists.sort((a, b) => b.percentage - a.percentage);

    resultLists.forEach((record, index) => {
      record.position = `${index + 1}${getOrdinalSuffix(index + 1)}`;
    });

    const studentResult = resultLists.find(r => r.studentId === studentId);
    if (!studentResult) {
      return res.send({ status: false, message: 'Result not found for student' });
    }

    return res.send({ status: true, message: studentResult });
  } catch (error) {
    console.error(error);
    return res.send({ status: false, message: 'Server Error' });
  }
};
// Get grade by studentId
const getGradeByStudentId = async (req, res) => {
  const { studentId } = req.body;

  try {
    const studentGrades = await gradeModel.find({ studentId });

    if (studentGrades && studentGrades.length > 0) {
      return res.send({ status: true, studentGrades });
    } else {
      return res.send({ status: false, message: 'No grades found for this student.' });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: 'Server error', error });
  }
};

// Get grades by subjectId
const getGradesBySubject = async (req, res) => {
  const { subjectId, term, session, className } = req.body;
  console.log(req.body);

  try {
    const termKey = `${term}PerSubject`; // e.g., "firstTermPerSubject"

    // Step 1: Get all grades matching subject
    const grades = await gradeModel.find({
      session,
      className,
      [`${termKey}.subjectId`]: subjectId,
    });

    if (!grades.length) {
      return res.send({ status: false, message: "No grades found for this subject." });
    }

    // Step 2: Extract studentIds and fetch students manually
    const studentIds = grades.map((g) => g.studentId);
    const students = await studentModel.find({ studentId: { $in: studentIds } });

    // Step 3: Combine grades with student names
    const scoresWithNames = grades.map((grade) => {
      const subjectData = grade[termKey];
      const student = students.find((s) => s.studentId === grade.studentId);
      const fullName = `${student?.surName || ""} ${student?.otherNames || ""}`.trim();
      const total = (subjectData.continuousAssesment || 0) + (subjectData.exam || 0);

      return {
        studentId: grade.studentId,
        name: fullName,
        ca: subjectData.continuousAssesment,
        exam: subjectData.exam,
        total,
      };
    });

    // Step 4: Sort by total score
    scoresWithNames.sort((a, b) => b.total - a.total);

    // Step 5: Assign positions
    const withPosition = scoresWithNames.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    return res.send({ status: true, data: withPosition });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Server error", error });
  }
};



module.exports = {
  addGrades,
  updateGrade,
  getStudentGrade,
  getGradeByStudentId,
  getGradesBySubject
};
