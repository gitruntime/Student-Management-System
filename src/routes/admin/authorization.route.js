// const express = require("express");
// /**
//  * Controls Permission related endpoints
//  */
// const router = express.Router();
// // const permissionController = require("../../controllers/admin/authorization.controller");
// const { authMiddleware, isAdmin, validate } = require("../../middlewares");

// router.get(
//   "/",
//   authMiddleware,
//   isAdmin,
//   permissionController.permissionList
// );
// router.post(
//   "/",
//   authMiddleware,
//   isAdmin,
//   validate(permissionSchema),
//   permissionController.permissionCreate,
// );
// router.get(
//   "/:id",
//   authMiddleware,
//   isAdmin,
//   permissionController.permissionView,
// );
// router.put(
//   "/:id",
//   authMiddleware,
//   isAdmin,
//   validate(permissionSchema),
//   permissionController.permissionUpdate,
// );
// router.delete(
//   "/:id",
//   authMiddleware,
//   isAdmin,
//   permissionController.permissionDelete,
// );

// module.exports = router;
