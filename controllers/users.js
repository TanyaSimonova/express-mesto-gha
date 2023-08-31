const mongoose = require('mongoose');
const userModel = require('../models/user');

const getUsers = (req, res) => userModel.find({})
  .then((r) => res.status(200).send(r))
  .catch(() => res.status(500).send({ message: 'Server Error' }));

const getUserById = (req, res) => {
  const { userId } = req.params;
  return userModel.findById(userId)
    .then((r) => res.status(200).send(r))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Invalid data' });
      } if (e instanceof mongoose.Error.CastError) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return userModel.create({ name, about, avatar })
    .then((r) => res.status(201).send(r))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Invalid data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: 'true' })
    .then((r) => res.status(200).send(r))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return res.status(404).send({ message: 'User not found' });
      } if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Invalid data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidators: 'true' })
    .then((r) => res.status(200).send(r))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Invalid data' });
      } if (e instanceof mongoose.Error.CastError) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
