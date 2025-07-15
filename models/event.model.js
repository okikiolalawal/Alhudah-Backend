const mongoose = require ("mongoose")
let eventSchema = mongoose.Schema
({
    eventId: {type:String, required:true},
    title: {type:String, required:true},
    date: [{type: Date}]
})

let eventModel = mongoose.model("events", eventSchema);
module.exports = eventModel;