require("dotenv").config();
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const helmet = require("helmet")

const swaggerSpec=require("./src/configs/swagger.config")
const authRouter=require("./src/routes/auth.route");
const port = process.env.PORT || 3000;
const db=require("./src/configs/db.config")

// Helmet Middleware Configuration
app.use(helmet())
app.use(express.json());
app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use('/api/auth',authRouter)

db.connect((error)=>{
    if(error) throw error;
    console.log("Database Connected Successfully");
})
app.listen(port,()=>console.log(`Server is Running on ${port}`))