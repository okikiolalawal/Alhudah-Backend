const mongoose = require('mongoose')
let paymentSchema = mongoose.Schema
({
    paymentRef: {type: String, required: true},
    fullName: {type:String, required:true},
    studentName:{type:String},
    parentId: {type: String, required: true},
    payedFor: {type: String, required:true},
    amountPaid: {type:String,required:true},
    studentId: {type: String},
    DatePayed: {type:Date, required: true},
    isApproved:{type:Boolean}
})
let paymentModel = mongoose.model("payments", paymentSchema);
module.exports = paymentModel;