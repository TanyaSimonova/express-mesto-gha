const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users/:userId', getUserById);
router.get('/users', getUsers);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
