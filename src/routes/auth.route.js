const express=require("express")
const router=express.Router()

const authController=require("../controllers/auth.controller")
const validator = require("../utils/validators/validator")
const authValidator= require("../utils/validators/auth.validator")
const { authMiddleware } = require("../middlewares/auth.middleware")

router.get('/test',(req,res)=> res.status(200).json("Test Successfull"))
// Auth API's
router.post('/login',validator(authValidator.loginValidator),authController.login)

// Permission API's
router.get('/permissions', authMiddleware,authController.permissionList)
router.post('/permissions', authMiddleware,authController.permissionCreate)
router.get('/permissions/:id', authMiddleware,authController.permissionView)
router.put('/permissions/:id', authMiddleware,authController.permissionUpdate)
router.delete('/permissions/:id', authMiddleware,authController.permissionDelete)


module.exports=router;