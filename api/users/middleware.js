const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secrets');

const isValid = (user) => {
  return Boolean(
    user.username &&
      user.password &&
      typeof user.password === 'string'
  );
};


const restricted = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json('No token');
  } else {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res
          .status(401)
          .json('The token is bad ' + err.message);
      } else {
        //this is how we will have access to the token info
        req.decodedToken = decoded;
        next();
      }
    });
  }
};

module.exports = {
  isValid,
  restricted
};
