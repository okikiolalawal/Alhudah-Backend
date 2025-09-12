const express = require ("express")
const router = express.Router()
const {addGrades, updateGrade, getStudentGrade, getGradeByStudentId,getGradesBySubject,getGradesByClass, getStudentsResultsByParentId} = require("../controllers/grade.controller")
const {addActiveSessionAndTerm} = require('../middleware/checkAcademicPeriod')
router.post("/addGrades", addGrades)
router.post('/updateGrade', updateGrade)
router.get('/getGradeStudent', getStudentGrade)
router.post('/getGradeByStudentId', getGradeByStudentId)
router.post('/getGradesBySubject', getGradesBySubject)
router.get("/getGradesByClass/:className", getGradesByClass);
router.get('/getStudentsResultsByParentId/:parentId', getStudentsResultsByParentId)
module.exports = router