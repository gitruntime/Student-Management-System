// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://nuzion-v2.vercel.app",
  "/.vercel.app$/",
];
const checkOrigin = (origin) => {
  const regex1 = /^http:\/\/([a-zA-Z0-9-]+\.)?localhost:5173$/;
  const regex2 = /^https:\/\/([a-zA-Z0-9-]+\.)?vercel.app$/;
  return regex1.test(origin) || regex2.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || checkOrigin(origin)) {
      callback(null, true); // Allow this origin
    } else {
      callback(new Error("Not allowed by CORS"), false); // Reject this origin
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Tenant-Domain"],
  credentials: true, // Allow credentials (cookies, etc.)
};

module.exports = { corsOptions };
