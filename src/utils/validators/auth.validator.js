const { body } = require("express-validator");

const loginValidator = [
    body('email').trim().isEmail(),
    body("password").trim().isLength({ min:8, max:16 })
]

module.exports={
    loginValidator
}