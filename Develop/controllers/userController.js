// ObjectId() method for converting userId string into an ObjectId for querying database
const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// TODO: Create an aggregate function to get the number of users overall
const headCount = async () =>
  User.aggregate()
    // Your code here
    .then((numberOfUsers) => numberOfUsers);

// Execute the aggregate method on the User model and calculate the overall grade by using the $avg operator
const grade = async (userId) =>
  User.aggregate([
    // TODO: Ensure we include only the user who can match the given ObjectId using the $match operator
    {
      // Your code here
    },
    {
      $unwind: '$reactions',
    },
    // TODO: Group information for the user with the given ObjectId alongside an overall grade calculated using the $avg operator
    {
      // Your code here
    },
  ]);

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
          headCount: await headCount(),
        };
        return res.json(userObj);
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
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
              user,
              grade: await grade(req.params.userId),
            })
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

  // Add an reaction to a user
  addReaction(req, res) {
    console.log('You are adding an reaction');
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { reactions: req.body } },
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
  // Remove reaction from a user
  removeReaction(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { reaction: { reactionId: req.params.reactionId } } },
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
