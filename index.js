const express = require("express")
let app = express()
app.use(express.urlencoded({extended:true, limit:"5mb"}))
app.use(express.json({limit:'5mb'}))
const cors = require("cors")
app.use(cors())
const multer = require('multer')
require("dotenv").config()
const mongoose = require("mongoose");
let PORT = process.env.PORT

const parentRouter = require("./routes/parent.route")
const studentRouter = require("./routes/student.route")
const staffRouter = require("./routes/staff.route")
const managerRouter = require("./routes/manager.route")
const paymentRouter = require('./routes/payment.route')
const feesRouter = require('./routes/fees.route')
const bookRouter = require('./routes/book.route')
const roleRouter = require('./routes/roles.route')
const classRouter = require('./routes/class.route')
const subjectRouter = require('./routes/subject.route')
const emailRouter = require('./routes/email.route')
const eventRouter = require('./routes/event.route')
const gradeRouter = require('./routes/grade.route')
const attendanceRouter = require('./routes/attendance.route')
const financeRouter =  require('./routes/finance.route')

// const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for buffer
const upload = multer({ storage: storage });
const {upload_Image} = require('./controllers/upload-image.controllers')
app.use("/parent",parentRouter)
app.use("/student",studentRouter)
app.use("/event",eventRouter)
app.use("/staff",staffRouter)
app.use('/manager',managerRouter)
app.use('/payment',paymentRouter)
app.use('/fee',feesRouter)
app.use('/book',bookRouter)
app.post("/upload-image",upload.single('file'),upload_Image )
app.use('/role',roleRouter)
app.use('/class',classRouter)
app.use('/subject',subjectRouter)
app.use('/grades', gradeRouter)
app.use('/email',emailRouter)
app.use('/attendance',attendanceRouter)
app.use('/finance',financeRouter)
app.listen(PORT,()=>{
    console.log("app is running on port"+ PORT)
})
const mongo_url = 'mongodb://localhost:27017/Alhudah'
mongoose.connect(mongo_url)
.then(()=>
{
   console.log('Mongo Connected Successfully') 
}).catch
((err)=>
{
    console.log('There was a problem'+err)
})