import db from '../../models/index.js';
import HTTPStatus from 'http-status';
const Lesson = db.lessons;
const FlashCard = db.flashCards;
//create
const create = async (req, res) => {
  const { name, color, start } = req.body;
  try {
    const lesson = await Lesson.create({
      name,
      color,
      start,
    });
    return res.status(HTTPStatus.OK).send(lesson);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating lession',
    });
  }
};

//get all
const findAll = async (req, res) => {
  const { name } = req.query;
  const condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};
  try {
    const lesson = await Lesson.find(condition);
    return res.send(lesson);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while retrieving lessions.',
    });
  }
};

// find a single lesson with an id
const findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await Lesson.findById(id);
    if (lesson) return res.send(lesson);

    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: `Not found lession with id ${id}` });
  } catch (error) {
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Error retrieving lession with id=' + id });
  }
};
const update = async (req, res) => {
  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }

  const { id } = req.params;

  try {
    const lesson = await Lesson.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (lesson)
      return res.send({ message: 'lession was updated successfully.' });

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update lession with id=${id}. Maybe lession was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Error updating lession with id=' + id,
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await Lesson.findByIdAndRemove(id);
    if (lesson) {
      const flashCard = await FlashCard.deleteMany({
        _id: {
          $in: lesson.flashCards,
        },
      });

      return res.send({
        message: 'lession was deleted successfully!',
      });
    }
    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot delete user with id=${id}. Maybe lession was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Could not delete lession with id= ${id}`,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const lesson = await Lesson.deleteMany({});
    return res.send({
      message: `${lesson.deletedCount} lessions were deleted successfully!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all lessions.',
    });
  }
};
//add a flash card into lession
const addAFlashCard = async (req, res) => {
  const { id } = req.params;

  try {
    const flashcard = await FlashCard.findById(id);
    if (!flashcard) {
      return res.status(404).send({
        message: `Not found id=${id}!`,
      });
    }
    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { flashCards: [...flashcard.flashCards, req.body.flashcard] },
      {
        useFindAndModify: false,
      }
    );
    return res.send(lesson);
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message || 'error ' });
  }
};

//delete a flash card from lession
const removeAFlashCard = async (req, res) => {
  const { id, flashcard } = req.params;
  try {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).send({
        message: `Not found id=${id}!`,
      });
    }
    await Lesson.findByIdAndUpdate(
      id,
      { flashCards: [flashcard, ...lesson.flashCards] },
      {
        useFindAndModify: false,
      }
    );
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message || 'error ' });
  }
};

export {
  create,
  findAll,
  findOne,
  update,
  deleteOne,
  deleteAll,
  removeAFlashCard,
  addAFlashCard,
};
