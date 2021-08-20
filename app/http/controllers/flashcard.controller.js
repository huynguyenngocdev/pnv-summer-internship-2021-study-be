import db from '../../models/index.js';
import HTTPStatus from 'http-status';
const Flashcard = db.flashcards;
const Lesson = db.lessons;
const create = async (req, res) => {
  const { question, answer, color = 'white' } = req.body;
  const { user_id } = req.user;
  try {
    const flashCard = await Flashcard.create({
      question,
      answer,
      color,
      ownerId: user_id,
    });
    if (flashCard)
      await Lesson.findByIdAndUpdate(req.lesson.id, {
        flashCards: [...req.lesson.flashCards, flashCard.id],
      });

    return res.status(HTTPStatus.OK).send(flashCard);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating flashCard',
    });
  }
};

const findAll = async (req, res) => {
  const { topic } = req.query;
  const { flashCards } = req.lesson;
  const condition = topic
    ? {
        topic: { $regex: new RegExp(topic), $options: 'i' },
        _id: {
          $in: flashCards,
        },
      }
    : {
        _id: {
          $in: flashCards,
        },
      };
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

const findOne = async (req, res) => {
  const { flashCardId } = req.params;
  try {
    const flashcard = await Flashcard.findById(flashCardId);

    if (flashcard) return res.status(HTTPStatus.OK).send(flashcard);

    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: 'Not found flashCard with id ' + flashCardId });
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Error retrieving flashCard with id=' + flashCardId });
  }
};
const update = async (req, res) => {
  const { flashCardId } = req.params;

  if (!req.body) {
    return res.status(HTTPStatus.BAD_GATEWAY).send({
      message: 'Data to update can not be empty!',
    });
  }

  try {
    const flashcard = await Flashcard.findByIdAndUpdate(flashCardId, req.body, {
      useFindAndModify: false,
    });
    if (flashcard)
      return res.send({ message: 'flashCard was updated successfully.' });

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update flashCard with id=${flashCardId}. Maybe flashCard was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Error updating flashCard with id=' + flashCardId,
    });
  }
};

const deleteOne = async (req, res) => {
  const { flashCardId } = req.params;
  try {
    const flashCard = await Flashcard.findByIdAndRemove(flashCardId);

    if (flashCard) {
      await Lesson.findByIdAndUpdate(
        req.lesson.id,
        {
          flashCards: [...req.lesson.flashCards].filter(
            (item) => item !== flashCardId
          ),
        },
        {
          useFindAndModify: false,
        }
      );
      return res.send({
        message: 'flashCard was deleted successfully!',
      });
    }
    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot delete flashCard with id=${flashCardId}. Maybe flashCard was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Could not delete flashCard with id=' + flashCardId,
    });
  }
};

const deleteAll = async (req, res) => {
  const { flashCards: flashCardIds } = req.lesson;
  const { lessionId } = req.params;
  try {
    if (flashCardIds.length < 1)
      return res.status(HTTPStatus.OK).send({
        message: `0 flashCards were deleted successfully!`,
      });
    const flashcards = await Flashcard.deleteMany({
      _id: {
        $in: flashCardIds,
      },
    });
    const lesson = await Lesson.findByIdAndUpdate(flashCards, {
      flashCards: [],
    });
    return res.status(HTTPStatus.OK).send({
      message: `${flashCards.deletedCount} flashCards were deleted successfully!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all flashCards.',
    });
  }
};
const checkLessonExist = async (req, res, next) => {
  const { lessonId } = req.params;

  try {
    const lesson = await Lesson.findById(lessonId);
    if (lesson) {
      req.lesson = lesson;
      return next();
    }
    return res.status(HTTPStatus.NOT_FOUND).end();
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error retrieving folder of folder ${req.myfolder.id} with id= ${lessonId}`,
    });
  }
};
const checkLessonInclude = async (req, res, next) => {
  const { flashCardId } = req.params;

  try {
    if (req.lesson.flashCards.includes(flashCardId)) return next();
    return res.status(HTTPStatus.FORBIDDEN).send({
      message: `Error retrieving when using folder doesn't exist in lessons with id= ${req.lesson.id}`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error retrieving classrom with id= ${req.lesson.id}`,
    });
  }
};

export {
  create,
  findAll,
  findOne,
  update,
  deleteOne,
  deleteAll,
  checkLessonExist,
  checkLessonInclude,
};
