require("dotenv").config();
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const helmet = require("helmet")

const swaggerSpec=require("./src/configs/swagger.config")
const authRouter=require("./src/routes/auth.route");
const teacherRouter=require('./src/routes/teacher.route')
const port = process.env.PORT || 3000;  
const db=require("./src/configs/db.config")
const cors = require("cors")

// Helmet Middleware Configuration
app.use(helmet())
app.use(express.json());
app.use(cors({
    origin:process.env.PROJECT_URL,
    methods:    ["GET","POST","PUT","PATCH","DELETE"],
    credentials: true
}))
app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use('/api/auth',authRouter)
app.use('/api/teachers',teacherRouter)


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500 
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
});
db.connect((error)=>{
    if(error) throw error;
    console.log("Database Connected Successfully");
})
app.listen(port,()=>console.log(`Server is Running on ${port}`))