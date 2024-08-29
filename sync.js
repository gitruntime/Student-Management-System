const logger = require("./logger");
const { db } = require("./src/configs/db.config");
const { Account, Tenant } = require("./src/models");

(async () => {
  try {
    await db.sync({ force: true });
    await Account.create({
      tenantUserId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@tJHexample.com",
      phoneNumber: "1234567890",
      userRole: "admin",
      password: "P@ssw0rd123",
      dateOfBirth: "1990-01-01",
    });
    logger.info("Database synced!");
  } catch (error) {
    logger.error("Error syncing database:", error);
  } finally {
    db.close();
  }
})();
