const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  User.findOne({ email })
    .then(user => {
      if (user) return res.status(400).json({ msg: 'User already exists' });

      const newUser = new User({ username, email, password });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) throw err;
                  res.json({
                    token,
                    user: { id: user.id, username: user.username, email: user.email }
                  });
                }
              )
            });
        });
      });
    });
});

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({ msg: 'User does not exist' });

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: { id: user.id, username: user.username, email: user.email }
              });
            }
          )
        });
    });
});

module.exports = router;