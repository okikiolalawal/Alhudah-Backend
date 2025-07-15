const mongoose = require ("mongoose")

let studentSchema = mongoose.Schema
({
    parentId:{type:String, required:true},
    studentId: {type:String, required: true},
    surName: {type : String, required : true},
    otherNames:{type : String, required : true},
    gender:{type : String, required : true},
    dateOfBirth:{type : String, required : true},
    nationality:{type : String, required : true},
    religion:{type : String, required : true},
    tribe:{type : String, required : true},
    classTo:{type : String, required : true},
    previousClass:{type : String, required : true},
    previousSchool:{type : String, required : true},
    schoolingType: {type : String, required : true},
    dateRegistered:{type:Date },
    isAdmitted: Boolean,
    classAdmittedTo:String,
    entranceExamScore: String,
    feesToPay: []
})
let studentModel = mongoose.model("students", studentSchema);
module.exports = studentModel;