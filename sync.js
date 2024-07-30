const logger = require("./logger");
const { db } = require("./src/configs/db.config");
const { Account } = require("./src/models/associates/associate.model");

(async () => {
  try {
    await db.sync({ force: true });
    await Account.create({
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone_number: "1234567890",
      user_role: "admin",
      password: "P@ssw0rd123",
      date_of_birth: "1990-01-01",
    });
    logger.info("Database synced!");
  } catch (error) {
    logger.error("Error syncing database:", error);
  } finally {
    db.close();
  }
})();
