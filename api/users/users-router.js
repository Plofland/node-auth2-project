const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('./users-model.js');
const { restricted, isValid } = require('./middleware');
const { jwtSecret } = require('../../config/secrets.js');

router.get('/users', restricted, (req, res) => {
  Users.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.send(err));
});

router.post('/register', (req, res) => {
  const credentials = req.body;
  if (isValid) {
    const rounds = process.env.BCRYPT_ROUNDS || 10;

    const hash = bcryptjs.hashSync(
      credentials.password,
      rounds
    );
    credentials.password = hash;

    Users.add(credentials)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message: 'Please provide username and password'
    });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        if (
          user &&
          bcryptjs.compareSync(password, user.password)
        ) {
          const token = makeToken(user);
          res.status(200).json({
            message: `Welcome to the API, ${user.username}`,
            token
          });
        } else {
          res
            .status(401)
            .json({ message: 'Invalid credentials' });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message: 'Please provide username and password'
    });
  }
});

const makeToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: '1h'
  };
  return jwt.sign(payload, jwtSecret, options);
};

module.exports = router;
