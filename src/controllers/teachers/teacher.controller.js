// const {
//   Teacher,
//   Account,
//   Address,
// } = require("../../models/associates/associate.model");
// const errorHandler = require("../../utils/handlers/error");

// const teacherView = async (req, res, next) => {
//   try {
//     const teacher = await Account.findByPk(req.user.id, {
//       include: {
//         model: Teacher,
//         include: [Address],
//       },
//     });
//     const data = {};
//     return res.status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// };

// const teacherUpdate = async (req, res, next) => {
//   try {
//     // const data= await Teacher.teacherUpdate(req.params.id,req.body)
//     return res.status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// };

// const educationList = async (req, res, next) => {
//   const { teacherId } = req.query;
//   const data = await TeacherEducationList;
// };

// const educationCreate = async (req, res, next) => {};

// const educationView = async (req, res, next) => {};

// const educationUpdate = async (req, res, next) => {
//   rs;
// };

// const educationDelete = async (req, res, next) => {};

// const experienceList = async (req, res, next) => {};

// const experienceCreate = async (req, res, next) => {};

// const experienceView = async (req, res, next) => {};

// const experienceUpdate = async (req, res, next) => {};

// const experienceDelete = async (req, res, next) => {};

// module.exports = {
//   teacherList,
//   teacherCreate,
//   teacherView,
//   teacherUpdate,
// };
