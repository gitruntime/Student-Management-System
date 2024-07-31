const { Class, Subject } = require("../../models/associates/associate.model");

const classList = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const offset = (page - 1) * size;
    let classes;
    if (page) {
      classes = await Class.findAndCountAll({
        page,
        offset,
        paranoid: false,
      });
      return res.status(200).json({
        results: classes.rows,
        total: classes.count,
        currentPage: page,
        size: size,
      });
    }
    classes = await Class.findAll({
      paranoid: false,
    });
    return res.status(200).json(classes);
  } catch (error) {
    next(error);
  }
};

const classCreate = async (req, res, next) => {
  const { name } = req.body;

  try {
    const data = await Class.create({
      name,
    });
    return res
      .status(201)
      .json({ message: "Class created successfully", data });
  } catch (error) {
    next(error);
  }
};
const classView = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Class.findByPk(id);
    if (!data) return res.status(404).json({ message: "Class not found" });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
const classUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const data = await Class.findByPk(id);
    if (!data) return res.status(404).json({ message: "Class not found" });
    await data.update({ name });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
const classDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Class.findByPk(id);
    if (!data) return res.status(404).json({ message: "Class not found" });
    await data.destroy();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const subjectList = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
const subjectCreate = async (req, res, next) => {
  const { name } = req.body;
  try {
    const data = await Subject.create({
      name,
    });
    return res
      .status(201)
      .json({ message: "Subject created successfully", data });
  } catch (error) {
    next(error);
  }
};
const subjectView = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Class.findByPk(id);
    if (!data) return res.status(404).json({ message: "Class not found" });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
const subjectUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const data = await Subject.findByPk(id);
    if (!data) return res.status(404).json({ message: "Subject not found" });
    await data.update({ name });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
const subjectDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Subject.findByPk(id);
    if (!data) return res.status(404).json({ message: "Subject not found" });
    await data.update({ data });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

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
