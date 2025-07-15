const express = require ("express")
const router = express.Router()
const {getStaffsByRole, getTeachers, addStaff, login,getStaffs, updateStaff, deleteStaff, findStaffByEmail, findStaffById, findStaffBySurName, teachersDashboard} = require("../controllers/staff.controller")

router.post("/addStaff", addStaff)
router.post("/login",login)
router.post("/updateStaff",updateStaff)
router.post("/deleteStaff",deleteStaff)
router.post("/findStaffByEmail",findStaffByEmail)
router.post("/SearchStaffBySurName",findStaffBySurName)
router.get("/getStaffs",getStaffs)
router.get('/getTeachers',getTeachers)
router.get('/getStaffsByRole',getStaffsByRole)
router.post('/teachersDashboard', teachersDashboard)
router.post("/findStaffById/:staffId",findStaffById)

module.exports = router