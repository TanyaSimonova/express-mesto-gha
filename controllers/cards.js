const mongoose = require('mongoose');
const cardModel = require('../models/card');
const NoRights = require('../errors/NoRights');
const NotFound = require('../errors/NotFound');
const NotValid = require('../errors/NotValid');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((card) => {
      cardModel.findById(card._id)
        .populate('owner')
        .then((data) => res.status(201).send(data));
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return next(new NotValid('Invalid data'));
      }
      return next(e);
    });
};

const getCards = (req, res, next) => cardModel.find({})
  .then((r) => res.status(200).send(r))
  .catch(next);

const deleteCardById = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await cardModel.findById(cardId).orFail(new NotFound('Card not found'));

    if (req.user._id !== card.owner.toString()) {
      return next(new NoRights('No rights to perform the operation'));
    }
    await cardModel.deleteOne(card._id);
    return res.status(200).send({ card, message: 'Successfully deleted' });
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      return next(new NotValid('Invalid data'));
    }
    return next(e);
  }
};

const likeCard = (req, res, next) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFound('Card not found'))
  .then((r) => res.status(200).send(r))
  .catch((e) => {
    if (e instanceof mongoose.Error.CastError) {
      return next(new NotValid('Invalid data'));
    }
    return next(e);
  });

const dislikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFound('Card not found'))
    .then(() => res.status(200).send({ message: 'Successfully deleted' }))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new NotValid('Invalid data'));
      }
      return next(e);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
