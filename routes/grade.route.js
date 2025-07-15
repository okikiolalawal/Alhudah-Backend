const express = require ("express")
const router = express.Router()
const {addGrades, updateGrade, getStudentGrade, getGradeByStudentId,getGradesBySubject} = require("../controllers/grade.controller")

router.post("/addGrades", addGrades)
router.post('/updateGrade', updateGrade)
router.get('/getGradeStudent', getStudentGrade)
router.post('/getGradeByStudentId', getGradeByStudentId)
router.post('/getGradesBySubject', getGradesBySubject)
module.exports = router