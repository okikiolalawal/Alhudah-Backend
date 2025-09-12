const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: { type: String },
  className: { type: String },
  session: { type: String },

  firstTermPerSubject: {
    firstCa: Number,
    secondCa: Number,
    exam: Number,
    continuousAssesment: Number,
    weightedAverageScore: Number,
    grade: { type: String, enum: ['A','B2','B3','C4','C5','C6','D7','E8','F9'] },
    subjectId: { type: String },
    teacherRemarks: { type: String, enum: ['Excellent','Very Good','Good','Fair','Average','Fail'] },
    position: String
  },

  secondTerm: {
    firstCa: Number,
    secondCa: Number,
    exam: Number,
    continuousAssesment: Number,
    weightedAverageScore: Number,
    grade: { type: String, enum: ['A','B2','B3','C4','C5','C6','D7','E8','F9'] },
    subjectId: { type:String, ref: 'Subject' },
    teacherRemarks: { type: String, enum: ['Excellent','Very Good','Good','Fair','Average','Fail'] },
    position: String,
    overallTotal: Number,
    totalMarkObtained: Number,
    percentage: Number
  },

  thirdTerm: {
    firstCa : Number,
    secondCa: Number,
    exam: Number,
    continuousAssesment: Number,
    weightedAverageScore: Number,
    grade: { type: String, enum: ['A','B2','B3','C4','C5','C6','D7','E8','F9'] },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    teacherRemarks: { type: String, enum: ['Excellent','Very Good','Good','Fair','Average','Fail'] },
    position: String,
    overallTotal: Number,
    totalMarkObtained: Number,
    percentage: Number
  },

  // term-level totals
  firstTermOverallTotal: Number,
  firstTermTotalMarkObtained: Number,
  firstTermPercentage: Number,
  firstTermPosition: String,

  secondTermOverallTotal: Number,
  secondTermTotalMarkObtained: Number,
  secondTermPercentage: Number,
  secondTermPosition: String,

  thirdTermOverallTotal: Number,
  thirdTermTotalMarkObtained: Number,
  thirdTermPercentage: Number,
  thirdTermPosition: String
});

const gradeModel = mongoose.model('Grade', gradeSchema);
module.exports = gradeModel;
