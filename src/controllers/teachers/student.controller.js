import { Student } from "../../models";

const { tryCatch } = require("../../utils/handlers");

export const StudentList = tryCatch(async (req, res, next) => {
  const data = await Student.findAndCountAll({
    where: { tenantId: req.tenant.id },
  });
});
export const StudentCreate = tryCatch(async (req, res, next) => {});
export const StudentView = tryCatch(async (req, res, next) => {});
export const StudentUpdate = tryCatch(async (req, res, next) => {});
export const StudentDelete = tryCatch(async (req, res, next) => {});
