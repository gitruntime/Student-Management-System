const { Account, Parent } = require("../../../models");
const { tryCatch } = require("../../../utils/handlers/tryCatch");

const parentList = tryCatch(async (req, res, next) => {
  const { page, size } = req.query;
  const offset = (page - 1) * size;
  let parents;
  if (page) {
    parents = await Account.findAndCountAll({
      page,
      offset,
      paranoid: false,
      where: { user_role: "parent" },
      include: {
        model: Parent,
        as: "parents",
      },
    });
    return res.status(200).json({
      results: parents.rows,
      total: parents.count,
      currentPage: page,
      size: size,
    });
  }
  parents = await Account.findAll({
    paranoid: false,
    where: { user_role: "parent" },
    include: {
      model: Parent,
      as: "parents",
    },
  });
  return res.status(200).json(parents);
});

const parentCreate = tryCatch(async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    user_role,
    password,
    date_of_birth,
    is_active,
    is_staff,
  } = req.body;

  const data = await Account.create({
    first_name,
    last_name,
    email,
    phone_number,
    user_role,
    password,
    date_of_birth,
    is_active,
    is_staff,
  });
  return res.status(201).json({ message: "Parent created successfully", data });
});

const parentView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Account.findOne({
    where: {
      [Op.and]: [{ id }, { user_role: "parent" }],
    },
    include: [
      {
        model: Parent,
        as: "parents",
      },
    ],
  });
  if (!data) return res.status(404).json({ message: "Parent not found" });
  return res.status(200).json(data);
});

const parentUpdate = tryCatch(async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    user_role,
    date_of_birth,
    is_active,
    is_staff,
  } = req.body;
  const { id } = req.params;
  const data = await Account.findOne({
    where: {
      [Op.and]: [{ id }, { user_role: "parent" }],
    },
    include: [
      {
        model: Parent,
        as: "parents",
      },
    ],
  });
  if (!data) return res.status(404).json({ message: "Teacher not found" });
  await data.update({
    first_name,
    last_name,
    email,
    phone_number,
    user_role,
    date_of_birth,
    is_active,
    is_staff,
  });
  return res
    .status(200)
    .json({ message: "Parent data updated successfully", data });
});

const parentDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const parent = await Account.findOne({
    where: { id, user_role: "parent" },
  });
  if (!parent) return res.status(404).json({ message: "Parent not found" });
  await parent.destroy();
  return res.status(200).json({ message: "Parent deleted successfully" });
});

module.exports = {
  parentList,
  parentCreate,
  parentView,
  parentUpdate,
  parentDelete,
};
