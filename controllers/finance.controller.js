const financeModel = require('../models/finance.model')

const addFinance = async (req, res)=>
{
    const {amountWithdrawn, withdrawnFor, dateWithdrawn} = req.body

    const financeObj = {
        amountWithdrawn,
        withdrawnFor,
        dateWithdrawn
    }
    let form = await new financeModel(financeObj)
    form.save(form)
    .then(()=>
    {
        res.send({status:true, message:'Fianance Added Successfully!!!'})
    }).catch((err)=>
    {
        reverseEasing.send({status:false, message:'There was an error' +err})
    })
}
const getFinances = async (req,res)=>
{
    const finances =  await financeModel.find()
    if (finances)
    {
        res.send({status: true, finances})
    }
    else{
        res.send({status:false, message: 'Empty Finanaces'})
    }
}
const getFinancesByDate = async (req,res)=>
{
    const {dateWithdrawn} = req.body
    const finances = await financeModel.find({dateWithdrawn})
    return (finances)
}
const getFinancesByWithdrawnFor = async (req,res)=>
{
    const {withdrawnFor}= req.body
    const finances = await financeModel.find({withdrawnFor})
    return (finances)
}
module.exports= {addFinance, getFinances, getFinancesByWithdrawnFor, getFinancesByDate}