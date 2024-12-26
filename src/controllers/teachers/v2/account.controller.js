// const {
//   Account,
//   Teacher,
//   Address,
//   Experience,
//   Certificate,
//   Education,
//   Document,
// } = require("../../models/index");

const { Account, Teacher, Experience, Education } = require("../../../models");
const { tryCatch } = require("../../../utils/handlers");

// const { tryCatch, calculateTotalPages } = require("../../utils/handlers");

const TeacherView = tryCatch(async (req, res, next) => {
  const data = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
    include: {
      model: Teacher,
      as: "teacherProfile",
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "deletedAt",
          "accountId",
          "tenantId",
        ],
      },
    },
    attributes: {
      exclude: ["deletedAt", "isSuperuser", "isAdmin", "tenantId", "password"],
    },
  });
  if (!data) return res.status(404).json({ message: "Teacher not Found.!!" });
  return res
    .status(200)
    .json({ data, message: "Teacher Data Fetched Successfully.!" });
});

const TeacherUpdate = tryCatch(async (req, res, next) => {
  const data = await Account.findOne({
    where: { id: req.user.id, tenantId: req.tenant.id },
    include: {
      model: Teacher,
      as: "teacherProfile",
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    },
    attributes: {
      exclude: ["deletedAt", "isSuperuser", "isAdmin"],
    },
  });
  if (!data)
    return res.status(404).json({ message: "Teacher Data not Found.!!" });
  const { bio, bloodGroup, ...rest } = req.validatedData;
  data.updateFormData(rest);
  data.save();
  data.teacherProfile.updateFormData({ bio, bloodGroup });
  data.teacherProfile.save();
  return res.status(200).json({ message: "Data Updated Successfully", data });
});

// const AddressList = tryCatch(async (req, res) => {
//   const data = await Address.findAll({
//     where: { accountId: req.user.id, tenantId: req.tenant.id },
//     attributes: {
//       exclude: ["deletedAt", "tenantId", "accountId"],
//     },
//   });
//   return res.status(200).json({
//     data,
//     message: "Address Fetched Successfully",
//   });
// });

// const AddressCreate = tryCatch(async (req, res) => {
//   const data = await Address.create({
//     ...req.validatedData,
//     accountId: req.user.id,
//     tenantId: req.tenant.id,
//   });
//   return res
//     .status(201)
//     .json({ data, message: "Address created successfully." });
// });

// const AddressView = tryCatch(async (req, res) => {
//   const { id } = req.params;
//   const data = await Address.findOne({
//     where: { accountId: req.user.id, tenantId: req.tenant.id, id },
//     attributes: { exclude: ["deletedAt", "tenantId", "accountId"] },
//   });
//   if (!data) return res.status(404).json({ message: "Address not found" });
//   return res
//     .status(200)
//     .json({ data, message: "Address fetched Successfully" });
// });

// const AddressUpdate = tryCatch(async (req, res) => {
//   const { id } = req.params;
//   const data = await Address.findOne({
//     where: { accountId: req.user.id, tenantId: req.tenant.id, id },
//     attributes: { exclude: ["deletedAt", "tenantId", "accountId"] },
//   });
//   if (!data) return res.status(404).json({ message: "Address not found" });
//   data.updateFormData(req.validatedData);
//   await data.save();
//   return res
//     .status(200)
//     .json({ data, message: "Address updated Successfully" });
// });

// const AddressDelete = tryCatch(async (req, res) => {
//   const { id } = req.params;
//   const data = await Address.findOne({
//     where: { accountId: req.user.id, tenantId: req.tenant.id, id },
//     attributes: { exclude: ["deletedAt", "tenantId", "accountId"] },
//   });
//   if (!data)
//     return res.status(404).json({ data, message: "Address not found" });
//   await data.destroy();
//   return res
//     .status(200)
//     .json({ data, message: "Address deleted Successfully" });
// });

const ExperienceList = tryCatch(async (req, res, next) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id },
    attributes: ["id"],
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }

  const data = await Experience.findAll({
    where: { tenantId: req.tenant.id, teacherId: teacher.id },
  });

  return res.status(200).json({
    data,
    message: "Experiences fetched Successsfully",
    version: "v2",
  });
});

const ExperienceCreate = tryCatch(async (req, res, next) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id },
    attributes: ["id"],
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }

  const data = await Experience.create({
    ...req.validatedData,
    teacherId: teacher.id,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ message: "Experience created successfully.", data, version: "v2" });
});

const ExperienceUpdate = tryCatch(async (req, res, next) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id },
    attributes: ["id"],
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }
  const { id } = req.params;

  const data = await Experience.findOne({
    where: { id, tenantId: req.tenant.id, teacherId: teacher.id },
  });
  if (!data) return res.status(404).json({ message: "Experience not found" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ message: "Experience updated successfully", data });
});

const ExperienceDelete = tryCatch(async (req, res, next) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id },
    attributes: ["id"],
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }

  const { id } = req.params;
  const data = await Experience.findOne({
    where: { id, tenantId: req.tenant.id, teacherId: teacher.id },
  });
  if (!data) return res.status(404).json({ message: "Experience not found" });
  await data.destroy();
  return res.status(200).json({ message: "Experience deleted Successfully." });
});

