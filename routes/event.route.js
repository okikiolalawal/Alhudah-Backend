const express = require ("express")
const router = express.Router()
const {getEvents} = require("../controllers/event.controller")

router.get("/getEvents",getEvents)
module.exports = router