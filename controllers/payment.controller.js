const paymentModel = require("../models/payment.model");
const studentModel = require("../models/student.model");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
const axios = require("axios"); // Import axios
require("dotenv").config();
const classModel = require("../models/class.model");
const feesModel = require('../models/fees.model')
const bookModel = require('../models/book.model')

// Helper function to generate random string
const get_random_string = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
// Verify payment using Paystack
const verifyPayment = async (req, response) => {
  const { reference } = req.body;
  console.log(reference);

  try {
    const res = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (res.status === 200 && res.data.data.status === "success") {
      let ref = get_random_string(6); // Generate bookingRef here
      console.log("Booking Reference:", ref);

      response.send({ status: true, message: "Transaction Verified", ref });
    } else {
      response
        .status(400)
        .send({ status: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error in verification:", error.message);
    response
      .status(500)
      .send({
        status: false,
        message: "Error verifying payment: " + error.message,
      });
  }
};
// Add payment to the database and send a receipt
const addPayment = async (req, res) => {
  console.log(req.body);
  const {
    Price,
    email,
    payedFor,
    fullName,
    parentId,
    studentId,
    studentName,
  } = req.body;
  // console.log(req.body)
  if (!payedFor || !parentId || !Price) {
    return res
      .status(400)
      .send({ status: false, message: "Missing required fields" });
    console.log("there");
  }
  let bookingRef = get_random_string(6); // Ensure each payment has a unique reference

  const paymentObj = {
    amountPaid: Price,
    email,
    payedFor,
    fullName,
    studentName,
    parentId,
    paymentRef: bookingRef,
    DatePayed: Date.now(),
    isApproved: false,
    studentId
  };
  console.log("payment");
  try {
    const payment = new paymentModel(paymentObj);
    await payment.save();
    console.log("here");
    const receiptPath = generateReceipt(paymentObj);
    await sendReceiptEmail(paymentObj, receiptPath);

    res.send({
      status: true,
      message: "Payment added and receipt sent",
      bookingRef,
    });
  } catch (error) {
    console.error("Error adding payment:", error.message);
    res
      .status(500)
      .send({
        status: false,
        message: "Error adding payment: " + error.message,
      });
  }
};
// Generate PDF receipt
const generateReceipt = (paymentObj) => {
  const doc = new PDFDocument();
  const receiptDir = path.join(__dirname, "receipts");

  if (!fs.existsSync(receiptDir)) {
    fs.mkdirSync(receiptDir);
  }

  const receiptPath = path.join(
    receiptDir,
    `receipt_${paymentObj.paymentRef}.pdf`
  );

  // Path to the school's logo image (customize this path)
  const logoPath = path.join(__dirname, "../logo-removebg-preview.png");

  // Pipe the PDF into the file
  doc.pipe(fs.createWriteStream(receiptPath));

  // Styling and layout for receipt
  // Add the school's logo at the top
  doc.image(logoPath, {
    fit: [80, 80], // Adjust logo size
    align: "center",
  });

  // Add school name
  doc.fontSize(22).text("Al-Hudah Group Of Schools", { align: "center" });

  // Add a subtitle (e.g., Checkout Receipt)
  doc.moveDown(0.5);
  doc.fontSize(18).text("Payment Receipt", { align: "center" });

  // Add line separator (for a cleaner design)
  doc.moveDown(0.5);
  doc
    .strokeColor("#4CAF50")
    .lineWidth(2)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();

  // Add transaction information similar to the checkout page
  doc.moveDown(1);

  // Receipt Information (formatted like the checkout page)
  const receiptFields = [
    { label: "Name", value: paymentObj.fullName },
    { label: "Email", value: paymentObj.email },
    { label: "Paying For/Description", value: paymentObj.payedFor },
    { label: "Amount", value: `₦${paymentObj.amountPaid}` },
    { label: "Date", value: new Date(paymentObj.DatePayed).toLocaleString() },
    { label: "Transaction Reference", value: paymentObj.paymentRef },
  ];

  receiptFields.forEach((field) => {
    doc
      .fontSize(14)
      .text(`${field.label}:`, { continued: true, width: 150 })
      .font("Helvetica-Bold")
      .text(field.value);
    doc.moveDown(0.5);
  });

  // Final separator line
  doc.moveDown(1);
  doc
    .strokeColor("#4CAF50")
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();

  // Footer message (customized)
  doc.moveDown(1.5);
  doc.fontSize(12).text("Thank you for your payment!", { align: "center" });
  doc.text("For any inquiries, please contact the school administration.", {
    align: "center",
  });
  doc.text("Phone: 123-456-7890 | Email: info@school.com", { align: "center" });

  // End and finalize the document
  doc.end();

  return receiptPath;
};
// Send receipt via email
const sendReceiptEmail = async (paymentObj, receiptPath) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Use environment variable
        pass: process.env.EMAIL_PASS, // Use environment variable
      },
    });

    let info = await transporter.sendMail({
      from: "Al-Hudah Group Of Schools",
      to: paymentObj.email, // Use the payer's email
      subject: "Payment Receipt",
      text: "Thank you for your payment. Please find your receipt attached.",
      attachments: [
        {
          filename: `receipt_${paymentObj.paymentRef}.pdf`,
          path: receiptPath,
        },
      ],
    });

    console.log("Receipt email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
// Verify if payment is completed
const verifyIfPayed = async (req, res) => {
  const { parent_Id } = req.body;

  try {
    const students = await studentModel.find({ parentId: parent_Id });
    const count = students.length;

    const filteredPayments = await paymentModel.find({ parentId: parent_Id });
    const admittedStudents = await studentModel.find({
      parentId: parent_Id,
      isAdmitted: true,
    });

    if (filteredPayments.length >= count) {
      return res.send({ status: true });
    }

    res.send({ status: false });
  } catch (err) {
    console.error("Error verifying payments:", err);
    res.status(500).send({ status: false, message: "Server Error" });
  }
};
const approvePayment = async (req, res) => {
  const { paymentRef } = req.body;
  console.log(paymentRef)
  try {
    // Find the payment using the payment reference
    const payment = await paymentModel.findOne({ paymentRef });
    // console.log(payment)
    if (payment) {
      // If payment is found, mark it as approved
      payment.isApproved = true;
      await payment.save(); // Ensure save() is awaited

      // Send a success response
      res.send({ status: true, message: "Approved Successfully!" });
    } else {
      // If payment is not found, send a not found response
      res.status(404).send({ status: false, message: "Payment not found" });
    }
  } catch (error) {
    // Catch and log any errors
    console.error("Error approving payment:", error);

    // Send an error response
    res
      .status(500)
      .send({
        status: false,
        message: "An error occurred while approving payment",
      });
  }
};
const paymentHistory = async (req, res) => {
  const { parent_Id } = req.body;
  const payments = await paymentModel.find({ parentId: parent_Id });
  if (payments) {
    res.send({ status: true, payments });
  } else {
    res.send({ status: false, message: "No payments has been made" });
  }
};
const getPayments = async (req, res) => {
  try{
    const payments = await paymentModel.find();
    if (!payments.length) {
      res.send({ status: false, message:'No payments found' });
    }
    const studentIds= [...new Set(payments.map(p=>p.studentId))]
    const students = await studentModel.find({studentId: { $in: studentIds } })
  
    const studentMap= {};
    students.forEach(s =>{
      studentMap[s.studentId] = `${s.surName} ${s.otherNames}`
    })
  
    const formatted = payments.map(p =>({
      fullName: studentMap[p.studentId] || 'Unknown Student',
      paymentRef: p.paymentRef,
      amountPaid:p.amountPaid,
      DatePayed:p.DatePayed,
      description:p.payedFor
    }))
    res.send({status:true, payments:formatted})
  }
 catch(error)
 {
  console.error(error);
  res.status(500).send({status:false, message:'Server Error:', error})
 }
};
const getUncompletedPayments = async (req, res) => {
  try {
    // Get all classes (without populating students)
    const classes = await classModel.find();
    const result = [];

    for (const classItem of classes) {
      const unpaidStudents = [];

      // Loop through student IDs (which are strings)
      for (const studentId of classItem.students) {
        // Fetch the student using studentId (assuming studentId is a string)
        const student = await studentModel.findOne({ studentId });

        if (student) {
          // Calculate total fees the student has to pay, making sure the prices are treated as numbers
          const totalFeesToPay = student.feesToPay.reduce(
            (acc, fee) => acc + Number(fee.price), // Ensure fee.price is a number
            0
          );

          // Fetch payments made by the student
          const payments = await paymentModel.find({
            studentId: student.studentId, // Use studentId as string
          });

          // Calculate total amount paid, ensuring amounts are treated as numbers
          const totalAmountPaid = payments.reduce(
            (acc, payment) => acc + Number(payment.amountPaid),
            0
          );

          // Check if student has unpaid balance
          if (totalAmountPaid < totalFeesToPay) {
            unpaidStudents.push({
              studentId: student.studentId,
              name: `${student.surName} ${student.otherNames}`,
              totalFeesToPay,
              totalAmountPaid,
              balanceDue: totalFeesToPay - totalAmountPaid,
            });
          }
        }
      }

      // Push the class and its unpaid students only if there are unpaid students
      if (unpaidStudents.length > 0) {
        result.push({
          className: classItem.className,
          students: unpaidStudents,
        });
      }
    }

    // Send the final result
    res.send({ status: true, classes: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};
const getOutstandingPayment = async (req, res) => {
  try {
    const { parent_Id } = req.body;

    const parentChildren = await studentModel.find({ parent_Id }); // await here

    let totalOutstanding = 0;

    for (const student of parentChildren) {
      const studentClass = await classModel
        .findById(student.classTo)
        .populate('classFees')
        .populate('classBooks');

      if (!studentClass) continue;

      // Calculate total amount expected (sum of fees and books)
      const totalFees = studentClass.fees.reduce((sum, fee) => sum + fee.amount, 0);
      const totalBooks = studentClass.books.reduce((sum, book) => sum + book.amount, 0);

      const totalExpected = totalFees + totalBooks;

      // Assuming `student.amountPaid` holds the amount this student has paid
      const paid = student.amountPaid || 0;

      const outstanding = totalExpected - paid;
      totalOutstanding += outstanding;
    }

    return res.status(200).json({ totalOutstanding });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};
const getPaymentById = async (req,res)=>
{
  const {paymentRef} = req.body
  const payment = await paymentModel.findOne({paymentRef})
  if(payment)
  {
    res.send({status:true, payment})
  }
  else{
    res.send({status:false, message: 'Not Found!!!'})
  }
}
module.exports = {
  getUncompletedPayments,
  getPayments,
  approvePayment,
  verifyPayment,
  verifyIfPayed,
  addPayment,
  paymentHistory,
  getOutstandingPayment,
  getPaymentById
};