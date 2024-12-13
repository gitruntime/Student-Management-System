const express = require("express");
/**
 *  Controls teacher related endpoints
 */
const router = express.Router();
const { teacherController } = require("../../../controllers/admin/v2");
const { validate, isAdmin, authMiddleware } = require("../../../middlewares");
const {
  teacherPOSTSchema,
} = require("../../../utils/validators/v2/admin/teacher.validator");

// Account and Teacher model CRUD
router.get("/", authMiddleware, isAdmin, teacherController.teacherList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(teacherPOSTSchema),
  teacherController.teacherCreate
);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(teacherPOSTSchema),
  teacherController.teacherUpdate
);
router.delete("/:id", authMiddleware, isAdmin, teacherController.teacherDelete);

// Experience model CRUD
// router.get(
//   "/:teacherId/experiences",
//   authMiddleware,
//   isAdmin,
//   teacherController.experienceList
// );
// router.post(
//   "/:teacherId/experiences",
//   authMiddleware,
//   isAdmin,
//   teacherController.experienceCreate
// );
// router.get(
//   "/:teacherId/experiences/:id",
//   authMiddleware,
//   isAdmin,
//   teacherController.experienceView
// );
// router.put(
//   "/:teacherId/experiences/:id",
//   authMiddleware,
//   isAdmin,
//   teacherController.experienceUpdate
// );
// router.delete(
//   "/:teacherId/experiences/:id",
//   authMiddleware,
//   isAdmin,
//   teacherController.experienceDelete
// );

// router.get(
//   "/:teacherId/educations/",
//   authMiddleware,
//   isAdmin,
//   teacherController.educationList
// );

// router.post(
//   "/:teacherId/educations",
//   authMiddleware,
//   isAdmin,
//   teacherController.educationCreate
// );

// router.get(
//   "/:teacherId/educations/:id",
//   authMiddleware,
//   isAdmin,
//   teacherController.educationView
// );

// router.put(
//   "/:teacherId/educations/:id",
//   authMiddleware,
//   isAdmin,
//   teacherController.educationUpdate
// );

// router.delete(
//   "/:teacherId/educations/:id",
//   authMiddleware,
//   isAdmin,
//   teacherController.educationDelete
// );

// // Certificate model CRUD
// router.get(
//   "/:teacherId/certifications",
//   authMiddleware,
//   isAdmin,
//   teacherController.certificateList
// );
// router.post(
//   "/:teacherId/certifications",
//   authMiddleware,
//   isAdmin,
//   teacherController.certificateCreate
// );
// router.get(
//   "/:teacherId/certifications/:id",
//   authMiddleware,
//   isAdmin,
//   teacherController.certificateView
// );
// router.put(
//   "/:teacherId/certifications/:id",
//   authMiddleware,
//   isAdmin,
//   teacherController.certificateUpdate
// );
// router.delete(
//   "/:teacherId/certifications/:id",
//   authMiddleware,
//   isAdmin,
//   teacherController.certificateDelete
// );

// // Address model CRUD
// router.get(
//   "/:teacherId/addresses",
//   authMiddleware,
//   isAdmin,
//   teacherController.addressList
// );
// // BankDetail model CRUD
// router.post(
//   "/:teacherId/bank",
//   authMiddleware,
//   isAdmin,
//   validate(bankDetailSchema),
//   teacherController.bankDetailCreate,
// );
// router.get(
//   "/:teacherId/bank/:id",
//   authMiddleware,
//   isAdmin,
//   TeacherController.bankDetailView,
// );
// router.put(
//   "/:teacherId/bank/:id",
//   authMiddleware,
//   isAdmin,
//   validate(bankDetailSchema),
//   TeacherController.bankDetailUpdate,
// );
// router.delete(
//   "/:teacherId/bank/:id",
//   authMiddleware,
//   isAdmin,
//   TeacherController.bankDetailDelete,
// );

module.exports = router;
