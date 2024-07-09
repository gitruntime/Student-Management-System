require("dotenv").config()
const jwt = require("jsonwebtoken");

const authenticateToken = (req,res,next) => {
    const  bearerHeader = req.headers["authorization"];
    console.log(bearerHeader,"bearerToken ===================> ");
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1]
        console.log(bearerToken,"bearerToken ===================> ");

        req.token = bearerToken
        console.log(req.token,"req.token ===================> ");
        jwt.verify(req.token,process.env.ACCESS_TOKEN_SECRET,(err,authData)=>{
            if (err) {
                console.log(err,"error");
                res.sendStatus(403);
            } else {
                console.log(authData,"authDatar ===================> ");
                req.user = authData;
                console.log(req.user,"req.user ===================> ");
                next()
            }
        });
    } else {
        res.sendStatus(403)
    }
}

module.exports={
    authMiddleware:authenticateToken
}