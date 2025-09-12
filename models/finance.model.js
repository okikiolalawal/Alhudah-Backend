const mongoose = require ("mongoose")
let financeSchema = mongoose.Schema
({
    financeId: {type:String, required: true},
    currentBalance: {type:String},
    amountWithdrawn: {type:String, required: true},
    withdrawnFor:{type:String, required: true},
    dateWithdrawn:{type:Date,required: true}
})

let financeModel = mongoose.model("finance", financeSchema);
module.exports = financeModel;