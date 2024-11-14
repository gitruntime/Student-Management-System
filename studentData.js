const logger = require("./logger");
const { db } = require("./src/configs/db.config");
const { Account, Tenant, Class, Student } = require("./src/models");
const { faker } = require("@faker-js/faker");

(async () => {
  try {
    const tenantData = await Tenant.findOne({
      where: { subdomainPrefix: "thousi" },
    });
    const year = 2008;
    const usedDates = new Set();
    console.log("Class Data fetching started.....");
    
    const [classData, created] = await Class.findOrCreate({
        where: { tenantId: tenantData.id, name: "STD 10" },
    });
    console.log("Student Data Creation Started........");
    for (let index = 0; index < 10; index++) {
      const firstName = faker.helpers.uniqueArray(faker.person.firstName, 1)[0];  // Accessing the first element of the array
      const lastName = faker.helpers.uniqueArray(faker.person.lastName, 1)[0];  // Accessing the first element of the array
      const email = faker.helpers.uniqueArray(faker.internet.email, 1)[0];  // Accessing the first element of the array
      const phoneNumber = faker.helpers.uniqueArray(faker.phone.number)[0];  // Accessing the first element of the array

      let dateOfBirth;
      do {
        const month = faker.number
          .int({ min: 1, max: 12 })
          .toString()
          .padStart(2, "0");
        const day = faker.number
          .int({ min: 1, max: 28 })
          .toString()
          .padStart(2, "0"); // Restrict to 28 days for simplicity
        dateOfBirth = `${year}-${month}-${day}`;
      } while (usedDates.has(dateOfBirth));

      usedDates.add(dateOfBirth);

      const student = await Account.create({
        firstName,
        lastName,
        email,
        dateOfBirth,
        phoneNumber,
        tenantId: tenantData.id,
        userRole: "student",
        password: "Password@123",
      });
      const studentData = await Student.findOne({
        where: { accountId: student.id, tenantId: tenantData.id },
      });
      studentData.updateFormData({
        classId: classData.id,
        bio: faker.lorem.sentence(),
        bloodGroup: faker.helpers.arrayElements(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])[0],
      });
      await studentData.save();
    }
    console.log("Student Data Created Successfully.....");
  } catch (error) {
    logger.error("Error occurred:", error);
  }
})();
