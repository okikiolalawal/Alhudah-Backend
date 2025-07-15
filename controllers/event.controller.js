const feesModel = require('../models/fees.model')
// const studentModel = require('../models/student.model')
// const addFee = (req, res) => {
//     const { fee, name, price } = req.body
//     const feeId = Math.floor(Math.random() * 10e5)
//     const feeObj = {
//         feeId,
//         fee,
//         price
//     }
//     let form = new feesModel(feeObj)
//     form.save()
//         .then(() => {
//             res.send({ status: true, message: 'Fee Added Successfully' })
//         })
//         .catch((error) => {
//             res.send({ status: true, message: 'There was an error' + error })
//         })
// }
// const findFeeById = async (req, res) => {
//     const { feeId } = req.body
//     const findFee = await feesModel.findOne({ feeId })
//     return (findFee)
// }
// const updateFee = async (req, res) => {
//     const {feeId} = req.body
//     console.log(req.body)
//     await feesModel.findOneAndUpdate({feeId},
//         {
//             fee : req.body.fee,
//             price: req.body.price
//         }
//     )
//         .then((fee) => {
//             console.log(fee)
//             if (fee) {
//                 res.send({ status: true, message: 'Update Succesfully' })
//             }
//             else {
//                 res.send({ status: false, message: 'Can not Update' })
//             }
//         }).catch((error) => {
//             res.send({ status: true, message: error })
//         })
// }
// const deletefee = async (req, res) => {
//     const { feeId } = req.body
//     console.log(feeId)
//    await feesModel.findOneAndDelete({ feeId }).then(() => {
//     res.send({ status: true, message: 'Deleted Successfully!!!' })
// });
// }
// const getEvents = async (req, res) => {
//     try {
//       const parents = await parentModel.find();
  
//       if (!parents || parents.length === 0) {
//         return res.status(404).send({ status: false, message: "No parents found" });
//       }
  
//       const events = [
//         { title: "Exam Date", date: "2025-04-10" },
//         { title: "PTA Meeting", date: "2025-04-15" },
//       ];
  
//       return res.status(200).send({ status: true, parents, events });
//     } catch (error) {
//       return res.status(500).send({ status: false, message: "Server error", error });
//     }
//   };
const getEvents = async (req, res) => {
    try {
      const events = [
        { title: "Exam Date", date: "2025-04-10" },
        { title: "PTA Meeting", date: "2025-04-15" },
      ];
  
      return res.status(200).json({ status: true, events });
    } catch (error) {
      return res.status(500).json({ status: false, message: "Server error", error });
    }
  };
  
module.exports = { getEvents }