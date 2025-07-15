const classModel = require('../models/class.model')
const studentModel = require('../models/student.model')
const subjectModel = require('../models/subject.model')

const addClass = async(req, res) => {
    console.log(req.body)
    const { className,classTeacher, classBooks, classSubjects,classFees } = req.body
    const classId = Math.floor(Math.random() * 10e5)
    const classObj = {
        classId,
        className,
        classBooks,
        classSubjects,
        classTeacher,
        classFees
    }
    let form = new classModel(classObj)
    form.save()
    .then(()=>{
        res.send({status:true, message:'Class Added Successfully'})
    })
    .catch((error)=>
    {
        res.send({status:true, message:'There was an error:'+error})
    })
}

const findClassById= async(req,res)=>
{
    const {bookId} = req.body
    const findBook = await feesModel.findOne({bookId})
    return (findBook)
}

const getStudentsByClassName = async (req, res) => {
    try {
      const { className } = req.params;
        // console.log(className)
      const foundClass = await classModel.findOne({ className });
  
      if (!foundClass) {
        return res.send({ status: false, message: 'Class Not Found!!!' });
      }
  
      const studentIds = foundClass.students;
      const classteacher = foundClass.classTeacher
      const students = await studentModel.find({ studentId: { $in: studentIds } });
  
      res.send({
        status: true,
        className: foundClass.className,
        students,
        classteacher
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  };  
const getStudentsAndSubjectsByClassName = async (req, res) => {
    try {
      const { className } = req.params;
        // console.log(className)
        const foundClass = await classModel.findOne({ className });
      if (!foundClass) {
        return res.send({ status: false, message: 'Class Not Found!!!' });
      }
  
      const studentIds = foundClass.students;
      const foundSubjects = foundClass.classSubjects
      const classteacher = foundClass.classTeacher
      const students = await studentModel.find({ studentId: { $in: studentIds } });
      const subjects = await subjectModel.find({ subject: { $in: foundSubjects } });
      res.send({
        status: true,
        className: foundClass.className,
        students,
        classteacher,
        subjects
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  };  

const updateClass = async(req,res)=>
{
    const {bookId,name, price} =  req.body

    await bookModel.findByIdAndUpdate(bookId, {
        name,
        price
    })
    .then((book)=>
    {
        if(book)
        {
            res.send({status:true, message:'Update Succesfully'})
        }
        else{
            res.send({status:false, message:'Can not Update'})
        }
    }).catch((error)=>
    {
        res.send({status:true, message: error})
    })
}

const deleteClass = async(req, res)=>
{
    const{className}= req.body
    await classModel.findOneAndDelete({className})
    if(deleteClass)
    {
        res.send({status:true, mesage:'Deleted Successfully'})
    }
    else{
        res.send({status:false, message:' There was an error'})
    }
}

const getClasses = async (req, res) => {
    try {
      // Fetch all classes
      const classes = await classModel.find();
  
      // If classes exist, fetch students for each class
      if (classes.length > 0) {
        const populatedClasses = await Promise.all(
          classes.map(async (classItem) => {
            // Fetch the student data for each studentId in the class
            const students = await studentModel.find({
              studentId: { $in: classItem.students }, // Match the student IDs
            });
  
            return {
              className: classItem.className,
              classTeacher: classItem.classTeacher,
              classsBooks: classItem.classBooks,
              classSubjects: classItem.classSubjects,
              students: students, // Attach the fetched student data
            };
          })
        );
  
        res.send({ status: true, classes: populatedClasses });
      } else {
        res.send({ status: false, message: "No classes found" });
      }
    } catch (error) {
      console.error("Error fetching classes and students:", error);
      res.status(500).send({ status: false, message: "Server error" });
    }
};

const assignTeacherToClass = async (req, res) => {
    const { teacherInfo, selectedClass } = req.body;
    const fullName = teacherInfo.surName + teacherInfo.otherNames
    console.log(fullName)
    try {
        const updatedClass = await classModel.findByIdAndUpdate(
            selectedClass,
            { classTeacher: fullName },
            { new: true } // Returns the updated document
        );

        if (updatedClass) {
            res.send({ status: true, message: 'Teacher Assigned Successfully' });
        } else {
            res.send({ status: false, message: 'Class not found' });
        }
    } catch (err) {
        res.send({ status: false, message: 'There was an error: ' + err.message });
    }
};

const addStudentToClass = async (req, res) => {
    const { className, studentId } = req.body;
    console.log(req.body)
    try {
        const classDoc = await classModel.findOne({className});

        if (!classDoc) {
            return res.send({ status: false, message: 'Class not found' });
        }

        if (!classDoc.students.includes(studentId)) {
            classDoc.students.push(studentId);
            await classDoc.save();
            res.send({ status: true, message: 'Student added to class successfully' });
        } else {
            res.send({ status: false, message: 'Student is already in this class' });
        }
    } catch (err) {
        res.send({ status: false, message: 'There was an error: ' + err.message });
    }
};

const getAllClasses = async(req, res)=>
{
    const classes = await classModel.find()
    if(classes)
    {
        res.send({status:true, classes})
    }
    else{
        res.send({status:false, message:'Empty Field'})
    }
}
module.exports= {addStudentToClass,getStudentsAndSubjectsByClassName, getAllClasses, getClasses,addClass,findClassById,getStudentsByClassName ,updateClass,deleteClass,assignTeacherToClass}