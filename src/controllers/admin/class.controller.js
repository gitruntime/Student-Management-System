const { Class, Subject } = require("../../models");
const { Response } = require("../../utils/handlers/response");
const {
  HTTP_200_OK,
  HTTP_201_CREATED,
  HTTP_404_NOT_FOUND,
} = require("../../utils/handlers/status");
const tryCatch = require("../../utils/handlers/tryCatch");

const classList = tryCatch(async (req, res, next) => {
  const { page, size } = req.query;
  const offset = (page - 1) * size;
  let options = { paranoid: false };
  let responseData;
  if (page && size) {
    options.page = page;
    options.offset = offset;
    const { rows, count } = await Class.findAndCountAll(options);
    let responseData = {
      results: rows,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil(count / size),
      size: size,
    };
    return new Response(responseData, HTTP_200_OK, res);
  }
  responseData = await Class.findAll(options);
  return new Response(responseData, HTTP_200_OK, res);
});

const classCreate = tryCatch(async (req, res, next) => {
  const { name } = req.validatedData;
  const data = await Class.create({
    name,
  });
  return new Response(
    { message: "Class created successfully", data },
    HTTP_201_CREATED,
    res,
  );
});

const classView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Class.findByPk(id);
  if (!data)
    return new Response(
      { message: "Class not found" },
      HTTP_404_NOT_FOUND,
      res,
    );
  return new Response(data, HTTP_200_OK, res);
});

const classUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.validatedData;
  const data = await Class.findByPk(id);
  if (!data) return res.status(404).json({ message: "Class not found" });
  await data.update({ name });
  return res.status(200).json(data);
});

const classDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Class.findByPk(id);
  if (!data) return res.status(404).json({ message: "Class not found" });
  await data.destroy();
  return res.status(200).json(data);
});

const subjectList = tryCatch(async (req, res, next) => {
  const { page, size } = req.query;
  const offset = (page - 1) * size;
  let subjects;
  if (page) {
    subjects = await Subject.findAndCountAll({
      page,
      offset,
      paranoid: false,
    });
    return res.status(200).json({
      results: subjects.rows,
      total: subjects.count,
      currentPage: page,
      size: size,
    });
  }
  subjects = await Subject.findAll({
    paranoid: false,
  });
  return res.status(200).json(subjects);
});

const subjectCreate = tryCatch(async (req, res, next) => {
  const { name } = req.validatedData;
  const data = await Subject.create({
    name,
  });
  return res
    .status(201)
    .json({ message: "Subject created successfully", data });
});

const subjectView = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Class.findByPk(id);
  if (!data) return res.status(404).json({ message: "Class not found" });
  return res.status(200).json(data);
});

const subjectUpdate = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.validatedData;
  const data = await Subject.findByPk(id);
  if (!data) return res.status(404).json({ message: "Subject not found" });
  await data.update({ name });
  return res.status(200).json(data);
});

const subjectDelete = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const data = await Subject.findByPk(id);
  if (!data) return res.status(404).json({ message: "Subject not found" });
  await data.update({ data });
  return res.status(200).json(data);
});

module.exports = {
  classList,
  classCreate,
  classView,
  classUpdate,
  classDelete,
  subjectList,
  subjectCreate,
  subjectView,
  subjectUpdate,
  subjectDelete,
};
