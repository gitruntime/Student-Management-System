const express=require("express")
const router=express.Router()

const authController=require("../controllers/auth.controller")
const validator = require("../utils/validators/validator")
const authValidator= require("../utils/validators/auth.validator")

router.get('/test',(req,res)=> res.status(200).json("Test Successfull"))
router.post('/login',validator(authValidator.loginValidator),authController.login)


module.exports=router;