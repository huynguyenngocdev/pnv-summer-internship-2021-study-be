import db from '../../models/index.js';
import HTTPStatus from 'http-status';

const MyClassFolder = db.myClassfolders;
const User = db.users;
const MyClass = db.myclasses;
const FlashCard = db.flashcards;

const create = async (req, res) => {
  const {
    name,
    classes = [],
    color,
    backgroundImage,
    userId,
    userName,
  } = req.body;

  try {
    const myFolder = await MyClassFolder.create({
      name,
      classes,
      color,
      backgroundImage,
      userId,
      userName,
    });
    return res.status(HTTPStatus.OK).json(myFolder);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Some error occurred while creating folder ',
    });
  }
};

const findAll = async (req, res) => {
  try {
    const myFoder = await MyClassFolder.find({});
    return res.status(HTTPStatus.OK).json(myFoder);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while retrieving folder .',
    });
  }
};

const findOne = async (req, res) => {
  const { folderId } = req.params;
  try {
    const myFolder = await MyClassFolder.findById(folderId);
    if (myFolder) return res.status(HTTPStatus.OK).json(myFolder);
    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: `Not found comment with id= ${folderId}` });
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Error retrieving comment with id=' + folderId });
  }
};
const update = async (req, res) => {
  const { folderId } = req.params;
  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }

  try {
    const myFolder = await MyClassFolder.findByIdAndUpdate(folderId, req.body, {
      useFindAndModify: false,
    });
    if (myFolder)
      return res.send({ message: 'Comment was updated successfully.' });

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update comment with id=${folderId}. Maybe comment was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Error updating Comment with id=' + folderId,
    });
  }
};
///
const deleteOne = async (req, res) => {
  const { folderId } = req.params;

  try {
    const myFolder = await MyClassFolder.findByIdAndRemove(folderId);
    if (myFolder) {
      const classes = await MyClass.deleteMany({
        _id: {
          $in: myFolder.classes,
        },
      });
      const flashCards = await FlashCard.deleteMany({
        _id: {
          $in: classes.flashCards,
        },
      });
      return res.status(HTTPStatus.OK).send({
        message: 'comment was deleted successfully!',
      });
    }

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot delete folder with id=${folderId}. Maybe comment was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Could not delete folder with id=' + folderId,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const myFolder = await MyClassFolder.deleteMany({});
    return res.status(HTTPStatus.OK).send({
      message: `${myFolder.deletedCount} comments were deleted successfully!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all comments.',
    });
  }
};

const checkUserExist = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (user) {
      req.user = user;
      return next();
    }
    return res.status(HTTPStatus.NOT_FOUND).end();
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving user with id= ${userId}` });
  }
};
const checkFolderInclude = async (req, res, next) => {
  const { folderId } = req.params;

  try {
    if (req.user.myClassFolder === folderId) return next();
    return res.status(HTTPStatus.FORBIDDEN).send({
      message: `Error retrieving when using folder doesn't exist of u user with id= ${req.user.id}`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error retrieving classrom with id= ${req.user.id}`,
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
  checkUserExist,
  checkFolderInclude,
};
