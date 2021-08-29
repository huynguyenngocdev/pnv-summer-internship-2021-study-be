import db from '../../models/index.js';
import HTTPStatus from 'http-status';
import _ from 'lodash';
import crypto from 'crypto';
const {
  classrooms: Classroom,
  posts: Post,
  users: User,
  comments: Comment,
  materials: Materials,

  replycomments: ReplyComment,
  notifications: Notification,
} = db;
const baseUrl = 'https://pnv-ces-classwork.herokuapp.com';
import config from '../../../config/config.js';
const { SECRET_KEY } = config;

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
  const { search } = req.query;
  const { user_id } = req.user;
  try {
    const condition = search
      ? {
          $or: [
            { topic: { $regex: new RegExp(search), $options: 'i' } },
            { className: { $regex: new RegExp(search), $options: 'i' } },
          ],
          listUserJoined: {
            $nin: user_id,
          },
        }
      : {
          listUserJoined: {
            $in: user_id,
          },
        };
    const listClassJoin = await Classroom.find(condition, {
      listQuestions: 0,
      materials: 0,
    });
    const { avatar: ownerAvatar } = await User.findById(user_id, {
      avatar: 1,
      _id: 0,
    });
    const listClassOwn = await Classroom.find(
      {
        ownerId: {
          $in: user_id,
        },
      },
      {
        listQuestions: 0,
        materials: 0,
      }
    );
    const dataClassJoin = await Promise.all(
      listClassJoin.map(async (item) => {
        const { _id: id, listUserJoined, ownerId, ...props } = item._doc;
        const userJoin = await User.find(
          { _id: { $in: listUserJoined } },
          { avatar: 1, name: 1, email: 1, _id: 0 }
        );
        const { avatar } = await User.findById(ownerId);
        return { ...props, id, ownerAvatar: avatar, userJoin };
      })
    );
    if (search) {
      return res.status(HTTPStatus.OK).json(dataClassJoin);
    }
    const dataClassOwn = await Promise.all(
      listClassOwn.map(async (item) => {
        const { _id: id, listUserJoined, ...props } = item._doc;
        const userJoin = await User.find(
          { _id: { $in: listUserJoined } },
          { avatar: 1, name: 1, email: 1, _id: 0 }
        );
        return { ...props, id, ownerAvatar, userJoin };
      })
    );

    return res.status(HTTPStatus.OK).json({ dataClassJoin, dataClassOwn });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
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
    const {
      listUserJoined,
      listQuestions,
      materials,
      _id: id,
      ...restProps
    } = classroom._doc;

    const userJoined = await User.find(
      {
        _id: {
          $in: listUserJoined,
        },
      },
      { name: 1, email: 1, avatar: 1, _id: 0 }
    );
    const response = {
      ...restProps,
      id,
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
  if (req.body.ownerId) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'Cannot update ownerId',
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
    const posts = await Post.find({
      _id: {
        $in: classroom.listQuestions,
      },
    });
    const materials = await Materials.find({
      _id: {
        $in: classroom.materials,
      },
    });
    await Post.deleteMany({
      _id: {
        $in: classroom.listQuestions,
      },
    });
    await Materials.deleteMany({
      _id: {
        $in: classroom.materials,
      },
    });
    const listComments = [
      ...posts.map((element) => element.listComments),
      ...materials.map((element) => element.listComments),
    ];
    const comments = await Comment.find({
      _id: {
        $in: listComments,
      },
    });
    await Comment.deleteMany({
      _id: {
        $in: listComments,
      },
    });
    const listReply = comments.map((element) => element.listReply);

    const replyComment = await ReplyComment.deleteMany({
      _id: {
        $in: listReply,
      },
    });
    return res.status(HTTPStatus.OK).json({
      classroom,
      message: `${classroomId} classrooms were deleted successfully!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Could not delete classroom with id= ${classroomId}`,
    });
  }
};

