const staffModel = require("../models/staff.model");
const classModel = require("../models/class.model");
const studentModel = require("../models/student.model");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
cloudinary.config({
  cloud_name: "dmyvk5qyq",
  api_key: "817443962198346",
  api_secret: "YqUWDjBlyz2lZ7ckeDDWKiwOx54",
});

const addStaff = async (req, res) => {
  const staffId = `S-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  let {
    surName,
    otherNames,
    email,
    phoneNo,
    address,
    password,
    gender,
    dateOfBirth,
    role,
    classTaken,
    subjectTaken,
    salary,
  } = req.body;
  const existingStaff = await staffModel.findOne({ email });
  if (existingStaff) {
    return res.send({ status: false, message: "Email already registered" });
  }

  const staffObj = {
    staffId,
    surName,
    otherNames,
    phoneNo,
    email,
    address,
    password,
    role,
    gender,
    dateOfBirth,
    classTaken,
    subjectTaken,
    salary,
    dateRegistered: Date.now(),
  };
  let form = new staffModel(staffObj);
  form
    .save()
    .then(() => {
      res.send({
        status: true,
        message: "Registered Successfully",
        staff: form,
      });
    })
    .catch((error) => {
      console.log(error);
      res.send({ status: false, message: "There was an error" + error });
    });
  // console.log(userObj)
};
const updateStaff = async (req, res) => {
  console.log(req.body);
  const { staffId } = req.body;
  const updatestaff = await staffModel.findOneAndUpdate(
    { staffId },
    {
      // all the manager info
      surName: req.body.surName,
      otherNames: req.body.otherNames,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      address: req.body.address,
      role: req.body.role,
      gender: req.body.gender,
      dateOFBirth: req.body.dateOfBirth,
      subjectTaken: req.body.subjectTaken,
      salary: req.body.salary,
      classTaken: req.body.classTaken,
    }
  );
  if (updatestaff) {
    res.send({ status: true, message: "Updated Successfully" });
  } else {
    res.send({ status: true, message: "Cannot Update Parent" });
  }
};
const login = (req, res) => {
  let { email } = req.body;
  staffModel.findOne({ email }).then((user) => {
    if (!user) {
      res.send({ status: false, message: "User Not Found" });
    } else {
      // console.log('correct email')
      let secret = process.env.SECRET;
      user.validatePassword(req.body.password, (err, same) => {
        if (err) {
          res.send({ status: false, message: "Invalid Password" });
        } else {
          let token = jwt.sign({ email }, secret, { expiresIn: "1d" });
          // console.log('correct password')
          res.send({
            status: true,
            message: "Correct Password",
            role: user.role,
            id: user.staffId,
            token,
          });
          // console.log(user.role)
        }
      });
    }
  });
};
const deleteStaff = async (req, res) => {
  const { staffId } = req.body;
  const deleteStaff = await staffModel.findOneAndDelete({ staffId });
  if (deleteStaff) {
    res.send({ status: true, message: "Manager Deleted Successfully" });
  } else {
    res.send({ status: false, message: "Cannot Delete Manager" });
  }
};
const findStaffByEmail = (req, res) => {
  const { email } = req.body;
  staffModel.find({ email: email }).then((staff) => {
    if (staff) {
      res.send({ status: true, staff });
    } else {
      res.send({ status: false, message: "Not Found!" });
    }
  });
};
const findStaffById = (req, res) => {
  const { staffId } = req.params;
  staffModel.findOne({ staffId }).then((staff) => {
    if (staff) {
      res.send({ status: true, staff });
    } else {
      res.send({ status: false, message: "Staff Not found!" });
    }
  });
};
const findStaffBySurName = (req, res) => {
  const { lastName } = req.body;
  staffModel.find({ surName: lastName }).then((staff) => {
    if (staff) {
      res.send({ status: true, staff });
    } else {
      res.send({ status: false, message: "Not found!" });
    }
  });
};
const getStaffs = async (req, res) => {
  await staffModel.find().then((staffs) => {
    if (staffs) {
      res.send({ status: true, staffs });
    } else {
      res.send({ status: false, message: "This field is empty" });
    }
  });
};
const getTeachers = async (req, res) => {
  try {
    const teachers = await staffModel.find({ role: "Teacher" });
    if (teachers && teachers.length > 0) {
      res.send({ status: true, teachers });
    } else {
      res.send({ status: false, message: "Not Found!" });
    }
  } catch (error) {
    res
      .status(500)
      .send({
        status: false,
        message: "An error occurred",
        error: error.message,
      });
  }
};
const getStaffsByRole = async (req, res) => {
  try {
    // Fetch all staff members
    const staffs = await staffModel.find();

    // Create a mapping of roles to staffs
    const staffsByRole = {};

    // Iterate over each staff member
    staffs.forEach((staff) => {
      const role = staff.role;
      // Initialize the array for the role if it doesn't exist
      if (!staffsByRole[role]) {
        staffsByRole[role] = [];
      }
      // Add the staff member to the appropriate role
      staffsByRole[role].push(staff);
    });

    // Log the structured data
    // console.log(staffsByRole);

    // Respond with the organized staff data
    res.status(200).json({
      status: true,
      message: "Staffs organized by role",
      data: staffsByRole,
    });
  } catch (error) {
    console.error("Error fetching staff members:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching staff members",
      error: error.message,
    });
  }
};
const teachersDashboard = async (req, res) => {
  try {
    const { classTeacher } = req.body;

    // Step 1: Get the class assigned to this teacher
    const classDetails = await classModel.findOne({ classTeacher });

    if (!classDetails) {
      return res.send({ status: false, message: "Class not found!!!" });
    }

    // Step 2: Fetch full student records based on IDs
    const studentIds = classDetails.students; // e.g. ['140948', '140949']
    const students = await studentModel.find({
      studentId: { $in: studentIds },
    });

    // Step 3: Add full students back into the class details
    const response = {
      ...classDetails._doc, // spread existing class info
      students,
    };

    res.send({ status: true, classDetails: [response] });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};
const getDashboard = async (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let secret = process.env.SECRET;
  jwt.verify(token, secret, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ status: false, message: "" });
    } else {
      // console.log(result)
      res.send({ status: true, message: "welcome", result });
    }
  });
};

module.exports = {
  getDashboard,
  getStaffsByRole,
  getTeachers,
  addStaff,
  getStaffs,
  login,
  updateStaff,
  deleteStaff,
  findStaffByEmail,
  findStaffById,
  findStaffBySurName,
  teachersDashboard,
};
