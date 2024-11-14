const express = require("express");
/**
 * Controls Teacher related routes
 */
const router = express.Router();
const { accountController } = require("../../controllers/teachers");
const { authMiddleware, validate } = require("../../middlewares");
const {
  teacherProfileSchema,
  addressSchema,
  certificateSchema,
  educationSchema,
  experienceSchema,
} = require("../../utils/validators/teacher/account.validator");

router.get("/", authMiddleware, accountController.TeacherView);
router.put(
  "/",
  authMiddleware,
  validate(teacherProfileSchema),
  accountController.TeacherUpdate
);
// =============================================================================>
router.get("/addresses", authMiddleware, accountController.AddressList);
router.post(
  "/addresses",
  authMiddleware,
  validate(addressSchema),
  accountController.AddressCreate
);
router.get("/addresses/:id", authMiddleware, accountController.AddressView);
router.put(
  "/addresses/:id",
  authMiddleware,
  validate(addressSchema),
  accountController.AddressUpdate
);
router.delete(
  "/addresses/:id",
  authMiddleware,
  accountController.AddressDelete
);
// ==============================================================================>
router.get("/certificates", authMiddleware, accountController.CertificateList);
router.post(
  "/certificates",
  authMiddleware,
  validate(certificateSchema),
  accountController.CertificateCreate
);
router.get(
  "/certificates/:id",
  authMiddleware,
  accountController.CertificateView
);
router.put(
  "/certificates/:id",
  authMiddleware,
  validate(certificateSchema),
  accountController.CertificateUpdate
);
router.delete(
  "/certificates/:id",
  authMiddleware,
  accountController.CertificateDelete
);
// ===================================================================================>
router.get("/educations", authMiddleware, accountController.EducationList);
router.post(
  "/educations",
  authMiddleware,
  validate(educationSchema),
  accountController.EducationCreate
);
router.get("/educations/:id", authMiddleware, accountController.EducationView);
router.put(
  "/educations/:id",
  authMiddleware,
  validate(educationSchema),
  accountController.EducationUpdate
);
router.delete(
  "/educations/:id",
  authMiddleware,
  accountController.EducationDelete
);
router.get("/experiences", authMiddleware, accountController.ExperienceList);
router.post(
  "/experiences",
  authMiddleware,
  validate(experienceSchema),
  accountController.ExperienceCreate
);
router.get("/experiences/:id", authMiddleware, accountController.ExperienceView);
router.put(
  "/experiences/:id",
  authMiddleware,
  validate(experienceSchema),
  accountController.ExperienceUpdate
);
router.delete(
  "/experiences/:id",
  authMiddleware,
  accountController.ExperienceDelete
);
module.exports = router;
