import db from '../../models/index.js';
import HTTPStatus from 'http-status';
import {
  uploadFileToDrive,
  deleteFileInDrive,
} from '../../../services/googleapis.js';
const Post = db.posts;
const Classroom = db.classrooms;
const Comment = db.comments;
const User = db.users;
const ReplyComment = db.replycomments;
//create post
const create = async (req, res) => {
  const { content, title } = req.body;
  const { user_id } = req.user;
  const { listQuestions } = req.classroom;
  try {
    const user = await User.findById(user_id);
    const fileAttachmentUrl = req.files
      ? await uploadFileToDrive(req.files)
      : [];
    const post = await Post.create({
      content,
      title,
      ownerId: user_id,
      ownerName: user.name,
      fileAttachment: fileAttachmentUrl,
    });
    if (post)
      await Classroom.findByIdAndUpdate(req.classroom.id, {
        listQuestions: [...listQuestions, post.id],
      });

    return res.status(HTTPStatus.OK).send(post);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating post',
    });
  }
};

//get all post
const findAll = async (req, res) => {
  const { title } = req.query;
  const { classroomId } = req.params;
  const condition = title
    ? {
        title: { $regex: new RegExp(title), $options: 'i' },
        _id: {
          $in: req.classroom.listQuestions,
        },
      }
    : {
        _id: {
          $in: req.classroom.listQuestions,
        },
      };
  try {
    const posts = await Post.find(condition);
    const dataPosts = await Promise.all(
      posts.map(async (element) => {
        const { avatar: ownerAvatar } = await User.findById(element.ownerId);
        element._doc.ownerAvatar = ownerAvatar;
        return element;
      })
    );
    return res.status(HTTPStatus.OK).json(dataPosts);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating post',
    });
  }
};

// find a single post with an id
const findOne = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(HTTPStatus.NOT_FOUND)
        .send({ message: `Not found post with id ${postId}` });
    const { avatar: ownerAvatar } = await User.findById(post.ownerId);
    post._doc.ownerAvatar = ownerAvatar;
    return res.send(post);
  } catch {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving post with id= ${postId}` });
  }
};
const update = async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.user;

  if (!req.body) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }
  try {
    if (req.files) {
      const data = await Post.findById(postId);

      if (data.fileAttachment) {
        for (const i in data.fileAttachment) {
          data.fileAttachment[i] = data.fileAttachment[i].split('/')[5];
        }
        await deleteFileInDrive(data.fileAttachment);
      }

      await uploadFileToDrive(req.files).then((res) => {
        req.body.fileAttachment = [...res];
      });
    }

    const post = await Post.findOneAndUpdate(
      { _id: postId, ownerId: user_id },
      req.body,
      {
        useFindAndModify: false,
      }
    );
    if (post) return res.send({ message: 'post was updated successfully.' });

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update post with id=${postId}. Maybe post was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error updating post with id= ${postId}`,
    });
  }
};

const deleteOne = async (req, res) => {
  const { classroomId, postId } = req.params;
  const { user_id } = req.user;
  const { listQuestions } = req.classroom;
  try {
    const post = await Post.findOneAndRemove({
      _id: postId,
      ownerId: user_id,
    });
    if (!post) {
      return res.status(HTTPStatus.FORBIDDEN).send({
        message: `Cannot delete post with id=${postId}. Maybe post was not found or no permission!`,
      });
    }

    await Classroom.findByIdAndUpdate(classroomId, {
      listQuestions: [...listQuestions].filter((item) => item !== postId),
    });

    if (post.fileAttachment) {
      for (const i in post.fileAttachment) {
        post.fileAttachment[i] = post.fileAttachment[i].split('/')[5];
      }
      await deleteFileInDrive(post.fileAttachment);
    }

    const comments = await Comment.deleteMany({
      _id: {
        $in: post.listComments,
      },
    });
    console.log(comments);
    const replyComment = await ReplyComment.deleteMany({
      _id: {
        $in: comments.listReply,
      },
    });
    return res.send({
      message: 'post was deleted successfully!',
    });
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Could not delete post with id= ${postId}` });
  }
};

const deleteAll = async (req, res) => {
  const { listQuestions } = req.classroom;
  try {
    const data = await Post.find({
      _id: {
        $in: listQuestions,
      },
    });

    if (data) {
      data.forEach(async (ele) => {
        if (ele.fileAttachment) {
          for (const i in ele.fileAttachment) {
            ele.fileAttachment[i] = ele.fileAttachment[i].split('/')[5];
          }
          await deleteFileInDrive(ele.fileAttachment);
        }
      });
    }

    const posts = await Post.deleteMany({
      _id: {
        $in: listQuestions,
      },
    });
    return res.send({
      posts,
      message: `${posts.deletedCount} posts were deleted successfully!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all comments.',
    });
  }
};
const checkClassExist = async (req, res, next) => {
  const { classroomId } = req.params;
  const { user_id } = req.user;
  try {
    const classroom = await Classroom.findOne({
      _id: classroomId,
      $or: [{ listUserJoined: { $in: user_id } }, { ownerId: user_id }],
    });
    if (classroom) {
      req.classroom = classroom;
      return next();
    }
    return res.status(HTTPStatus.NOT_FOUND).end();
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving classrom with id= ${classroomId}` });
  }
};
const checkPostInclude = async (req, res, next) => {
  const { postId } = req.params;

  try {
    if (req.classroom.listQuestions.includes(postId)) return next();
    return res.status(HTTPStatus.FORBIDDEN).send({
      message: `Error retrieving when using post doesn't exist in classroom with id= ${req.classroom.id}`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error retrieving classrom with id= ${req.classroom.id}`,
    });
  }
};
export {
  create,
  findOne,
  findAll,
  deleteAll,
  deleteOne,
  update,
  checkClassExist,
  checkPostInclude,
};
