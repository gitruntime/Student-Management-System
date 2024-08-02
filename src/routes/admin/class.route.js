const express = require("express");
/**
 * Control class related endpoints
 */
const router = express.Router();
const classController = require("../../controllers/admin/class.controller");
const {
  authMiddleware,
} = require("../../middlewares/authentication.middleware");
const { isAdmin } = require("../../middlewares/authorization.middleware");
const validate = require("../../middlewares/validation.middleware");
const { classSchema } = require("../../utils/validators/class.validator");

router.get(
  "/", 
  authMiddleware, 
  isAdmin, 
  classController.classList
);
router.post(
  "/", 
  authMiddleware, 
  isAdmin, 
  validate(classSchema),
  classController.classCreate
);
router.get(
  "/:id", 
  authMiddleware, 
  isAdmin, 
  classController.classView
);
router.put(
  "/:id", 
  authMiddleware, 
  isAdmin, 
  validate(classSchema),
  classController.classUpdate
);
router.delete(
  "/:id", 
  authMiddleware, 
  isAdmin, 
  classController.classDelete
);

module.exports = router;
