const logger = require("./logger");
const { db } = require("./src/configs/db.config");
const { Account, Tenant } = require("./src/models");
const { faker } = require("@faker-js/faker");

(async () => {
  try {
    await Tenant.sync()
    await Account.sync()
    await db.sync({ alter: true });
    await Account.create({
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@gmail.com",
      phoneNumber: "1234567890",
      userRole: "admin",
      password: "Password@123",
      dateOfBirth: "1990-01-01",
      isSuperuser: true,
    });
    const tenantUser = await Tenant.create({
      name: "Tenant Admin 1",
      subdomainPrefix: "thousi",
    });
    await Account.create({
      tenantId: tenantUser.id,
      firstName: "Tenant",
      lastName: "Admin 1",
      email: "admin1@gmail.com",
      phoneNumber: "1234567890",
      userRole: "admin",
      password: "Password@123",
      dateOfBirth: "1990-01-01",
    });
    for (let i = 0; i <= 10; i++) {
      await Account.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        tenantId: tenantUser.id,
        phoneNumber: "1234567890",
        userRole: "teacher",
        password: "Password@123",
        dateOfBirth: faker.date.birthdate(),
      });
    }
    logger.info("Database synced!");
  } catch (error) {
    logger.error("Error syncing database:", error);
  } finally {
    db.close();
  }
})();
