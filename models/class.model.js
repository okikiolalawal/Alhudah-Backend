const mongoose = require ("mongoose")
let classSchema = mongoose.Schema
({
    classId: {type:String, required:true},
    className: {type:String, required:true},
    classTeacher: String,
    students: [{ type:String}],
    classBooks: [{type: String}],
    classFees: [{type: String}],
    classSubjects: [{type: String}]
})

let classModel = mongoose.model("class", classSchema);
module.exports = classModel;

