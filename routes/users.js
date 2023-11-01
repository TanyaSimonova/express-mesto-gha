const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getUsers, getUserById, getProfile, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getUsers);

router.get('/users/me', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getProfile);

router.patch('/users/me', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

router.patch('/users/me/avatar', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?#?/),
  }),
}), updateUserAvatar);

router.get('/users/:userId', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().alphanum().min(24).max(24)
      .required(),
  }),
}), getUserById);

module.exports = router;
