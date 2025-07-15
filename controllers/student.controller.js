const studentModel = require("../models/student.model");
const feesModel = require("../models/fees.model")
const classModel = require("../models/class.model")
const addStudent = async (req, res) => {
  console.log(req.body);
  const studentId = Math.floor(Math.random() * 10e5);
  const studentObj = {
    parentId :  req.body.parentId,
    studentId,
    surName: req.body.surName,
    otherNames: req.body.otherNames,
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
    nationality: req.body.nationality,
    religion: req.body.religion,
    tribe: req.body.tribe,
    classTo: req.body.classTo,
    previousClass: req.body.previousClass,
    previousSchool: req.body.previousSchool,
    schoolingType: req.body.schoolingType,
    dateRegistered: new Date(),// Ensure date is properly formatted
    isAdmitted:false,
  };

  console.log(studentObj);
  const form = new studentModel(studentObj);
  await form.save().then(() => {
    res.send({ status: true, message: "Student Has Been Registered Successfully" });
  })
    .catch((err) => {
      console.log(err)
      res.send({ status: false, message: err })
    })
}
const updateStudent = async (req, res) => {
  try {
    const { studentId, surName } = req.body;
    // console.log(req.body)
    // Find the student by ID and update the fields
    await studentModel.findOneAndUpdate(
      { studentId },  // Filter to find the student by ID
      // console.log(surName)
      {
        surName: surName,
        otherNames: req.body.otherNames,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        nationality: req.body.nationality,
        religion: req.body.religion,
        tribe: req.body.tribe,
        classTo: req.body.classTo,
        previousClass: req.body.previousClass,
        previousSchool: req.body.previousSchool,
        schoolingType: req.body.schoolingType,
        dateRegistered: new Date()
      },
      // { new: true } // Return the updated document
    );
    // Send success response
    res.send({ status: true, message: 'Updated Successfully' });
    console.log('updated')
  } catch (err) {
    // Send error response
    res.send({ status: false, message: 'There was an error: ' + err.message });
  }
};
const deleteStudent = async (req, res) => {
  const { studentId } = req.body
  await studentModel.deleteOne({ studentId }).then(() => {
    res.send({ status: true, message: 'Student Deleted Successfully' })
  })
    .catch(() => {
      res.send({ status: false, message: 'Cannot Delete student' })
    })
}
const findStudentById = async (req, res) => {
  const { studentId } = req.body
  await studentModel.find({ studentId: studentId}).
    then((student) => {
      if (student) {
        // console.log('student',student)
        res.send({ status: true, student })
      }
      else {
        res.send({ status: false, message: 'Not found!' })
      }
    })
}
const findStudentBySurName = (req, res) => {
  const { surName } = req.body
  studentModel.find({ surName: surName })
    .then((student) => {
      if (student) {
        res.send({ status: true, student })
      }
      else {
        res.send({ status: false, message: 'Not found!' })
      }
    })
}
const getStudents = async (req, res)=>
{
  const students = await studentModel.find()
  if(students)
  {
    res.send({status:true, students})
  }
  else{
    res.send({status:false, message:'No Student Found'})
  }
}
const getStudentsByParentId = async (req, res) => {
  const { parentId } = req.params; // Extract from URL
  console.log('Received Parent ID:', parentId);

  try {
    const students = await studentModel.find({ parentId: parentId });
    if (students.length > 0) {
      res.send({ status: true, students });
    } else {
      res.send({ status: false, message: 'No Students Found' });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: 'Server Error' });
  }
};
const getApplications = async (req,res) =>
{
 await studentModel.find({
    isAdmitted : false
  }).then((applications)=>
  {
    res.send({status:true, applications})
  })
  .catch((err)=>
  {
    res.send({status:false,message:'There was an error:'+err})
  })
}
const checkfees = async (req, res) => {
  const { parent_Id } = req.body; // Using the original naming convention
  console.log("Parent ID:", parent_Id);

  try {
    // Find all students associated with the given parent_Id and admitted
    const students = await studentModel.find({ parentId: parent_Id, isAdmitted: true,feesToPay:[] });

    // If no students are found, return false
    if (students.length > 0) {
      console.log("Students found:", students);
      return res.status(200).send({ status: true, students });
    } else {
      // If students are found, return true and send the student data
      console.log("No students found:", students);
       res.status(200).send({ status: false, students });
    }
  } catch (error) {
    console.error("Error checking fees:", error);
    return res.status(500).send({ status: false, message: 'Server Error' });
  }
};
const saveSelectedFees = async (req, res) => {
  try {
    const { feeSelections } = req.body;
    
    // Loop through each feeSelection
    for (let i = 0; i < feeSelections.length; i++) {
      // Find student by studentId (assuming studentId is unique)
      const student = await studentModel.findOne({ studentId: feeSelections[i].studentId });

      if (student) {
        // console.log(`Student found: ${student}`);
        
        // Save or update fees for this student
        // Assuming you have a field in the student model to store selected fees
        student.feesToPay = feeSelections[i].selectedFees;
        
        // Save the updated student document
        await student.save();
        
        // console.log(`Fees saved for studentId: ${student.studentId}`);
      } else {
        console.log(`Student not found for studentId: ${feeSelections[i].studentId}`);
      }
    }

    return res.status(200).json({ status: true, message: 'Fees successfully saved for all students' });
  } catch (error) {
    // console.error(`Error saving fees: ${error.message}`);
    return res.status(500).json({ status: false, message: 'An error occurred while saving fees' });
  }
};  
const getStudentFeesToPay = async (req, res) => {
  try {
    const { parent_Id } = req.body; // Extract parent_Id from request body
    console.log(parent_Id);

    // Query to find students who are admitted and have feesToPay not empty
    const students = await studentModel.find({
      parentId: parent_Id,
      isAdmitted: true,
      feesToPay: { $exists: true, $not: { $size: 0 } } // Only return students with non-empty feesToPay
    });

    if (students.length > 0) {
      // Loop through each student and only send the feesToPay array if it exists and is not empty
      const result = students.map(student => ({
        studentId: student.studentId,
        surName: student.surName,
        otherNames: student.otherNames,
        feesToPay: student.feesToPay
      }));

      res.status(200).json({ status: true, students: result });
    } else {
      console.log('No students found with fees to pay.');
      res.status(404).json({ status: false, message: 'No students found with fees to pay.' });
    }

  } catch (error) {
    console.error(`Error fetching students: ${error.message}`);
    res.status(500).json({ status: false, message: 'There was an error fetching students' });
  }
};

