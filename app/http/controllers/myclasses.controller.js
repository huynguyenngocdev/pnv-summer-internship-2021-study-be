import db from '../../models/index.js';
import HTTPStatus from 'http-status';

const MyClasses = db.myclasses;
const User = db.users;
const Lesson = db.lessons;
const FlashCard = db.flashcards;
const MyClassFolder = db.myClassfolders;
const create = async (req, res) => {
  const { name, lessons = [], color, backgroundImage } = req.body;
  const { user_id } = req.user;
  const { folderId } = req;
  const { classes } = req.myClassFolder;
  try {
    const user = await User.findById(user_id);

    const myClass = await MyClasses.create({
      name,
      lessons,
      color,
      backgroundImage,
      userId: user_id,
      userName: user.name,
    });
    await MyClassFolder.findByIdAndUpdate(folderId, {
      classes: [...classes, myClass.id],
    });
    return res.status(HTTPStatus.OK).json(myClass);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Some error occurred while creating folder ',
    });
  }
};

const findAll = async (req, res) => {
  const { classes } = req.myClassFolder;
  try {
    const myclass = await MyClasses.find({
      _id: {
        $in: classes,
      },
    });
    return res.status(HTTPStatus.OK).json(myclass);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while retrieving class .',
    });
  }
};

const findOne = async (req, res) => {
  const { classId } = req.params;
  try {
    const myClass = await MyClasses.findById(classId);
    if (myClass) return res.status(HTTPStatus.OK).json(myClass);
    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: `Not found comment with id= ${classId}` });
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Error retrieving comment with id=' + classId });
  }
};
const update = async (req, res) => {
  const { classId } = req.params;
  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }

  try {
    const myClass = await MyClasses.findByIdAndUpdate(classId, req.body, {
      useFindAndModify: false,
    });
    if (myClass)
      return res.send({ message: 'Comment was updated successfully.' });

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update comment with id=${classId}. Maybe comment was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Error updating Comment with id=' + classId,
    });
  }
};
///
const deleteOne = async (req, res) => {
  const { classId } = req.params;

  try {
    const myClass = await MyClasses.findByIdAndRemove(classId);
    if (myClass) {
      const lessons = await Lesson.deleteMany({
        _id: {
          $in: myClass.lessons,
        },
      });
      const flashCards = await FlashCard.deleteMany({
        _id: {
          $in: lessons.flashCards,
        },
      });
      return res.status(HTTPStatus.OK).send({
        message: 'comment was deleted successfully!',
      });
    }

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot delete folder with id=${classId}. Maybe comment was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Could not delete folder with id=' + classId,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const myClass = await MyClasses.deleteMany({});
    return res.status(HTTPStatus.OK).send({
      message: `${myClass.deletedCount} comments were deleted successfully!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all comments.',
    });
  }
};

const findFolder = async (req, res, next) => {
  const { user_id } = req.user;

  try {
    const user = await User.findById(user_id);
    const { myClassFolder: folderId } = user;
    const folder = await MyClassFolder.findById(folderId);
    if (user) {
      req.folderId = folderId;
      req.myClassFolder = folder;
      return next();
    }
    return res.status(HTTPStatus.NOT_FOUND).end();
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving user with id = ${user_id}` });
  }
};
const checkClassInclude = async (req, res, next) => {
  const { classId } = req.params;
  const { user_id } = req.user;
  const { classes } = req.myClassFolder;
  try {
    if (classes.includes(classId)) return next();
    return res.status(HTTPStatus.FORBIDDEN).send({
      message: `Error retrieving when using class doesn't exist of of user with id = ${user_id}`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error retrieving class of users with id= ${user_id}`,
    });
  }
};

export {
  create,
  findOne,
  findAll,
  update,
  deleteOne,
  deleteAll,
  findFolder,
  checkClassInclude,
};
