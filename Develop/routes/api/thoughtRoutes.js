const router = require('express').Router();

const {
  getAllThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
} = require('../../controllers/thoughtController');


router.route('/').get(getAllThoughts);

router.route('/userId').post(createThought);

router.route('/:thoughtid')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought)
  .post(createReaction)
  .delete(deleteReaction);

router.route('/:thoughtId/reactions').post(createReaction);

router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);


module.exports = router;
