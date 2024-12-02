const express = require("express");
/**
 *  Controls teacher related endpoints
 */
const router = express.Router();
const TeacherController = require("../../controllers/admin/teacher.controller");
const { validate } = require("../../middlewares/validation.middleware");
const { addressSchema } = require("../../utils/validators/common.validator");
const { isAdmin, authMiddleware } = require("../../middlewares");
const {
  teacherCreateSchema,
  teacherUpdateSchema,
  experienceSchema,
  certificateSchema,
} = require("../../utils/validators/admin");
const {
  educationSchema,
} = require("../../utils/validators/admin/teacher.validator");

// Account and Teacher model CRUD
router.get("/", authMiddleware, isAdmin, TeacherController.teacherList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(teacherCreateSchema),
  TeacherController.teacherCreate
);
router.get("/:id", authMiddleware, isAdmin, TeacherController.teacherView);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(teacherUpdateSchema),
  TeacherController.teacherUpdate
);
router.delete("/:id", authMiddleware, isAdmin, TeacherController.teacherDelete);

// Experience model CRUD
router.get(
  "/:teacherId/experiences",
  authMiddleware,
  isAdmin,
  TeacherController.experienceList
);
router.post(
  "/:teacherId/experiences",
  authMiddleware,
  isAdmin,
  validate(experienceSchema),
  TeacherController.experienceCreate
);
router.get(
  "/:teacherId/experiences/:id",
  authMiddleware,
  isAdmin,
  TeacherController.experienceView
);
router.put(
  "/:teacherId/experiences/:id",
  authMiddleware,
  isAdmin,
  validate(experienceSchema),
  TeacherController.experienceUpdate
);
router.delete(
  "/:teacherId/experiences/:id",
  authMiddleware,
  isAdmin,
  TeacherController.experienceDelete
);

router.get(
  "/:teacherId/educations/",
  authMiddleware,
  isAdmin,
  TeacherController.educationList
);

router.post(
  "/:teacherId/educations",
  authMiddleware,
  isAdmin,
  validate(educationSchema),
  TeacherController.educationCreate
);

router.get(
  "/:teacherId/educations/:id",
  authMiddleware,
  isAdmin,
  TeacherController.educationView
);

router.put(
  "/:teacherId/educations/:id",
  authMiddleware,
  isAdmin,
  validate(educationSchema),
  TeacherController.educationUpdate
);

router.delete(
  "/:teacherId/educations/:id",
  authMiddleware,
  isAdmin,
  TeacherController.educationDelete
);

// Certificate model CRUD
router.get(
  "/:teacherId/certifications",
  authMiddleware,
  isAdmin,
  TeacherController.certificateList
);
router.post(
  "/:teacherId/certifications",
  authMiddleware,
  isAdmin,
  validate(certificateSchema),
  TeacherController.certificateCreate
);
router.get(
  "/:teacherId/certifications/:id",
  authMiddleware,
  isAdmin,
  TeacherController.certificateView
);
router.put(
  "/:teacherId/certifications/:id",
  authMiddleware,
  isAdmin,
  validate(certificateSchema),
  TeacherController.certificateUpdate
);
router.delete(
  "/:teacherId/certifications/:id",
  authMiddleware,
  isAdmin,
  TeacherController.certificateDelete
);

// Address model CRUD
router.get(
  "/:teacherId/addresses",
  authMiddleware,
  isAdmin,
  TeacherController.addressList
);
// // BankDetail model CRUD
// router.post(
//   "/:teacherId/bank",
//   authMiddleware,
//   isAdmin,
//   validate(bankDetailSchema),
//   TeacherController.bankDetailCreate,
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
