import db from '../../models/index.js';
import HTTPStatus from 'http-status';
import httpStatus from 'http-status';
import _ from 'lodash';
const Classroom = db.classrooms;
const Post = db.posts;
const User = db.users;
const Comment = db.comments;
const ReplyComment = db.replycomments;

//create comments
const create = async (req, res) => {
  try {
    const { className, topic, backgroundImage = '', code = '' } = req.body;
    const { user_id } = req.user;
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ message: 'Cannot match any token of user' });
    }
    const myclass = await Classroom.create({
      className,
      topic,
      ownerName: user.name,
      ownerId: user_id,
      backgroundImage,
      code,
    });

    return res.status(HTTPStatus.OK).json(myclass);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating classroom',
    });
  }
};

const findAll = async (req, res) => {
  const { topic } = req.query;
  const { user_id } = req.user;
  try {
    const condition = topic
      ? {
          topic: { $regex: new RegExp(title), $options: 'i' },
          listUserJoined: {
            $in: user_id,
          },
        }
      : {
          listUserJoined: {
            $in: user_id,
          },
        };
    const listClassJoin = await Classroom.find(condition);

    const listClassOwn = await Classroom.find({
      ownerId: {
        $in: user_id,
      },
    });

    return res.status(HTTPStatus.OK).json({ listClassJoin, listClassOwn });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message:
        error.message || 'Some error occurred while retrieving classrooms.',
    });
  }
};

const findOne = async (req, res) => {
  const { user_id } = req.user;

  const { classroomId } = req.params;
  try {
    const classroom = await Classroom.findOne({
      _id: classroomId,
      $or: [{ listUserJoined: { $in: user_id } }, { ownerId: user_id }],
    });
    const user = await User.findById(classroom.ownerId);
    const { listUserJoined } = classroom;

    const userJoined = await User.find(
      {
        _id: {
          $in: listUserJoined,
        },
      },
      { name: 1, email: 1, avatar: 1, _id: 0 }
    );
    const response = {
      ..._.pick(classroom, [
        'ownerName',
        'createdAt',
        'updatedAt',
        'code',
        'backgroundImage',
        'topic',
        'className',
        'member',
      ]),
      userJoined,
      ownerAvatar: user.avatar,
    };
    if (response) {
      return res.status(HTTPStatus.OK).send(response);
    }
    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: `Not found classrom with id   ${classroomId} ` });
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving classrom with id= ${classroomId}` });
  }
};
const update = async (req, res) => {
  const { classroomId } = req.params;
  const { user_id } = req.user;

  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }

  try {
    const classroom = await Classroom.findOneAndUpdate(
      { _id: classroomId, ownerId: user_id },
      req.body,
      {
        useFindAndModify: false,
      }
    );
    if (classroom)
      return res.send({ message: 'classrom was updated successfully.' });
    return res.status(HTTPStatus.FORBIDDEN).json({
      message: `Cannot update classrom with id=${classroomId}. Maybe classrom was not found or No permission!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error updating classrom with id= ${classroomId}}`,
    });
  }
};

const deleteOne = async (req, res) => {
  const { classroomId } = req.params;
  const { user_id } = req.user;

  try {
    const classroom = await Classroom.findOneAndRemove({
      _id: classroomId,
      ownerId: user_id,
    });
    if (!classroom) {
      return res.status(HTTPStatus.FORBIDDEN).send({
        message: `Cannot delete classrom with id=${classroomId}. Maybe classrom was not found or No permission!`,
      });
    }
    const posts = await Post.deleteMany({
      _id: {
        $in: classroom.listQuestions,
      },
    });
    const comments = await Comment.deleteMany({
      _id: {
        $in: posts.listComments,
      },
    });
    const replyComment = await ReplyComment.deleteMany({
      _id: {
        $in: comments.listReply,
      },
    });
    return res.status(HTTPStatus.OK).json({
      classroom,
      message: `${classroomId} classrooms were deleted successfully!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Could not delete classroom with id= ${classroomId}}`,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const classrooms = await Classroom.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await ReplyComment.deleteMany({});
    return res.status(HTTPStatus.OK).json({
      message: `${classrooms.deletedCount} classrooms were deleted successfully!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all classrooms.',
    });
  }
};

export { create, update, deleteAll, deleteOne, findAll, findOne };
