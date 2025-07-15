const express = require ("express")
const router = express.Router()
const {checkIfNotAdmitted,checkfees, getStudentFeesToPay, saveSelectedFees, getStudentfeestoPayClone, getApplications, getStudentsByParentId, getStudents, addStudent, updateStudent, deleteStudent, findStudentById, findStudentBySurName } = require("../controllers/student.controller")

router.post("/addStudent", addStudent)
router.post("/editStudent", updateStudent)
router.post("/deleteStudent",deleteStudent)
router.post("/findStudentById",findStudentById)
router.post("/findStudentBySurName",findStudentBySurName)
router.get('/getStudents',getStudents)
// Update route to use `:parentId`
router.post('/getStudentsByParentId/:parentId', getStudentsByParentId);
router.get('/getApplications',getApplications)
router.post('/checkfees',checkfees)
router.post('/saveSelectedFees',saveSelectedFees)
router.post('/getStudentFeesToPay',getStudentFeesToPay)
router.post('/checkIfNotAdmitted',checkIfNotAdmitted)
router.post('/getgetStudentfeestoPayClone', getStudentfeestoPayClone)
module.exports = router