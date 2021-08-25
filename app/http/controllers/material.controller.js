import db from '../../models/index.js';
import HTTPStatus from 'http-status';
import {
  uploadFileToDrive,
  deleteFileInDrive,
} from '../../../services/googleapis.js';
const Material = db.materials;
const Classroom = db.classrooms;
const Comment = db.comments;
const User = db.users;
const ReplyComment = db.replycomments;

//create material
const create = async (req, res) => {
  const { content, title } = req.body;
  const { user_id } = req.user;

  try {
    const user = await User.findById(user_id);
    const fileAttachmentUrl = req.files
      ? await uploadFileToDrive(req.files)
      : [];

    const material = await Material.create({
      content,
      title,
      ownerId: user_id,
      ownerName: user.name,
      fileAttachment: fileAttachmentUrl,
    });
    if (material)
      await Classroom.findByIdAndUpdate(req.classroom.id, {
        materials: [...req.classroom.materials, material.id],
      });

    return res.status(HTTPStatus.OK).send(material);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating material',
    });
  }
};

//get all material
const findAll = async (req, res) => {
  const { title } = req.query;
  const { classroomId } = req.params;
  const condition = title
    ? {
        title: { $regex: new RegExp(title), $options: 'i' },
        _id: {
          $in: req.classroom.materials,
        },
      }
    : {
        _id: {
          $in: req.classroom.materials,
        },
      };
  try {
    const materials = await Material.find(condition);
    const dataMaterials = await Promise.all(
      materials.map(async (element) => {
        const { avatar: ownerAvatar } = await User.findById(element.ownerId);
        element._doc.ownerAvatar = ownerAvatar;
        return element;
      })
    );
    return res.status(HTTPStatus.OK).json(dataMaterials);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating material',
    });
  }
};

// find a single material with an id
const findOne = async (req, res) => {
  const { materialId } = req.params;
  try {
    const material = await Material.findById(materialId);

    if (!material)
      return res
        .status(HTTPStatus.NOT_FOUND)
        .send({ message: `Not found material with id ${materialId}` });
    const { avatar: ownerAvatar } = await User.findById(material.ownerId);
    material._doc.ownerAvatar = ownerAvatar;
    return res.json(material);
  } catch {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving material with id= ${materialId}` });
  }
};
const update = async (req, res) => {
  const { materialId } = req.params;

  if (!req.body) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'Data to update can not be empty!',
    });
  }
  try {
    if (req.files) {
      const data = await Material.findById(materialId);

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

    const material = await Material.findByIdAndUpdate(materialId, req.body, {
      useFindAndModify: false,
    });
    if (material)
      return res.send({ message: 'material was updated successfully.' });

    return res.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update material with id=${materialId}. Maybe material was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error updating material with id= ${materialId}`,
    });
  }
};

const deleteOne = async (req, res) => {
  const { materialId } = req.params;
  const { materials } = req.classroom;
  try {
    const material = await Material.findByIdAndRemove(materialId);
    if (!material) {
      res.status(HTTPStatus.NOT_FOUND).send({
        message: `Cannot delete material with id=${materialId}. Maybe material was not found!`,
      });
    }
    await Material.findByIdAndUpdate(materialId, {
      materials: [...materials].filter((item) => item !== materialId),
    });

    if (material.fileAttachment) {
      for (const i in material.fileAttachment) {
        material.fileAttachment[i] = material.fileAttachment[i].split('/')[5];
      }
      await deleteFileInDrive(material.fileAttachment);
    }

    const comments = await Comment.deleteMany({
      _id: {
        $in: material.listComments,
      },
    });

    const replyComment = await ReplyComment.deleteMany({
      _id: {
        $in: comments.listReply,
      },
    });

    return res.send({
      message: 'material was deleted successfully!',
    });
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Could not delete material with id= ${materialId}` });
  }
};

const deleteAll = async (req, res) => {
  const { materials } = req.classroom;
  try {
    const data = await Material.find({
      _id: {
        $in: materials,
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
    const material = await Material.deleteMany({
      _id: {
        $in: materials,
      },
    });
    return res.send({
      material,
      message: `${material.deletedCount} posts were deleted successfully!`,
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

  try {
    const classroom = await Classroom.findById(classroomId);
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
const checkMaterialInclude = async (req, res, next) => {
  const { materialId } = req.params;

  try {
    if (req.classroom.materials.includes(materialId)) return next();
    return res.status(HTTPStatus.FORBIDDEN).send({
      message: `Error retrieving when using material doesn't exist in classroom with id= ${req.classroom.id}`,
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
  checkMaterialInclude,
};
