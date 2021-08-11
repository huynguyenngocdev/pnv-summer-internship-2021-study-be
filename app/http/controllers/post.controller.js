import db from '../../models/index.js';
import HTTPStatus from 'http-status';
const Post = db.posts;
const Comment = db.comments;

//create post
const create = async (req, res) => {
  const { content, title, owner } = req.params;
  try {
    const post = Post.create({ content, title, owner });
    return res.send(post);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating post',
    });
  }
};

//get all post
const findAll = async (req, res) => {
  const { title } = req.query;
  const condition = title
    ? { title: { $regex: new RegExp(title), $options: 'i' } }
    : {};
  try {
    const posts = await Post.find(condition);
    return res.status(HTTPStatus.OK).json(posts);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating post',
    });
  }
};

// find a single post with an id
const findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) return res.send(post);

    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: 'Not found post with id ' + id });
  } catch {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving post with id= ${id}` });
  }
};
const update = async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }
  try {
    const post = await Post.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (post) return res.send({ message: 'post was updated successfully.' });

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update post with id=${id}. Maybe post was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error updating post with id=+ ${id}`,
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndRemove(id);
    if (!post) {
      res.status(HTTPStatus.NOT_FOUND).send({
        message: `Cannot delete post with id=${id}. Maybe post was not found!`,
      });
    }
    const comment = await Comment.deleteMany({
      _id: {
        $in: data.listComment,
      },
    });
    return res.send({
      message: 'post was deleted successfully!',
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Could not delete post with id=' + id,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const posts = await Post.deleteMany({});
    return res.send({
      message: `${posts} posts were deleted successfully!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all comments.',
    });
  }
};

export { create, findOne, findAll, deleteAll, deleteOne, update };
