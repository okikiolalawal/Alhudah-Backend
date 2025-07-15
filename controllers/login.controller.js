const {parentModel} = require("../models/parent.model")
const {principalModel} = require("../models/principal.model")
const {teacherModel} = require ("../models/teacher.models")

const login = (req,res)=>
{
    parentModdel.findOne(req.email)
    .then((user)=>
    {
        if(user)
        {
            user.validatePassword(password,(err,same)=>
            {
                if(err)
                {
                    res.send({status:false,message:"Invalid Password"})
                }
                res.send({status:true, message:"valid Password" })
            })
        }
        teacherModel.findOne(req.email)
        .then((user)=>
        {
            
        })
    })
}