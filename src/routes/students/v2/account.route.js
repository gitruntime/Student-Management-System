const express = require("express");
/**
 * Control Class related endpoints
 */
const router = express.Router();

const { authMiddleware, validate } = require("../../../middlewares");
const { AccountController } = require("../../../controllers/students/v2");
const {
  StudentGoalSchema,
  StudentProfileSchema,
  StudentVolunteerSchema,
  AddressSchema,
  interestSchema,
  interestDeleteSchema,
} = require("../../../utils/validators/students/account.validator");

router.get("/profile", authMiddleware, AccountController.ViewProfileData);
router.get("/dashboard", authMiddleware, AccountController.Dashboard);
router.put(
  "/profile",
  authMiddleware,
  validate(StudentProfileSchema),
  AccountController.UpdateProfileData
);
// router.get("/addresses", authMiddleware, AccountController.AddressList);
// router.post(
//   "/addresses",
//   authMiddleware,
//   validate(AddressSchema),
//   AccountController.AddressCreate
// );
// router.put(
//   "/addresses/:id",
//   authMiddleware,
//   validate(AddressSchema),
//   AccountController.AddressUpdate
// );
// router.delete(
//   "/addresses/:id",
//   authMiddleware,
//   AccountController.AddressDelete
// );
router.get("/goals", authMiddleware, AccountController.GoalList);
router.post(
  "/goals",
  authMiddleware,
  validate(StudentGoalSchema),
  AccountController.GoalCreate
);
router.put(
  "/goals/:id",
  authMiddleware,
  validate(StudentGoalSchema),
  AccountController.GoalUpdate
);
router.delete("/goals/:id", authMiddleware, AccountController.GoalDelete);
router.get("/interests", authMiddleware, AccountController.InterestList);
router.post(
  "/interests",
  authMiddleware,
  validate(interestSchema),
  AccountController.InterestCreate
);
router.post(
  "/interests/delete",
  authMiddleware,
  validate(interestDeleteSchema),
  AccountController.InterestDelete
);
router.get("/volunteers", authMiddleware, AccountController.VolunteerList);
router.post(
  "/volunteers",
  authMiddleware,
  validate(StudentVolunteerSchema),
  AccountController.VolunteerCreate
);
router.put(
  "/volunteers/:id",
  authMiddleware,
  validate(StudentVolunteerSchema),
  AccountController.VolunteerUpdate
);
router.delete(
  "/volunteers/:id",
  authMiddleware,
  AccountController.VolunteerDelete
);

router.get(
  "/ai/astrological",
  authMiddleware,
  AccountController.aiAstrological
);
router.get("/ai/career", authMiddleware, AccountController.aiCareer);
router.get("/ai/overview", authMiddleware, AccountController.aiOverview);

module.exports = router;
