const { Permission } = require("../../models/associates/associate.model");
const { Response } = require("../../utils/handlers/response");
const {
  HTTP_200_OK,
  HTTP_201_CREATED,
  HTTP_404_NOT_FOUND,
} = require("../../utils/handlers/status");
const tryCatch = require("../../utils/handlers/tryCatch");

const permissionList = tryCatch(async (req, res, next) => {
  const { page, size } = req.query;
  const offset = (page - 1) * size;
  let options = {
    paranoid: false,
  };
  if (page && size) {
    options.page = page;
    options.offset = offset;
    const { rows, count } = await Permission.findAndCountAll(options);
    return new Response(
      {
        results: rows,
        totalCount: count,
        currentPage: page,
        totalPages: Math.ceil(count / size),
        size: size,
      },
      HTTP_200_OK,
      res,
    );
  }
  const data = await Permission.findAll(options);
  return new Response(data, HTTP_200_OK, res);
});

const permissionCreate = tryCatch(async (req, res, next) => {
  const { codename, title } = req.validatedData;
  const data = await Permission.create({
    codename,
    title,
  });
  return new Response(
    { message: "Permission Created Successfully", data },
    HTTP_201_CREATED,
    res,
  );
});

const permissionView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Permission.findByPk(id, { paranoid: false });
  if (!data) return res.status(400).json({ message: "Permission not found" });
  return new Response(data, HTTP_200_OK, res);
});

const permissionUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { codename, title } = req.validatedData;
  const data = await Permission.findByPk(id);
  if (!data)
    return new Response(
      { message: "Permission not found." },
      HTTP_404_NOT_FOUND,
      res,
    );
  return new Response(
    {
      message: "Permission updated successfully",
      codename,
      title,
    },
    HTTP_200_OK,
    res,
  );
});

const permissionDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const permission = await Permission.findByPk(id);
  if (!permission)
    return new Response(
      { message: "Permission not found" },
      HTTP_404_NOT_FOUND,
      res,
    );
  return new Response(
    { message: "Permission deleted successfully" },
    HTTP_200_OK,
    res,
  );
});

module.exports = {
  permissionList,
  permissionCreate,
  permissionView,
  permissionUpdate,
  permissionDelete,
};
