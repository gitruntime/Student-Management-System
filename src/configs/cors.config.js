module.exports = {
  origin: [
    process.env.PROJECT_URL,     
    'http://thousi.localhost:5173', 
    'http://localhost:5173',       
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
