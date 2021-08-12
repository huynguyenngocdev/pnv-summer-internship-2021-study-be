import db from '../../models/index.js';
import HTTPStatus from 'http-status';
import * as FAQController from './FAQ.controller.js';
const FAQAnswer = db.FAQAnswers;

//create FAQ answer

const create = async (req, res) => {
  const { idFAQ } = req.params;
  const { answer, userId, userName } = req.body;
  await FAQController.findOne(idFAQ);
  try {
    const answer_reponse = await FAQAnswer.create({ answer, userId, userName });
    return res.status(HTTPStatus.OK).send(answer_reponse);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating your FAQ',
    });
  }
};

//get all answer in FQA
const findAll = async (req, res) => {
  const { idFAQ } = req.params;
  await FAQController.findOne(idFAQ);
  try {
    const answer_reponse = await FAQAnswer.find();
    return res.status(HTTPStatus.OK).send(answer_reponse);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while retrieving question FAQ.',
    });
  }
};

// find a single answer in FQA with an id
const findOne = async (req, res) => {
  const idFAQ = req.params.idFAQ;
  await FAQController.findOne(idFAQ);
  const { id } = req.params;
  try {
    const answer_reponse = await FAQAnswer.findById(id);
    if (answer_reponse) return res.send(answer_reponse);
    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: 'Not found FAQ answer with id ' + id });
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error || 'Error retrieving this FAQ with id=' + id });
  }
};

const update = async (req, res) => {
  const idFAQ = req.params.idFAQ;
  await FAQController.findOne(idFAQ);
  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'FAQ answer question  to update can not be empty!',
    });
  }
  const { id } = req.params;
  try {
    const answer_reponse = await FAQAnswer.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (answer_reponse)
      return res.send({ message: 'FAQ answer was updated successfully.' });
    return req.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update FAQ answer with id=${id}. Maybe  answer of this FAQ was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Error updating FAQ answer with id=' + id,
    });
  }
};

const deleteOne = async (req, res) => {
  const { id, idFAQ } = req.params;

  try {
    const faq = await FAQController.findOne(idFAQ);
    if (!faq)
      return res.status(HTTPStatus.NOT_FOUND).send({
        message: `Cannot delete FAQ answer with id=${id}. Maybe FAQ question doesn't exists!`,
      });
    const answer_reponse = await FAQAnswer.findByIdAndRemove(id);
    if (answer_reponse)
      return res.status(HTTPStatus.OK).send({
        message: 'FAQ  answer was deleted successfully!',
      });

    return res.status(HTTPStatus.NOT_FOUND).json({
      message: `Cannot delete FAQ with id=${id}. Maybe FAQ answer was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Could not delete FQA with id=' + id,
    });
  }
};

const deleteAll = async (req, res) => {
  const { idFAQ } = req.params;
  const faqAnswer = await FAQController.findOne(idFAQ);
  try {
    const answer_reponse = await FAQAnswer.deleteMany({});
    return res
      .status(HTTPStatus.OK)
      .json({
        message: `${faqAnswer.deletedCount} comments were deleted successfully!`,
      });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all FAQ answer.',
    });
  }
};
export { create, findOne, findAll, update, deleteOne, deleteAll };
