const router = require('express').Router();

const {
  getUser,
  getSingleUser,
  updateUser,
  createUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/userController');

router.route('/').get(getUser).post(createUser);

router.route('/:userId').get(getSingleUser).delete(deleteUser).put(updateUser);

router.route('/:userId/friends').post(addFriend);

router.route('/:userId/friends/:friendId').delete(deleteFriend);

module.exports = router;