import db from '../../models/index.js';
import HTTPStatus from 'http-status';

const Comment = db.comments;
const ReplyComment = db.replycomments;
const Post = db.posts;
const Material = db.materials;
const User = db.users;

const create = async (req, res) => {
  const { content, message } = req.body;
  const { user_id } = req.user;

  try {
    const user = await User.findById(user_id);
    const comment = await Comment.create({
      content,
      message,
      ownerId: user_id,
      ownerName: user.name,
    });
    if (comment && req.post)
      await Post.findByIdAndUpdate(req.post.id, {
        listComments: [...req.post.listComments, comment.id],
      });
    if (comment && req.material)
      await Material.findByIdAndUpdate(req.material.id, {
        listComments: [...req.material.listComments, comment.id],
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
    let listComments;
    if (req.post) listComments = req.post.listComments;
    if (req.material) listComments = req.material.listComments;
    const comments = await Comment.find({
      _id: {
        $in: listComments,
      },
    });
    const dataComments = await Promise.all(
      comments.map(async (element) => {
        const { avatar: ownerAvatar } = await User.findById(element.ownerId);
        element._doc.ownerAvatar = ownerAvatar;
        return element;
      })
    );
    return res.status(HTTPStatus.OK).json(dataComments);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while retrieving comments.',
    });
  }
};

// find a single turorial with an id
const findOne = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment)
      return res
        .status(HTTPStatus.NOT_FOUND)
        .send({ message: `Not found comment with id= ${commentId}` });
    const { avatar: ownerAvatar } = await User.findById(comment.ownerId);
    comment._doc.ownerAvatar = ownerAvatar;
    return res.status(HTTPStatus.OK).json(comment);
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving comment with id=  ${commentId}` });
  }
};
const update = async (req, res) => {
  const { commentId } = req.params;
  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }

  try {
    const comment = await Comment.findByIdAndUpdate(commentId, req.body, {
      useFindAndModify: false,
    });
    if (comment)
      return res.send({ message: 'Comment was updated successfully.' });

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update comment with id=${commentId}. Maybe comment was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error updating Comment with id=${commentId}`,
    });
  }
};

const deleteOne = async (req, res) => {
  const { commentId } = req.params;
  const { user_id } = req.user;
  try {
    const comment = await Comment.findOneAndRemove({
      _id: commentId,
      ownerId: user_id,
    });
    if (!comment) {
      return res.status(HTTPStatus.FORBIDDEN).send({
        message: `Cannot delete comment with id=${commentId}. Maybe comment was not found Or No permission!`,
      });
    }
    if (req.post) {
      await Post.findByIdAndUpdate(req.post.id, {
        listComments: [...req.faq.listAnswer].filter(
          (item) => item !== commentId
        ),
      });
    }
    if (req.material) {
      await Material.findByIdAndUpdate(req.material.id, {
        listComments: [...req.faq.listAnswer].filter(
          (item) => item !== commentId
        ),
      });
    }
    const replyComments = await ReplyComment.deleteMany({
      _id: {
        $in: comment.listReply,
      },
    });
    return res.status(HTTPStatus.OK).send({
      message: 'comment was deleted successfully!',
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Could not delete post with id= ${commentId}}`,
    });
  }
};

const deleteAll = async (req, res) => {
  const { ownerId } = req;
  const { postId } = req.params;
  const { user_id } = req.user;
  let listComments = [];
  try {
    if (user_id !== ownerId)
      return res.status(HTTPStatus.FORBIDDEN).send({
        message: `Cannot delete all  comment in post with id=${postId}. Maybe comment was not found or No permission!`,
      });
    if (req.post) listComments = req.post.listComments;
    if (req.material) listComments = req.post.listComments;
    const comments = await Comment.deleteMany({
      _id: {
        $in: listComments,
      },
    });

    if (req.post)
      await Post.findByIdAndUpdate(req.post.id, {
        listComments: [],
      });
    if (req.material)
      await Material.findByIdAndUpdate(req.material.id, {
        listComments: [],
      });
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
const checkPostExist = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (post) {
      req.ownerId = post.ownerId;
      req.post = post;
      return next();
    }
    return res.status(HTTPStatus.NOT_FOUND).end();
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving post with id= ${postId}` });
  }
};
const checkMaterialExist = async (req, res, next) => {
  const { materialId } = req.params;

  try {
    const material = await Material.findById(materialId);
    if (material) {
      req.ownerId = material.ownerId;
      req.material = material;
      return next();
    }
    return res.status(HTTPStatus.NOT_FOUND).end();
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving post with id= ${materialId}` });
  }
};
const checkCommentInclude = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    if (req.post) if (req.post.listComments.includes(commentId)) return next();
    if (req.material)
      if (req.material.listComments.includes(commentId)) return next();

    return res.status(HTTPStatus.FORBIDDEN).send({
      message: `Error retrieving when using comment doesn't exist in post with id= ${
        req.post ? req.post.id : req.material.id
      }`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error retrieving material with id= ${
        req.post ? req.post.id : req.material.id
      }`,
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
  checkPostExist,
  checkCommentInclude,
  checkMaterialExist,
};
