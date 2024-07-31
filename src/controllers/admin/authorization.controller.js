const { Permission } = require("../../models/associates/associate.model");

const permissionList = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const offset = (page - 1) * size;
    let permissions;
    if (page) {
      permissions = await Permission.findAll({
        page,
        offset,
        paranoid: false,
      });
      return res.status(200).json({
        results: permissions,
        total: Permission.count(),
        currentPage: page,
        size: size,
      });
    }
    permissions = await Permission.findAll({
      paranoid: false,
    });
    return res.status(200).json(permissions);
  } catch (error) {
    next(error);
  }
};

const permissionCreate = async (req, res, next) => {
  try {
    const { codename, title } = req.body;
    const data = await Permission.create({
      codename,
      title,
    });
    return res
      .status(201)
      .json({ message: "Permission Created Successfully", data });
  } catch (error) {
    next(error);
  }
};

const permissionView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Permission.findByPk(id, { paranoid: false });
    if (!data) return res.status(400).json({ message: "Permission not found" });
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const permissionUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { codename, title } = req.body;
  try {
    const [rowsUpdated] = await Permission.update(
      { codename, title },
      {
        where: { id },
      },
    );
    if (rowsUpdated === 0)
      return res
        .status(404)
        .json({ message: "Permission not found or no changes made" });
    return res.status(200).json({
      message: "Permission updated successfully",
      data: { codename, title },
    });
  } catch (error) {
    next(error);
  }
};

const permissionDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rowsDeleted = await Permission.destroy({
      where: { id },
    });
    if (rowsDeleted === 0)
      return res.status(404).json({ message: "Permission not found" });
    return res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  permissionList,
  permissionCreate,
  permissionView,
  permissionUpdate,
  permissionDelete,
};
