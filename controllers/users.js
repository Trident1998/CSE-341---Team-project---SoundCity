const { getCollection } = require('../utilities/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const collectionName = 'user';

const getAll = async (req, res) => {
  const result = getCollection(collectionName).find();
  result.toArray().then((users) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ users: users, total: users.length });
  });
};

const register = async (req, res, next) => {
  try {
    const newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      age: req.body.age,
      email: req.body.email,
      password: req.body.password,
      profile: {
        bio: req.body.bio,
        avatar: req.body.avatar
      }
    };
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;
    const result = await getCollection(collectionName).insertOne(newUser);

    console.log(result);
    if (result.acknowledged) {
      console.log('User was registered with the ID', result.insertedId);
      res.status(201).json({ bookId: result.insertedId }).send();
    } else {
      next(createError(500, result.error || 'Registration failed'));
    }
  } catch (error) {
    createError(500, 'Registration failed');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getCollection(collectionName).findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const accountData = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      age: user.age,
      email: user.email
    };
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = {
  getAll,
  register,
  login
};
