const router = require('express').Router();

const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
} = require('../../controllers/thoughtController.js');


router.route('/').get(getThoughts).post(createThought);

router
  .route('/:_id')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought)
  .post(createReaction)
  .delete(deleteReaction);



module.exports = router;
