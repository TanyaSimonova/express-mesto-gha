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
    link: Joi.string().uri().required(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().required(),
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
    cardId: Joi.string().alphanum().required(),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().required(),
  }),
}), dislikeCard);

module.exports = router;
