import db from '../../models/index';
import HTTPStatus from 'http-status';
const ReplyComment = db.replycomments;

//create replycomments

const create = async (req, res) => {
  const { message, owner } = req.body;

  try {
    const ReplyComment = await ReplyComment.create(message, owner);
    return res.send(ReplyComment);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while reply comment',
    });
  }
};

//get all replycomment
const findAll = async (req, res) => {
  try {
    const replyComment = await ReplyComment.find({});
    return res.send(replyComment);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while retrieving reply comments.',
    });
  }
};

// find a single turorial with an id
const findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const replyComment = await ReplyComment.findById(id);
    if (!replyComment) return res.send(replyComment);
    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update ReplyComment with id=${id}. Maybe reply comment was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || `Error retrieving reply comment with id=  ${id}`,
    });
  }
};
const update = async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(HTTPStatus.NOT_FOUND).send({
      message: 'Data to update can not be empty!',
    });
  }

  try {
    const replycomment = await ReplyComment.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (replycomment)
      return res.send({ message: 'Reply comment was updated successfully.' });

    res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update ReplyComment with id=${id}. Maybe reply comment was not found!`,
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
    const replyComment = await ReplyComment.findByIdAndRemove(id);
    if (replyComment)
      return res.send({
        message: 'Comment was deleted successfully!',
      });
    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot delete comment with id=${id}. Maybe comment was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Could not delete post with id=' + id,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const replyComments = await ReplyComment.deleteMany({});
    return res.send({
      message: `${replyComments.deletedCount} reply comment were deleted successfully!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message ||
        'Some error occurred while removing all reply comment.',
    });
  }
};
export { create, findOne, findAll, update, deleteOne, deleteAll };
