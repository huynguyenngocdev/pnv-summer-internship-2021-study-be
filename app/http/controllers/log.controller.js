import db from '../../models/index.js';
import HTTPStatus from 'http-status';
const Log = db.logs;
// const Class = db.classes;
//create
const create = async (req, res) => {
  const { classroomId, action, byUserId, userName } = req.body;
  try {
    const log = await Log.create({
      action,
      byUserId,
      userName,
      classroomId,
      log: `${action} by ${userName}  at  ${new Date().toLocaleString()}`,
    });
    return res.send(log);
  } catch (error) {
    res.status(HTTPStatus.NOT_FOUND).send({
      message: error.message || `Maybe class ${classroomId} not found or`,
    });
  }
};

//get all
const findAll = async (req, res) => {
  const { classId } = req.params;
  try {
    // const findClass= classes.findById(classId)
    // find class before insert, if not found stop request
    //maybe need auth in here
  } catch (error) {
    res.status(HTTPStatus.NOT_FOUND).send({
      message: error.message || `Maybe class ${classId} not found`,
    });
  }
  try {
    const findLogs = await Log.find({});
    return res.send(findLogs);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while retrieving users.',
    });
  }
};

// find a single turorial with an id
const findOne = async (req, res) => {
  const { id, classId } = req.params;
  try {
    // const findClass= classes.findById(classId)
    // find class before insert
    //maybe need auth in here
  } catch (error) {
    res.status(HTTPStatus.NOT_FOUND).send({
      message: error.message || `Maybe class ${classId} not found`,
    });
  }
  try {
    const findLog = await Log.findById(id);
    if (findLog) return res.send(findLog);
    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: `Not found user with id ${id}` });
  } catch (error) {
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving user with id= ${id}` });
  }
};

export { create, findAll, findOne };
