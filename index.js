require("dotenv").config();
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const helmet = require("helmet");

const swaggerSpec = require("./src/configs/swagger.config");
const authRouter = require("./src/routes/accounts/auth.route");
const teacherRouter = require("./src/routes/teachers/teacher.route");
const port = process.env.PORT || 3000;
const { dbConnect } = require("./src/configs/db.config");
const cors = require("cors");
const logger = require("./logger");

// Helmet Middleware Configuration
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.PROJECT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRouter);
app.use("/api/teachers", teacherRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
dbConnect();
app.listen(port, () => logger.info(`Server is Running on ${port}`));
