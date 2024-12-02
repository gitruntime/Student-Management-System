const logger = require("./logger");
const { db } = require("./src/configs/db.config");
const {
  Account,
  Admin,
  Teacher,
  Parent,
  Student,
  Class,
  Subject,
  ExamSubject,
  ExamScore,
} = require("./src/models");
const { Tenant } = require("./src/models/core/tenant.model");
const { faker } = require("@faker-js/faker");
const { Volunteer, Goal } = require("./src/models/students/academic.model");

const generatedEmails = new Set();

const generateUniqueEmail = () => {
  let email;
  do {
    email = faker.internet.email();
  } while (generatedEmails.has(email));
  generatedEmails.add(email);
  return email;
};

(async () => {
  try {
    // await db.authenticate();
    // await db.drop({ cascade: true });
    // await Tenant.sync({ force: true });
    // await Account.sync({ force: true });
    // await Volunteer.sync({ alter: true });
    // await ExamSubject.sync({ alter: true });
    // await Account.sync({ alter: true });
    // await Admin.sync({ alter: true });
    await db.sync({ alter: true });

    // Create Super Admin Account
    // await Account.create({
    //   firstName: "Super",
    //   lastName: "Admin",
    //   email: "superadmin1@gmail.com",
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

    // await Account.create({
    //   firstName: "Thoussef",
    //   lastName: "Hamza",
    //   email: "teacher1@gmail.com",
    //   tenantId: tenantUser.id,
    //   phoneNumber: "1234567890",
    //   userRole: "teacher",
    //   password: "Password@123",
    //   dateOfBirth: faker.date.birthdate(),
    // });

    // await Account.create({
    //   firstName: "Thoussef",
    //   lastName: "Hamza",
    //   email: "student1@gmail.com",
    //   tenantId: tenantUser.id,
    //   phoneNumber: "1234567890",
    //   userRole: "student",
    //   password: "Password@123",
    //   dateOfBirth: faker.date.birthdate(),
    // });

    // // Generate Fake Teacher Accounts
    // for (let i = 0; i < 15; i++) {
    //   await Account.create({
    //     firstName: faker.person.firstName(),
    //     lastName: faker.person.lastName(),
    //     email: generateUniqueEmail(),
    //     tenantId: tenantUser.id,
    //     phoneNumber: "1234567890",
    //     userRole: "teacher",
    //     password: "Password@123",
    //     dateOfBirth: faker.date.birthdate(),
    //   });
    // }

    // for (let i = 1; i <= 15; i++) {
    //   await Class.create({
    //     tenantId: tenantUser.id,
    //     name: `Class ${i}`,
    //     section: "A",
    //   });
    // }

    // for (let i = 1; i <= 15; i++) {
    //   await Subject.create({
    //     tenantId: tenantUser.id,
    //     name: `Subject ${i}`,
    //     code: `SUB00${i}`,
    //   });
    // }

    logger.info("Database synced!");
  } catch (error) {
    logger.error("Error syncing database:", error);
  } finally {
    db.close();
  }
})();
