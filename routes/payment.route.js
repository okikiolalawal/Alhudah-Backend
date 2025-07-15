const express = require ("express")
const router = express.Router()
const 
{getOutstandingPayment, getPaymentById, getUncompletedPayments, getPayments, paymentHistory, verifyPayment, verifyIfPayed, addPayment, approvePayment} = require("../controllers/payment.controller")

router.post("/verifyPayment", verifyPayment)
router.post("/verifyIfPayed", verifyIfPayed)
router.post('/getOutstandingPayment',getOutstandingPayment)
router.post("/addPayment",addPayment)
router.post("/paymentHistory",paymentHistory)
router.post("/approvePayment",approvePayment)
router.get('/getPayments',getPayments)
router.get('/getUncompletedPayments',getUncompletedPayments)
router.post('/getPaymentById',getPaymentById)
module.exports = router