
const parentModel = require("../models/parent.model")
const cloudinary = require('cloudinary')
const jwt = require("jsonwebtoken");
const studentModel = require("../models/student.model");
cloudinary.config({
  cloud_name: 'dmyvk5qyq',
  api_key: '817443962198346',
  api_secret: 'YqUWDjBlyz2lZ7ckeDDWKiwOx54'
})
const parentSignUp = (req, res) => {
  const parentId = Math.floor(Math.random() * 10e5)
  // let { fullname, email, phoneNo, dateOfBirth, address, password, occupation } = req.body;

  const parentObj =
  {
    parentId,
    surName: req.body.surName,
    otherNames: req.body.otherNames,
    phoneNo: req.body.phoneNo,
    email: req.body.email,
    address: req.body.address,
    password: req.body.password,
    occupation: req.body.occupation,
    isEntranceExamDateSent: false,
    isAdmissionletterSent: false,
  }
  console.log(parentObj)
  let form = new parentModel(parentObj)
  form.save().then(() => {
    console.log("Registration Successfully")
    res.send({ status: true, message: "Registered Successfully" })
  }).catch((error) => {
    console.log(error)
    res.send({ status: false, message: "There was an error" + error })
  })
  // console.log(userObj)
}

const login = (req, res) => {
  let { email, password } = req.body
  parentModel.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: false, message: "User Not Found" })
      }
      else {
        let secret = process.env.SECRET;
        user.validatePassword(req.body.password, (err, same) => {
          if (err) {
            res.send({ status: false, message: "Invalid Password" });
          } else {
            let token = jwt.sign({ email }, secret, { expiresIn: "1d" });
            res.send({
              status: true,
              message: "Correct Password",
              parentId: user.parentId,
              token,
            });
            console.log(user.parentId)
          }
        });
      }
    })
}
const updateParent = async (req, res) => {
  // console.log(req.body)
  const { parentId } = req.body
 await parentModel.findOneAndUpdate({parentId}, {
    // all the manager info
    surName: req.body.surName,
    otherNames: req.body.otherNames,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    address: req.body.address,
    occupation:req.body.occupation,

  }).then((parent)=>
  {
    if(parent)
    {
      res.send({status:true, message: 'Updated Successfully!'})
    }
    else{
      res.send({status:false, message:'Can not update Parent'})
    }
  }).catch((error)=>
    {
        res.send({status:true, message: error})
    })
  }
const deleteParent = async (req, res) => {
  const { parentId } = req.body
  const deleteparent = await parentModel.deleteOne({ parentId })
  if (deleteparent) {
    res.send({ status: true, message: 'Parent Deleted Successfully' })
  }
  else {
    res.send({ status: false, message: 'Can not Delete Parent' })
  }
}
const findParentByEmail = () => {
  const { email } = req.body
  parentModel.find({ email: email }).
    then((parent) => {
      if (parent) {
        res.send({ status: true, parent })
      }
      else {
        res.send({ status: false, message: 'Not found!' })
      }
    })
}
const findParentById = (req, res) => {
  const { id } = req.body
  // console.log(id)
  parentModel.find({ parentId: id }).
    then((parent) => {
      if (parent) {
        res.send({ status: true, parent })
      }
      else {
        res.send({ status: false, message: 'Not found!' })
      }
    })
}
const findParentBySurName = () => {
  const { lastName } = req.body
  parentModel.find({ surName: lastName }).
    then((parent) => {
      if (parent) {
        res.send({ status: true, parent })
      }
      else {
        res.send({ status: false, message: 'Not found!' })
      }
    })
}
const getParents = async (req, res) => {
  const parents = await parentModel.find()
  if (parents) {
    res.send({ status: true, parents })
  }
  else {
    req.send({ status: false, message: 'This Field Is Empty' })
  }
}
const getStudentsByParentEmail = async (req, re) => {
  const { emaail } = req.body
  studentModel.find({ parentId })
}
module.exports = { getParents, parentSignUp, login, updateParent, deleteParent, findParentByEmail, findParentById, findParentBySurName }