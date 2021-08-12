import db from '../../models/index.js';
import HTTPStatus from 'http-status';
const Flashcard = db.flashcards;
//create
const create = async (req, res) => {
  const { topic, list = [] } = req.body;
  try {
    const flashCard = await Flashcard.create({ topic, list });
    return res.status(HTTPStatus.OK).send(flashCard);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating flashCard',
    });
  }
};

//get all
const findAll = async (req, res) => {
  const { topic } = req.query;
  const condition = topic
    ? { topic: { $regex: new RegExp(topic), $options: 'i' } }
    : {};
  try {
    const flashcards = await Flashcard.find(condition);
    return res.status(HTTPStatus.OK).send(flashcards);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while retrieving flashCards.',
    });
  }
};

// find a single turorial with an id
const findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const flashcard = await Flashcard.findById(id);
    if (flashcard) return res.status(HTTPStatus.OK).send(flashcard);

    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: 'Not found flashCard with id ' + id });
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Error retrieving flashCard with id=' + id });
  }
};
const update = async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(HTTPStatus.BAD_GATEWAY).send({
      message: 'Data to update can not be empty!',
    });
  }

  try {
    const flashcard = await Flashcard.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (flashcard)
      return res.send({ message: 'flashCard was updated successfully.' });

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update flashCard with id=${id}. Maybe flashCard was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Error updating flashCard with id=' + id,
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const flashCard = await Flashcard.findByIdAndRemove(id);
    if (flashCard)
      return res.send({
        message: 'flashCard was deleted successfully!',
      });
    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot delete flashCard with id=${id}. Maybe flashCard was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Could not delete flashCard with id=' + id,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const flashcards = await Flashcard.deleteMany({});
    return res.status(HTTPStatus).send({
      message: `${flashcards.deletedCount} flashCards were deleted successfully!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all flashCards.',
    });
  }
};
export { create, findAll, findOne, update, deleteOne, deleteAll };
