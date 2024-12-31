const { GoogleGenerativeAI } = require("@google/generative-ai");
const ENV = process.env;

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

const ai = (schema) => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });
};

module.exports = {
  ai,
};
