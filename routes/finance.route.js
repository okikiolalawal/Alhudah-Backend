const express = require('express')
const router = express.Router()
const {addFinance, getFinances,getFinancesByWithdrawnFor, getFinancesByDate} = require('../controllers/finance.controller')

router.get('/getFinances', getFinances)
router.post('/addFinance', addFinance)
router.post('/getFinancesByWithdrawnFor', getFinancesByWithdrawnFor)
router.post('/getFinancesByDate', getFinancesByDate)

module.exports = router