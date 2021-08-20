import db from '../../models/index.js';
import HTTPStatus from 'http-status';
const Lesson = db.lessons;
const FlashCard = db.flashcards;
const MyClass = db.myclasses;
//create
const create = async (req, res) => {
  const { name, color, start } = req.body;
  const { user_id } = req.user;
  const { id: classId, lessons } = req.myClass;
  try {
    const lesson = await Lesson.create({
      name,
      color,
      start,
      ownerId: user_id,
    });
    if (lesson)
      await MyClass.findByIdAndUpdate(classId, {
        lessons: [...lessons, lesson.id],
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
  const { lessons } = req.myClass;

  const condition = name
    ? {
        name: { $regex: new RegExp(name), $options: 'i' },
        _id: {
          $in: lessons,
        },
      }
    : {
        _id: {
          $in: lessons,
        },
      };
  try {
    const lesson = await Lesson.find(condition);
    return res.send(lesson);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while retrieving lessons.',
    });
  }
};

// find a single lesson with an id
const findOne = async (req, res) => {
  const { lessonId } = req.params;
  try {
    const lesson = await Lesson.findById(lessonId);
    if (lesson) return res.send(lesson);

    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: `Not found lession with id ${lessonId}` });
  } catch (error) {
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Error retrieving lession with id=' + lessonId });
  }
};
const update = async (req, res) => {
  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }

  const { lessonId } = req.params;

  try {
    const lesson = await Lesson.findByIdAndUpdate(lessonId, req.body, {
      useFindAndModify: false,
    });
    if (lesson)
      return res.send({ message: 'lession was updated successfully.' });

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update lession with id=${lessonId}. Maybe lession was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Error updating lession with id=' + lessonId,
    });
  }
};

const deleteOne = async (req, res) => {
  const { lessonId } = req.params;
  const { id: classId, lessons } = req.myClass;
  try {
    const lesson = await Lesson.findByIdAndRemove(lessonId);
    if (lesson) {
      await MyClass.findByIdAndUpdate(classId, {
        lessons: [...lessons].filter((item) => item !== lessonId),
      });
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
      message: `Cannot delete user with id=${lessonId}. Maybe lession was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Could not delete lession with id= ${lessonId}`,
    });
  }
};

const deleteAll = async (req, res) => {
  const { lessons } = req.myClass;
  try {
    const lesson = await Lesson.deleteMany({
      _id: {
        $in: lessons,
      },
    });
    if (lesson) await FlashCard.deleteMany({});
    return res.send({
      message: `${lesson.deletedCount} lessons were deleted successfully!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all lessons.',
    });
  }
};

const checkClassExist = async (req, res, next) => {
  const { classId } = req.params;

  try {
    const myClass = await MyClass.findById(classId);
    if (myClass) {
      req.myClass = myClass;
      return next();
    }
    return res.status(HTTPStatus.NOT_FOUND).end();
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error retrieving class ${classId}`,
    });
  }
};
const checkLessonInclude = async (req, res, next) => {
  const { lessonId } = req.params;
  const { lessons } = req.myClass;
  try {
    if (lessons.includes(lessonId)) return next();
    return res.status(HTTPStatus.FORBIDDEN).send({
      message: `Error retrieving when using folder doesn't exist in folder with id= ${req.myClass.id}`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error retrieving lesson with id= ${lessonId}`,
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
  checkClassExist,
  checkLessonInclude,
};
