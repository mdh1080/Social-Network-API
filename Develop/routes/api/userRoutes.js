const router = require('express').Router();

const {
  getUsers,
  getSingleUser,
  updateUser,
  createUser,
  deleteUser,
  createFriend,
  deleteFriend,
} = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser);

router.route('/:userId').get(getSingleUser).delete(deleteUser).put(updateUser);

router.route('/:userId/friends/:friendId').post(createFriend).delete(deleteFriend);

module.exports = router;