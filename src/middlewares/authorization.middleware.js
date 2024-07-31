/**
 * Only admin can access this route
 */
const isAdmin = (req, res, next) => {
  const { is_superadmin } = req.user;

  if (!is_superadmin)
    return res
      .status(401)
      .json({ message: "You dont have permission to access this page" });
  next();
};

module.exports = {
  isAdmin,
};
