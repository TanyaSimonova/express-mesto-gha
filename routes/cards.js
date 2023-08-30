const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');
const router = require('express').Router();

router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCardById);
router.get('/cards', getCards);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