const deleteAll = async (req, res) => {
  const { user_id } = req.user;
  try {
    const classrooms = await Classroom.find({ ownerId: user_id });
    const deletedClassrooms = await Classroom.deleteMany({ ownerId: user_id });
    if (!deletedClassrooms.deletedCount)
      return res.json({ message: 'Cannot find any classroom to delete' });

    const listPosts = classrooms.map((element) => element.listQuestions);
    const listMaterials = classrooms.map((element) => element.materials);

    const posts = await Post.find({
      _id: {
        $in: listPosts,
      },
    });
    const materials = await Materials.find({
      _id: {
        $in: listMaterials,
      },
    });
    await Post.deleteMany({
      _id: {
        $in: listPosts,
      },
    });
    await Materials.deleteMany({
      _id: {
        $in: listMaterials,
      },
    });
    const listComments = [
      ...posts.map((element) => element.listComments),
      ...materials.map((element) => element.listComments),
    ];
    const comments = await Comment.find({
      _id: {
        $in: listComments,
      },
    });
    await Comment.deleteMany({
      _id: {
        $in: listComments,
      },
    });
    const listReply = comments.map((element) => element.listReply);

    await ReplyComment.deleteMany({
      _id: {
        $in: listReply,
      },
    });

    return res.status(HTTPStatus.OK).json({
      message: `${deletedClassrooms.deletedCount} classrooms were deleted successfully!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all classrooms.',
    });
  }
};

const joinClassroom = async (req, res) => {
  try {
    const { code } = req.query;
    const { user_id } = req.user;
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(HTTPStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'No one user match with token!' });
    }

    const classroom = await Classroom.findOne({ code: code });

    if (!code || !classroom) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ message: 'Code or Classroom is not existing!' });
    }

    if (
      classroom.ownerId != user_id &&
      !classroom.listUserJoined.find((ele) => ele == user_id)
    ) {
      await Classroom.updateOne(
        { code: code },
        { $push: { listUserJoined: [user_id] }, $inc: { member: 1 } }
      );
      return res
        .status(HTTPStatus.OK)
        .json({ message: 'Join in the Classroom successful.' });
    }
    return res
      .status(HTTPStatus.BAD_REQUEST)
      .json({ message: 'You have been in this classroom!' });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while join in classroom.',
    });
  }
};

const leaveClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { user_id } = req.user;
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(HTTPStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'No one user match with token!' });
    }

    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ message: 'Classroom is not existing!' });
    }

    if (classroom.ownerId != user_id) {
      await Classroom.findByIdAndUpdate(classroomId, {
        $pull: { listUserJoined: user_id },
        $inc: { member: -1 },
      });
      return res.status(HTTPStatus.OK).json({
        message: 'Leave the classroom successful!',
      });
    } else {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        message:
          'You are ower of this classroom, can not leave. Please delete the classroom!',
      });
    }
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all classrooms.',
    });
  }
};
const acceptJoinClassroom = async (req, res) => {
  const { code } = req.query;
  const { user_id } = req.user;
  const { classroomId } = req.params;
  try {
    const rawSignature = `userId=${user_id}&classroomId=${classroomId}`;
    const inviteKey = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(rawSignature)
      .digest('hex');
    const verifySignature = inviteKey === code;
    if (!verifySignature) {
      return res.status(HTTPStatus.OK).json({
        message: 'The signature not valid',
      });
    }

    const checkUserInClassroom = await Classroom.findById(classroomId);
    if (checkUserInClassroom.ownerId === user_id)
      return res.status(HTTPStatus.OK).json({
        message: 'You are owner in classroom!',
      });
    if (checkUserInClassroom.listUserJoined.includes(user_id)) {
      return res.status(HTTPStatus.OK).json({
        message: 'You have been in this classroom!',
      });
    }
    await Classroom.findByIdAndUpdate(classroomId, {
      $push: { listUserJoined: [user_id] },
      $inc: { member: 1 },
    });

    return res
      .status(HTTPStatus.OK)
      .json({ message: 'Join in the Classroom successful.' });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while join in classroom.',
    });
  }
};
const inviteClassroom = async (req, res) => {
  const { classroomId } = req.params;
  const { user_id, email: ownerEmail } = req.user;
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ message: 'email is require' });
    }
    const checkUserExist = await User.findOne({ email });
    if (!checkUserExist)
      return res.status(HTTPStatus.BAD_REQUEST).json({
        message: `This user has email ${email} not exist in system!`,
      });
    const classroom = await Classroom.findOne({
      _id: classroomId,
      ownerId: user_id,
    });
    if (!classroom)
      return res.status(HTTPStatus.FORBIDDEN).json({
        message: ` Maybe classrom was not found or No permission!`,
      });
    const { id: invitedUserId } = checkUserExist;
    const rawSignature = `userId=${invitedUserId}&classroomId=${classroomId}`;
    const inviteKey = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(rawSignature)
      .digest('hex');
    const link = `${baseUrl}/api/classrooms/${classroomId}/joinClassroom?code=${inviteKey}`;
    await Notification.create({
      message: `${ownerEmail}message want to you join class`,
      link,
      userId: invitedUserId,
    });
    return res.status(HTTPStatus.OK).json({
      message: `Invite ${email} success. Waiting for them accept!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while invite member.',
    });
  }
};
const removeMember = async (req, res) => {
  const { classroomId } = req.params;
  const { user_id, email: ownerEmail } = req.user;
  const { email } = req.body;
  try {
    if (!email)
      return res.status(HTTPStatus.BAD_REQUEST).send({
        message: 'email  can not be empty!',
      });
    const classroom = await Classroom.findOne({
      _id: classroomId,
      ownerId: user_id,
    });
    if (!classroom)
      return res.status(HTTPStatus.FORBIDDEN).json({
        message: ` Maybe classrom was not found or No permission!`,
      });
    const checkUserRemove = await User.findOne({ email });
    const { id: requestRemovedUserId } = checkUserRemove;
    if (requestRemovedUserId === user_id)
      return res.json({
        message:
          'You are onwner! Cannot remove your self. Please choose delete class if you want',
      });
    if (!checkUserRemove)
      return res.status(HTTPStatus.OK).json({
        message: `This user has email ${email} not exist in system!`,
      });
    const { listUserJoined } = classroom;
    if (!listUserJoined.includes(checkUserRemove.id))
      return res.status(HTTPStatus.BAD_REQUEST).json({
        message: `This user has email ${email} not  in this classroom! Check email is correct`,
      });
    await Classroom.findByIdAndUpdate(classroomId, {
      listUserJoined: [...listUserJoined].filter(
        (item) => item !== checkUserRemove.id
      ),
    });
    return res.json({ message: 'Success' });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message ||
        `Some error occurred while remove  user has ${email} in  classrooms.`,
    });
  }
};
const requestTojoinClassroom = async (req, res) => {
  const { classroomId } = req.params;
  const { user_id, email } = req.user;
  try {
    const classroom = await Classroom.findById(classroomId);
    const { listUserJoined = [], ownerId = '', className } = classroom;
    if (listUserJoined.includes(user_id) || user_id === ownerId) {
      return res.status(HTTPStatus.OK).json({
        message: `You already been in this classroom`,
      });
    }
    const rawSignature = `userId=${ownerId}&classroomId=${classroomId}&join=approve&email=${email}`;
    const inviteKey = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(rawSignature)
      .digest('hex');
    const link = `${baseUrl}/api/classrooms/${classroomId}/approveMember?code=${inviteKey}&email=${email}`;
    const oldNotification = await Notification.findOne({ link: link });
    if (oldNotification) return res.json({ message: 'Watiing for accept' });
    await Notification.create({
      message: ` User ${email} want to you approve to join ${className}`,
      link,
      userId: ownerId,
    });

    return res.json({ message: 'request successful' });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message ||
        `Some error occurred while request to join  classroom ${classroomId} `,
    });
  }
};
const approveMember = async (req, res) => {
  const { user_id } = req.user;
  const { classroomId } = req.params;
  const { code, email } = req.query;
  if (!code)
    return res
      .status(HTTPStatus.BAD_GATEWAY)
      .json({ message: 'Code not empty' });
  try {
    const rawSignature = `userId=${user_id}&classroomId=${classroomId}&join=approve&email=${email}`;
    const userRequest = await User.findOne({ email });
    if (!userRequest) {
      return res.status(HTTPStatus.NOT_FOUND).json({
        message: `This email: ${email} not exists in our system!`,
      });
    }
    const { id: userJointId } = userRequest;
    const inviteKey = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(rawSignature)
      .digest('hex');
    const verifySignature = inviteKey === code;
    if (!verifySignature) {
      return res.status(HTTPStatus.OK).json({
        message: 'The signature not valid',
      });
    }
    const checkUserInClassroom = await Classroom.findById(classroomId);
    if (!checkUserInClassroom)
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ message: 'Classroom Not Found' });
    const { listUserJoined, ownerId } = checkUserInClassroom;
    if (user_id !== ownerId) {
      return res.status(HTTPStatus.FORBIDDEN).json({
        message: 'No permission!',
      });
    }
    if (userJointId === ownerId) {
      return res.status(HTTPStatus.FORBIDDEN).json({
        message: 'You are owner in classroom',
      });
    }
    if (listUserJoined.includes(userJointId)) {
      return res.status(HTTPStatus.OK).json({
        message: 'You have been in this classroom!',
      });
    }
    await Classroom.findByIdAndUpdate(classroomId, {
      $push: { listUserJoined: [userJointId] },
      $inc: { member: 1 },
    });

    return res.status(HTTPStatus.OK).json({ message: 'Successful' });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message ||
        `Some error occurred while approve member join in classroom.`,
    });
  }
};
export {
  create,
  update,
  deleteAll,
  deleteOne,
  findAll,
  findOne,
  joinClassroom,
  leaveClassroom,
  acceptJoinClassroom,
  inviteClassroom,
  removeMember,
  requestTojoinClassroom,
  approveMember,
};
