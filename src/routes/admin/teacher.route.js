const express = require("express");
/**
 *  Controls teacher related endpoints
 */
const router = express.Router();
const TeacherController = require("../../controllers/admin/teacher.controller");
const validate = require("../../middlewares/validation.middleware");
const {
  teacherSchema,
  experienceSchema,
  certificateSchema,
} = require("../../utils/validators/teacher.validator");
const { addressSchema } = require("../../utils/validators/common.validator");
const { isAdmin, authMiddleware } = require("../../middlewares");

// Account and Teacher model CRUD
router.get("/", authMiddleware, isAdmin, TeacherController.teacherList);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(teacherSchema),
  TeacherController.teacherCreate,
);
router.get("/:id", authMiddleware, isAdmin, TeacherController.teacherView);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(teacherSchema),
  TeacherController.teacherUpdate,
);
router.delete("/:id", authMiddleware, isAdmin, TeacherController.teacherDelete);

// Experience model CRUD
router.get(
  "/:teacherId/experiences",
  authMiddleware,
  isAdmin,
  TeacherController.experienceList,
);
router.post(
  "/:teacherId/experiences",
  authMiddleware,
  isAdmin,
  validate(experienceSchema),
  TeacherController.experienceCreate,
);
router.get(
  "/:teacherId/experiences/:id",
  authMiddleware,
  isAdmin,
  TeacherController.experienceView,
);
router.put(
  "/:teacherId/experiences/:id",
  authMiddleware,
  isAdmin,
  validate(experienceSchema),
  TeacherController.experienceUpdate,
);
router.delete(
  "/:teacherId/experiences/:id",
  authMiddleware,
  isAdmin,
  TeacherController.experienceDelete,
);

// Certificate model CRUD
router.get(
  "/:teacherId/certificates",
  authMiddleware,
  isAdmin,
  TeacherController.certificateList,
);
router.post(
  "/:teacherId/certificates",
  authMiddleware,
  isAdmin,
  validate(certificateSchema),
  TeacherController.certificateCreate,
);
router.get(
  "/:teacherId/certificates/:id",
  authMiddleware,
  isAdmin,
  TeacherController.certificateView,
);
router.put(
  "/:teacherId/certificates/:id",
  authMiddleware,
  isAdmin,
  validate(certificateSchema),
  TeacherController.certificateUpdate,
);
router.delete(
  "/:teacherId/certificates/:id",
  authMiddleware,
  isAdmin,
  TeacherController.certificateDelete,
);

// Address model CRUD
router.get(
  "/:teacherId/address",
  authMiddleware,
  isAdmin,
  TeacherController.addressList,
);
router.post(
  "/:teacherId/address",
  authMiddleware,
  isAdmin,
  validate(addressSchema),
  TeacherController.addressCreate,
);
router.get(
  "/:teacherId/address/:id",
  authMiddleware,
  isAdmin,
  TeacherController.addressView,
);
router.put(
  "/:teacherId/address/:id",
  authMiddleware,
  isAdmin,
  validate(addressSchema),
  TeacherController.addressUpdate,
);
router.delete(
  "/:teacherId/address/:id",
  authMiddleware,
  isAdmin,
  TeacherController.addressDelete,
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
