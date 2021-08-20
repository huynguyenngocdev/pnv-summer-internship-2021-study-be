import db from '../../models/index.js';
import HTTPStatus from 'http-status';
const User = db.users;

const findOne = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .send({ message: `Not found user` });
    }
    return res.status(HTTPStatus.FOUND).json(user);
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving user` });
  }
};
const update = async (req, res) => {
  const { userId } = req.params;

  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, {
      useFindAndModify: false,
    });
    if (!user) {
      return res.status(HTTPStatus.NOT_FOUND).send({
        message: `Cannot update user with id=${userId}. Maybe user was not found!`,
      });
    }
    return res.send({ message: 'user was updated successfully.' });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message`Error updating user with id= ${userId}`,
    });
  }
};

export { update, findOne };
