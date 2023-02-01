// ObjectId() method for converting userId string into an ObjectId for querying database
const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');

// TODO: Create an aggregate function to get the number of users overall
const userController = {
  getUsers(req, res) {
    User.find()
      .then((users) => {
        return res.json(users);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .lean()
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user and remove them from the course
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Thought.findOneAndUpdate(
              { users: req.params.userId },
              { $pull: { users: req.params.userId } },
              { new: true }
            )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: 'User deleted, but no thoughts found',
            })
          : res.json({ message: 'User successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

 
updateUser(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $set: req.body},
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res
            .status(404) 
            .json({ message: 'No user found with that ID :(' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
},

createFriend(req, res) {
  Friend.create(req.body)
    .then((friend) => res.json(friend))
    .catch((err) => res.status(500).json(err));
},

// Delete a friend and remove them from the
deleteFriend(req, res) {
  Friend.findOneAndRemove({ _id: req.params.friendId })
    .then((friend) =>
      !friend
        ? res.status(404).json({ message: 'No such friend exists' })
        : Thought.findOneAndUpdate(
            { friends: req.params.friendId },
            { $pull: { users: req.params.friendId } },
            { new: true }
          )
    )
    .then((thought) =>
      !thought
        ? res.status(404).json({
            message: 'Friend deleted, but no thoughts found',
          })
        : res.json({ message: 'Friend successfully deleted' })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });

  },
};

module.exports = userController;