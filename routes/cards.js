const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/cards', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?#?/).required(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().min(24).max(24)
      .required(),
  }),
}), deleteCardById);

router.get('/cards', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getCards);

router.put('/cards/:cardId/likes', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().min(24).max(24).alphanum()
      .required(),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().min(24).max(24)
      .required(),
  }),
}), dislikeCard);

module.exports = router;
