const { EventParticipation, StudentExam, Award } = require("./academic.model");
const { Attendance } = require("./attendance.model");
const { Mark } = require("./marks.model");
const { MedicalRecord } = require("./medical.model");
const { Student } = require("./student.model");

module.exports = {
  Student,
  Attendance,
  Mark,
  MedicalRecord,
  EventParticipation,
  StudentExam,
  Award
};
