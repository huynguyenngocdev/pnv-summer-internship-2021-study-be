const db = require('../../models/index');
import HTTPStatus from 'http-status';
const User = db.users;

//create
const create = async (req, res) => {
  try {
    const {
      name,
      userName,
      avatar,
      password,
      email = '',
      listClassJoin = [],
      listClassOwn = [],
      folderFlashCard = '',
      phone,
      dateOfBirth,
    } = req.body;
    const user = await User.create({
      name,
      userName,
      avatar,
      password,
      email,
      active: 0,
      listClassJoin,
      listClassOwn,
      folderFlashCard,
      role: 0,
      phone,
      dateOfBirth,
    });
    return res.send(user);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating user',
    });
  }
};

//get all
const findAll = async (req, res) => {
  try {
    const user = await User.find();
    return res.send(user);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while retrieving users.',
    });
  }
};

const findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .send({ message: `Not found user with id ${id}` });
    }
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving user with id=${id}` });
  }
};
const update = (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (!user) {
      return res.status(HTTPStatus.NOT_FOUND).send({
        message: `Cannot update user with id=${id}. Maybe user was not found!`,
      });
    }
    return res.send({ message: 'user was updated successfully.' });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message`Error updating user with id= ${id}`,
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndRemove(id);
    if (!user) {
      return res.status(HTTPStatus.NOT_FOUND).send({
        message: `Cannot delete user with id=${id}. Maybe user was not found!`,
      });
    }
    return res.send({
      message: 'user was deleted successfully!',
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || `Could not delete user with id= ${id}`,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const users = await User.deleteMany({});
    return res.send({
      message: `${users.deletedCount} users were deleted successfully!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: err.message || 'Some error occurred while removing all users.',
    });
  }
};
export { create, findOne, findAll, update, deleteOne, deleteAll };
