import db from '../../models/index.js';
import HTTPStatus from 'http-status';
const ReplyComment = db.replycomments;
const Comment = db.comments;
const User = db.users;
const create = async (req, res) => {
  const { message } = req.body;
  const { user_id } = req.user;

  try {
    const user = await User.findById(user_id);

    const replyComment = await ReplyComment.create({
      message,
      ownerId: user_id,
      ownerName: user.name,
    });
    if (replyComment)
      await Comment.findByIdAndUpdate(req.comment.id, {
        listReply: [...req.comment.listReply, replyComment.id],
      });
    return res.send(replyComment);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while reply comment',
    });
  }
};

const findAll = async (req, res) => {
  try {
    const replyComments = await ReplyComment.find({
      _id: {
        $in: req.comment.listReply,
      },
    });
    const dataReplyComments = await Promise.all(
      replyComments.map(async (element) => {
        const { avatar: ownerAvatar } = await User.findById(element.ownerId);
        element._doc.ownerAvatar = ownerAvatar;
        return element;
      })
    );
    return res.json(dataReplyComments);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while retrieving reply comments.',
    });
  }
};

// find a single turorial with an id
const findOne = async (req, res) => {
  const { replyCommentId } = req.params;
  try {
    const replyComment = await ReplyComment.findById(replyCommentId);
    if (!replyComment)
      return res.status(HTTPStatus.NOT_FOUND).send({
        message: `Cannot update ReplyComment with id=${replyCommentId}. Maybe reply comment was not found!`,
      });
    const { avatar: ownerAvatar } = await User.findById(replyComment.ownerId);
    replyComment._doc.ownerAvatar = ownerAvatar;
    return res.send(replyComment);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message ||
        `Error retrieving reply comment with id=  ${replyCommentId}`,
    });
  }
};
const update = async (req, res) => {
  const { replyCommentId } = req.params;

  if (!req.body) {
    return res.status(HTTPStatus.NOT_FOUND).send({
      message: 'Data to update can not be empty!',
    });
  }

  try {
    const replycomment = await ReplyComment.findByIdAndUpdate(
      replyCommentId,
      req.body,
      {
        useFindAndModify: false,
      }
    );
    if (replycomment)
      return res.send({ message: 'Reply comment was updated successfully.' });

    res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update ReplyComment with id=${replyCommentId}. Maybe reply comment was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error updating Comment with id= ${replyCommentId}`,
    });
  }
};

const deleteOne = async (req, res) => {
  const { replyCommentId } = req.params;
  try {
    const replyComment = await ReplyComment.findByIdAndRemove(replyCommentId);
    if (replyComment) {
      await Comment.findByIdAndUpdate(req.comment.id, {
        listReply: [...req.comment.listReply].filter(
          (item) => item !== replyCommentId
        ),
      });
      return res.send({
        message: 'Comment was deleted successfully!',
      });
    }
    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot delete comment with id=${replyCommentId}. Maybe comment was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Could not delete post with id=${replyCommentId}`,
    });
  }
};

const deleteAll = async (req, res) => {
  const { ownerId, listReply } = req.comment;
  const { commentId } = req.params;
  const { user_id } = req.user;
  try {
    if (user_id !== ownerId)
      return res.status(HTTPStatus.FORBIDDEN).send({
        message: `Cannot delete all reply comment with id=${commentId}. Maybe comment was not found or No permission!`,
      });
    const replyComments = await ReplyComment.deleteMany({
      _id: {
        $in: listReply,
      },
    });
    await Comment.findOneAndUpdate(commentId, {
      listReply: [],
    });
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
const checkCommentExist = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (comment) {
      req.comment = comment;
      return next();
    }
    return res.status(HTTPStatus.NOT_FOUND).end();
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving comment with id= ${commentId}` });
  }
};
const checkRelyCommentInclude = async (req, res, next) => {
  const { replyCommentId } = req.params;

  try {
    if (req.comment.listReply.includes(replyCommentId)) return next();
    return res.status(HTTPStatus.FORBIDDEN).send({
      message: `Error retrieving when using comment doesn't exist in comment with id= ${req.comment.id}`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error retrieving comment with id= ${req.comment.id}`,
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
  checkCommentExist,
  checkRelyCommentInclude,
};
