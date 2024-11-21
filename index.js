require("dotenv").config();
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const helmet = require("helmet");

const swaggerSpec = require("./src/configs/swagger.config");
const authRouter = require("./src/routes/accounts/authentication.route");
const adminRouter = require("./src/routes/admin/index");
const teacherRouter = require("./src/routes/teachers/index");
const StudentRouter = require("./src/routes/students/index");
const nodeAdmin = require("./src/routes/superadmin/index");

const port = process.env.PORT || 3000;
const { dbConnect } = require("./src/configs/db.config");
const cors = require("cors");
const logger = require("./logger");
const corsHeader = require("./src/configs/cors.config");
const path = require("path");

// Local Middleware
const { tenantMiddleware, parseIntMiddleware } = require("./src/middlewares");
const { errorHandler, urlNotFound } = require("./src/utils/handlers");
const { upload } = require("./src/configs/multer.config");

// Helmet Middleware Configuration
// app.get((req, res, next) => {
//   req.csrd;
// });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(helmet());
app.use(express.json());
app.use(cors(corsHeader));
app.use("/api/docs/admin", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/docs/superadmin", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/docs/teacher", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/docs/student", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/docs/parent", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(parseIntMiddleware);
app.use("/api/auth", authRouter);
app.use(tenantMiddleware);
// Middleware to extract subdomain
app.use("/api/admin", adminRouter);
app.use("/api/node-admin", nodeAdmin);
app.use("/api/teacher", teacherRouter);
app.use("/api/student", StudentRouter);
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({
    message: "File uploaded successfully",
    fileUrl,
  });
});
app.post("/api/uploads", upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const fileUrls = req.files.map((file) => {
    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  });

  // Respond with file URLs
  res.json({
    message: "Files uploaded successfully",
    fileUrls,
  });
});
app.use("*", urlNotFound);
app.use(errorHandler);
dbConnect();
app.listen(port, () => logger.info(`Server is Running on ${port}`));