const getStudentfeestoPayClone = async (req, res) => {
  try {
    const { parent_Id } = req.body;
    const feesToPay = [];

    // 1. Get all admitted students for the parent
    const getParentStudents = await studentModel.find({
      parentId: parent_Id,     // make sure this matches your schema field
      isAdmitted: true,
    });

    // 2. Loop through each student (await-friendly using for...of)
    for (const student of getParentStudents) {
      // 3. Find the class the student is in
      const foundClass = await classModel.findOne({ studentId: student.studentId });

      // 4. Build student name
      const studentName = `${student.surName} ${student.otherNames}`;

      // 5. Push relevant data to feesToPay if class was found
      if (foundClass) {
        feesToPay.push({
          studentId: student.studentId,
          studentName,
          className: foundClass.className,
          classFees: foundClass.classFees,
        });
      }
    }

    // 6. Send final result
    res.send({ status: true, feesToPay });

  } catch (error) {
    console.error("Error fetching fees:", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong while fetching fees.",
      error: error.message,
    });
  }
};

const checkIfNotAdmitted = async (req, res) => {
  const { parent_Id } = req.body;

  try {
    // Find the number of not admitted students
    const notAdmittedStudents = await studentModel.find({
      parentId: parent_Id,
      isAdmitted: false
    });
    const notAdmittedCount = notAdmittedStudents.length;

    // Find the total number of students
    const allStudents = await studentModel.find({ parentId: parent_Id });
    const allStudentsCount = allStudents.length;

    // Check if all students are admitted
    if (allStudentsCount === notAdmittedCount) {
      // Retrieve the admission form fee
      const fee = await feesModel.findOne({ fee: 'Admission Form' });
      console.log()
      // Send the fee information
      return res.send({ status: true, fee });
    } else {
      // All students are not admitted
      return res.send({ status: false, message: 'Not all students are admitted.' });
    }

  } catch (error) {
    console.error('Error checking admission status:', error);
    res.status(500).send({ status: false, message: 'Internal server error.' });
  }
};

module.exports = {checkIfNotAdmitted, getStudentFeesToPay, saveSelectedFees, getApplications, getStudentsByParentId, addStudent, updateStudent, deleteStudent, findStudentById, findStudentBySurName, getStudentfeestoPayClone, checkfees, getStudents}