// const CertificateList = tryCatch(async (req, res, next) => {
//   const { size: limit = 10, page = 1 } = req.query;
//   const { rows: data, count } = await Certificate.findAndCountAll({
//     limit,
//     offset: (page - 1) * limit,
//     where: { accountId: req.user.id, tenantId: req.tenant.id },
//     attributes: { exclude: ["deletedAt"] },
//   });
//   return res.status(200).json({
//     data,
//     totalCount: count,
//     currentPage: page,
//     totalPages: calculateTotalPages(count, limit),
//     size: limit,
//   });
// });

// const CertificateCreate = tryCatch(async (req, res, next) => {
//   const data = await Certificate.create({
//     ...req.validatedData,
//     tenantId: req.tenant.id,
//     accountId: req.user.id,
//   });
//   return res
//     .status(201)
//     .json({ message: "Certificate created successfully.", data });
// });

// const CertificateView = tryCatch(async (req, res) => {
//   const { id } = req.params;
//   const data = await Certificate.findOne({
//     where: { id, tenantId: req.tenant.id },
//     attributes: { exclude: ["accountId", "deletedAt", "tenantId"] },
//   });
//   if (!data) return res.status(404).json({ message: "Certificate not found" });
//   return res
//     .status(200)
//     .json({ data, message: "Certificate fetched successfully" });
// });

// const CertificateUpdate = tryCatch(async (req, res) => {
//   const { id } = req.params;
//   const data = await Certificate.findOne({
//     where: { id, tenantId: req.tenant.id },
//     attributes: { exclude: ["tenantId", "accountId", "deletedAt"] },
//   });
//   if (!data) return res.status(404).json({ message: "Certificate not found" });
//   data.updateFormData(req.validatedData);
//   await data.save();
//   return res
//     .status(200)
//     .json({ message: "Certificate Updated Successfully", data });
// });

// const CertificateDelete = tryCatch(async (req, res) => {
//   const { id } = req.params;
//   const data = await Certificate.findOne({
//     where: { id, tenantId: req.tenant.id },
//   });
//   if (!data) return res.status(404).json({ message: "Certificate not found" });
//   await data.destroy();
//   return res.status(200).json({ message: "Certificate deleted Successfully" });
// });

// // ======================================================================================================>
const EducationList = tryCatch(async (req, res) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id },
    attributes: ["id"],
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }

  const data = await Education.findAll({
    where: { teacherId: teacher.id, tenantId: req.tenant.id },
    attributes: { exclude: ["teacherId", "deletedAt", "tenantId"] },
  });
  return res.status(200).json({
    data,
    message: "Educations's fetched successfully",
  });
});

const EducationCreate = tryCatch(async (req, res) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id },
    attributes: ["id"],
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }

  const data = await Education.create({
    ...req.validatedData,
    teacherId: teacher.id,
    tenantId: req.tenant.id,
  });
  return res
    .status(201)
    .json({ message: "Education created successfully.", data, version: "v2" });
});

const EducationUpdate = tryCatch(async (req, res) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id },
    attributes: ["id"],
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }

  const { id } = req.params;
  const data = await Education.findOne({
    where: { id, tenantId: req.tenant.id, teacherId: teacher.id },
  });
  if (!data)
    return res
      .status(404)
      .json({ message: "Education not found", version: "v2" });
  data.updateFormData(req.validatedData);
  await data.save();
  return res
    .status(200)
    .json({ data, message: "Education updated successfully", version: "v2" });
});

const EducationDelete = tryCatch(async (req, res) => {
  const teacher = await Teacher.findOne({
    where: { accountId: req.user.id },
    attributes: ["id"],
  });

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }

  const { id } = req.params;
  const data = await Education.findOne({
    where: { id, tenantId: req.tenant.id, teacherId: teacher.id },
  });
  if (!data)
    return res
      .status(404)
      .json({ message: "Education not found", version: "v2" });
  await data.destroy();
  return res
    .status(200)
    .json({ message: "Education deleted Successfully.!", version: " v2" });
});

// const DocumentList = tryCatch(async (req, res) => {
//   const data = await Document.findAll({
//     where: {
//       accountId: req.user.id,
//       tenantId: req.tenant.id,
//     },
//   });
//   return res
//     .status(200)
//     .json({ message: "Documents fetched successfully.!", data });
// });
// const DocumentCreate = tryCatch(async (req, res) => {
//   const data = await Document.create({
//     ...req.validatedData,
//     tenantId: req.tenant.id,
//     accountId: req.user.id,
//   });

//   return res
//     .status(200)
//     .json({ message: "Document created successfully.!", data });
// });
// const DocumentUpdate = tryCatch(async (req, res) => {});
// const DocumentDelete = tryCatch(async (req, res) => {});

module.exports = {
  TeacherView,
  TeacherUpdate,
  //   AddressList,
  //   AddressCreate,
  //   AddressView,
  //   AddressUpdate,
  //   AddressDelete,
  ExperienceList,
  ExperienceCreate,
  ExperienceUpdate,
  ExperienceDelete,
  //   CertificateList,
  //   CertificateCreate,
  //   CertificateView,
  //   CertificateUpdate,
  //   CertificateDelete,
  EducationList,
  EducationCreate,
  EducationUpdate,
  EducationDelete,
};
