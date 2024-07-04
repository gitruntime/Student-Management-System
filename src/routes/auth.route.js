const express=require("express")
const router=express.Router()

const authController=require("../controllers/auth.controller")
const validator = require("../utils/validators/validator")
const authValidator= require("../utils/validators/auth.validator")

router.get('/test',(req,res)=> res.status(200).json("Test Successfull"))
// Auth API's
router.post('/login',validator(authValidator.loginValidator),authController.login)

// Permission API's
router.get('/permissions',authController.permissionList)
router.post('/permissions',authController.permissionCreate)
router.get('/permissions/:id',authController.permissionView)
router.put('/permissions/:id',authController.permissionUpdate)
router.delete('/permissions/:id',authController.permissionDelete)


module.exports=router;