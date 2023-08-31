const mongoose = require('mongoose');
const cardModel = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  return cardModel.create({ name, link, owner: req.user._id })
    .then((card) => {
      cardModel.findById(card._id)
        .populate('owner')
        .then((data) => res.status(201).send(data));
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Invalid data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const getCards = (req, res) => cardModel.find({})
  .then((r) => res.status(200).send(r))
  .catch(() => res.status(500).send({ message: 'Server Error' }));

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  return cardModel.findByIdAndDelete(cardId)
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send({ message: 'Successfully deleted' });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Invalid data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const likeCard = (req, res) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((r) => {
    if (r === null) {
      return res.status(404).send({ message: 'Card not found' });
    }
    return res.status(200).send(r);
  })
  .catch((e) => {
    if (e instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Invalid data' });
    }
    return res.status(500).send({ message: 'Server Error' });
  });

const dislikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send({ message: 'Successfully deleted' });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Invalid data' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
