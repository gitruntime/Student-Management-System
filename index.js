const express = require("express");
require("dotenv").config();
const app = express();
const authRouter=require("./src/routes/auth.route");
const port = process.env.PORT || 3000;
const db=require("./src/configs/db.config")
app.use(express.json());
app.use('/api/auth',authRouter)

db.connect((error)=>{
    if(error) throw error;
    console.log("Database Connected Successfully");
})
app.listen(port,()=>console.log(`Server is Running on ${port}`))