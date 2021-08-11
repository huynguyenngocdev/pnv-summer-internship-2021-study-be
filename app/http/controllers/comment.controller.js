import db from '../../models/index';
import HTTPStatus from 'http-status';

const Comment = db.comments;
const ReplyComment = db.replycomments;

//create comments
const create = async (req, res) => {
  const { content, message, owner } = req.body;

  try {
    const comment = await Comment.create({
      content,
      message,
      owner,
    });
    return res.status(HTTPStatus.OK).json(comment);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Some error occurred while creating comment',
    });
  }
};

//get all comment
const findAll = async (req, res) => {
  try {
    const comment = await Comment.find({});
    return res.status(HTTPStatus.OK).json(comment);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while retrieving comments.',
    });
  }
};

// find a single turorial with an id
const findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    if (comment) return res.status(HTTPStatus.OK).json(comment);
    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: `Not found comment with id= ${id}` });
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Error retrieving comment with id=' + id });
  }
};
const update = async (req, res) => {
  const { id } = req.params;
  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }

  try {
    const comment = await Comment.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (comment)
      return res.send({ message: 'Comment was updated successfully.' });

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update comment with id=${id}. Maybe comment was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Error updating Comment with id=' + id,
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findByIdAndRemove(id);
    if (comment) {
      const replyComments = await ReplyComment.deleteMany({
        _id: {
          $in: comment.listReply,
        },
      });
      return res.status(HTTPStatus.OK).send({
        message: 'comment was deleted successfully!',
      });
    }

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot delete comment with id=${id}. Maybe comment was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Could not delete post with id=' + id,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const comments = await Comment.deleteMany({});
    return res.status(HTTPStatus.OK).send({
      message: `${comments.deletedCount} comments were deleted successfully!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all comments.',
    });
  }
};
export { create, findOne, findAll, update, deleteOne, deleteAll };
