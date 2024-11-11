const logger = require("./logger");
const { db } = require("./src/configs/db.config");
const { Account, Tenant } = require("./src/models");
const { faker } = require("@faker-js/faker");

(async () => {
  try {
    await db.sync({ alter: true });

    // Create Super Admin Account
    // await Account.create({
    //   firstName: "Super",
    //   lastName: "Admin",
    //   email: "superadmin@gmail.com",
    //   phoneNumber: "1234567890",
    //   userRole: "admin",
    //   password: "Password@123",
    //   dateOfBirth: "1990-01-01",
    //   isSuperuser: true,
    // });

    // // Create Tenant Admin
    // const tenantUser = await Tenant.create({
    //   name: "Tenant Admin 1",
    //   subdomainPrefix: "thousi",
    // });

    // // Create Tenant Account
    // await Account.create({
    //   tenantId: tenantUser.id,
    //   firstName: "Tenant",
    //   lastName: "Admin 1",
    //   email: "admin1@gmail.com",
    //   phoneNumber: "1234567890",
    //   userRole: "admin",
    //   password: "Password@123",
    //   dateOfBirth: "1990-01-01",
    // });

    // // Generate Fake Teacher Accounts
    // for (let i = 0; i <= 10; i++) {
    //   try {
    //     const fakeEmail = faker.internet.email();
    //     await Account.create(
    //       {
    //         firstName: faker.person.firstName(),
    //         lastName: faker.person.lastName(),
    //         email: fakeEmail,
    //         tenantId: tenantUser.id,
    //         phoneNumber: "1234567890",
    //         userRole: "teacher",
    //         password: "Password@123",
    //         dateOfBirth: faker.date.birthdate(),
    //       },
    //       { returning: false }
    //     );
    //   } catch (error) {
    //     if (error.name === "SequelizeUniqueConstraintError") {
    //       // Log the duplicate email error and continue
    //       console.log(`Duplicate email found: Skipping ${error.errors[0].value}`);
    //     } else {
    //       // Handle other errors
    //       console.error("Error creating account:", error);
    //     }
    //   }
    // }

    logger.info("Database synced!");
  } catch (error) {
    logger.error("Error syncing database:", error);
  } finally {
    db.close();
  }
})();
