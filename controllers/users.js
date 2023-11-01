const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const NotAuthenticated = require('../errors/NotAuthenticated');
const NotFound = require('../errors/NotFound');
const NotValid = require('../errors/NotValid');
const NoDuplicate = require('../errors/NoDuplicate');

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => userModel.find({})
  .then((users) => {
    if (!users) {
      throw new NotFound('Users not found');
    }
    res.status(200).send(users);
  })
  .catch(next);

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return userModel.findById(userId)
    .orFail(new NotFound('User not found'))
    .then((r) => res.status(200).send(r))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new NotValid('Invalid data'));
      }
      next(e);
    });
};

const createUser = async (req, res, next) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await userModel.create({
      email, password: hash, name, about, avatar,
    });
    return res.status(201).send({
      _id: newUser._id, name: newUser.name, about: newUser.about, avatar: newUser.avatar,
    });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError) {
      next(new NotValid('Invalid data: please, сheck the email and password fields'));
    }
    if (e.code === 11000) {
      next(new NoDuplicate('This email is already exist'));
    }
    next(e);
  }
  return false;
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select('+password').orFail(new NotAuthenticated('Incorrect email or password'));
    const matched = await bcrypt.compare(String(password), user.password);
    if (!matched) {
      throw new NotAuthenticated('Incorrect email or password');
    }
    const token = jwt.sign({ _id: user._id }, 'jwt-secret-key', { expiresIn: '7d' });
    return res.status(200).send({ token });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError) {
      next(new NotValid('Field validation error'));
    }
    next(e);
  }
  return false;
};

const getProfile = (req, res, next) => userModel.findOne({ _id: req.user._id })
  .orFail(new NotFound('User not found'))
  .then((r) => res.status(200).send(r))
  .catch((e) => {
    if (e instanceof mongoose.Error.CastError) {
      next(new NotValid('Invalid data'));
    }
    next(e);
  });

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: 'true' })
    .orFail(new NotFound('User not found'))
    .then((r) => res.status(200).send(r))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError) {
        next(new NotValid('Invalid data'));
      }
      next(e);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidators: 'true' })
    .orFail(new NotFound('User not found'))
    .then((r) => res.status(200).send(r))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError) {
        next(new NotValid('Invalid data'));
      }
      next(e);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  getProfile,
  updateUserProfile,
  updateUserAvatar,
};
