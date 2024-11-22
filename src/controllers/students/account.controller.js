const { Account, Student, Address } = require("../../models");
const { Interest } = require("../../models/core");
const { Goal, Volunteer } = require("../../models/students/academic.model");
const { tryCatch } = require("../../utils/handlers");

const ViewProfileData = tryCatch(async (req, res, next) => {
  const data = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
    include: [
      {
        model: Student,
        as: "studentProfile",
        attributes: ["bio", "profilePicture", "bio", "bloodGroup"],
      },
    ],
    attributes: [
      "id",
      "firstName",
      "lastName",
      "fullName",
      "username",
      "email",
      "dateOfBirth",
    ],
  });
  if (!data)
    return res.status(404).json({
      message:
        "User not found please contact with your school admin/school teacher",
    });

  return res.status(200).json({ message: "Data fetched Successfully", data });
});

const UpdateProfileData = tryCatch(async (req, res, next) => {
  const data = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
    include: [
      {
        model: Student,
        as: "studentProfile",
      },
    ],
  });
  if (!data)
    return res.status(404).json({
      message:
        "User not found please contact with your school admin/school teacher",
    });
  const { bio, bloodGroup, ...accountDetails } = req.validatedData;
  data.updateFormData(accountDetails);
  data.save();
  data.studentProfile.updateFormData({ bio, bloodGroup });
  data.studentProfile.save();
  return res
    .status(200)
    .json({ message: "Profile Data updated Succcessfully", data });
});

const AddressList = tryCatch(async (req, res, next) => {
  const data = await Address.findAll({
    where: { accountId: req.user.id, tenantId: req.tenant.id },
  });
  return res.status(200).json({
    data,
    message: "Subject data fetched Successfully",
  });
});

const AddressCreate = tryCatch(async (req, res, next) => {
  const data = await Address.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
    accountId: req.user.id,
  });
  return res
    .status(201)
    .json({ message: "Address created successfully", data });
});

const AddressUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Address.findOne({
    where: { id, tenantId: req.tenant.id, accountId: req.user.id },
  });
  if (!data) return res.status(404).json({ message: "Address not found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ message: "Address updated successfully", data });
});
const AddressDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Address.findOne({
    where:{ id,
    accountId: req.user.id,
    tenantId: req.tenant.id,}
  });
  if (!data) return res.status(404).json({ message: "Address not found" });
  await data.destroy();
  return res.status(200).json({ message: "Address deleted Successfully" });
});

const InterestList = tryCatch(async (req, res, next) => {
  const user = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
  });
  const data = user.getInterests();
  return res
    .status(200)
    .json({ message: "Interest fetched successfully", data });
});

const InterestCreate = tryCatch(async (req, res, next) => {
  const user = await Account.findOne({
    where: { id: req.user.id, tenantId: req.user.id },
  });

  const { interests } = req.validatedData;

  const interestInstances = await Promise.all(
    interests.map((interest) =>
      Interest.findOrCreate({ where: { name: interest } })
    )
  );

  await user.setInterests(interestInstances.map(([interest]) => interest));
  return res.status(201).json({ message: "Interest created Successfully" });
});

const GoalList = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { id: req.user.id, tenantId: req.user.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Goal.findAll({
    where: { studentId: user.id, tenantId: tenant.id },
  });
  return res.status(200).json({ message: "Goal fetched successfully", data });
});

const GoalCreate = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { id: req.user.id, tenantId: req.user.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Goal.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
    studentId: user.id,
  });
  return res.status(200).json({ message: "Goal created Successfully", data });
});

const GoalUpdate = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { id: req.user.id, tenantId: req.user.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Goal.findOne({
    where: { id, tenantId: req.tenant.id, studentId: user.id },
  });
  if (!data) return res.status(404).json({ message: "Goal not found" });
  data.updateFormData(req.validatedData);
  return res.status(200).json({ message: "Goal updated Successfully" });
});

const GoalDelete = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { id: req.user.id, tenantId: req.user.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Goal.findOne({
    where: { id, tenantId: req.tenant.id, studentId: user.id },
  });
  if (!data) return res.status(404).json({ message: "Goal not found" });
  await data.destroy();
  return res.status(200).json({ message: "Goal delted Successfully.!" });
});

const VolunteerList = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { id: req.user.id, tenantId: req.user.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Volunteer.findAll({
    where: { studentId: user.id, tenantId: tenant.id },
  });
  return res
    .status(200)
    .json({ message: "Volunteer fetched successfully", data });
});

const VolunteerCreate = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { id: req.user.id, tenantId: req.user.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Volunteer.create({
    ...req.validatedData,
    tenantId: req.tenant.id,
    studentId: user.id,
  });
  return res
    .status(200)
    .json({ message: "Volunteer created Successfully", data });
});

const VolunteerUpdate = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { id: req.user.id, tenantId: req.user.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Volunteer.findOne({
    where: { id, tenantId: req.tenant.id, studentId: user.id },
  });
  if (!data) return res.status(404).json({ message: "Goal not found" });
  data.updateFormData(req.validatedData);
  return res.status(200).json({ message: "Volunteer updated Successfully" });
});

const VolunteerDelete = tryCatch(async (req, res, next) => {
  const user = await Student.findOne({
    where: { id: req.user.id, tenantId: req.user.id },
  });
  if (!user) return res.status(404).json({ message: "User not found.!" });
  const data = await Volunteer.findOne({
    where: { id, tenantId: req.tenant.id, studentId: user.id },
  });
  if (!data) return res.status(404).json({ message: "Goal not found" });
  await data.destroy();
  return res.status(200).json({ message: "Volunteer deleted Successfully.!" });
});

module.exports = {
  ViewProfileData,
  UpdateProfileData,
  AddressList,
  AddressCreate,
  AddressUpdate,
  AddressUpdate,
  AddressDelete,
  InterestList,
  InterestCreate,
  GoalList,
  GoalCreate,
  GoalUpdate,
  GoalDelete,
  VolunteerList,
  VolunteerCreate,
  VolunteerUpdate,
  VolunteerDelete,
};
