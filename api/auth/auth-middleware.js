module.exports = {
  isValid,
  checkRole
};

const isValid = (user) => {
  return Boolean(user.username && user.password && typeof user.password === "string");
};

const checkRole = (role) => (req, res, next) => {
  if (req.decodedToken.role === role) {
    next();
  } else {
    res
      .status(403)
      .json('You are not an admin, access restricted');
  }
}
