import db from '../../models/index.js';
import HTTPStatus from 'http-status';
import * as FAQController from './FAQ.controller.js';
const FAQAnswer = db.FAQAnswers;
const FAQ = db.FAQs;
const User = db.users;
//create FAQ answer

const create = async (req, res) => {
  const { faqId } = req.params;
  const { answer } = req.body;
  const { user_id } = req.user;
  try {
    const user = await User.findById(user_id);
    const responseAnswer = await FAQAnswer.create({
      answer,
      userId: user_id,
      userName: user.name,
    });

    const faq = await FAQ.findByIdAndUpdate(faqId, {
      listAnswer: [...req.faq.listAnswer, responseAnswer.id],
    });
    return res.status(HTTPStatus.OK).send(responseAnswer);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating your FAQ',
    });
  }
};

//get all answer in FQA
const findAll = async (req, res) => {
  const { faqId } = req.params;
  try {
    const responseAnswer = await FAQAnswer.find({
      _id: {
        $in: req.faq.listAnswer,
      },
    });
    return res.status(HTTPStatus.OK).send(responseAnswer);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while retrieving question FAQ.',
    });
  }
};

// find a single answer in FQA with an id
const findOne = async (req, res) => {
  const { faqId, faqAnswerId } = req.params;
  try {
    const responseAnswer = await FAQAnswer.findById(faqAnswerId);
    if (responseAnswer) return res.json(responseAnswer);
    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: 'Not found FAQ answer with id ' + faqAnswerId });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Error retrieving this FAQ with id=' + faqAnswerId,
    });
  }
};

const update = async (req, res) => {
  const { faqId, faqAnswerId } = req.params;
  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'FAQ answer question  to update can not be empty!',
    });
  }
  try {
    const responseAnswer = await FAQAnswer.findByIdAndUpdate(
      faqAnswerId,
      req.body,
      {
        useFindAndModify: false,
      }
    );
    if (responseAnswer)
      return res.send({ message: 'FAQ answer was updated successfully.' });
    return req.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update FAQ answer with id=${faqAnswerId}. Maybe  answer of this FAQ was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Error updating FAQ answer with id=' + faqAnswerId,
    });
  }
};

const deleteOne = async (req, res) => {
  const { faqAnswerId, faqId } = req.params;

  try {
    const responseAnswer = await FAQAnswer.findByIdAndRemove(faqAnswerId);

    const faq = await FAQ.findByIdAndUpdate(req.faq.id, {
      listAnswer: [...req.faq.listAnswer].filter(
        (item) => item !== faqAnswerId
      ),
    });

    if (responseAnswer)
      return res.status(HTTPStatus.OK).send({
        message: 'FAQ  answer was deleted successfully!',
      });

    return res.status(HTTPStatus.NOT_FOUND).json({
      message: `Cannot delete FAQ with id=${faqAnswerId}. Maybe FAQ answer was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Could not delete FQA with id=' + faqAnswerId,
    });
  }
};

const deleteAll = async (req, res) => {
  const { faqId } = req.params;
  try {
    const faqAnswer = await FAQAnswer.deleteMany({});
    const faq = await FAQ.findByIdAndUpdate(req.faq.id, { listAnswer: [] });

    return res.status(HTTPStatus.OK).json({
      message: `${faqAnswer.deletedCount} comments were deleted successfully!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while removing all FAQ answer.',
    });
  }
};
const checkFAQExist = async (req, res, next) => {
  const { faqId } = req.params;

  try {
    const faq = await FAQ.findById(faqId);
    if (faq) {
      req.faq = faq;
      return next();
    }
    return res.status(HTTPStatus.NOT_FOUND).end();
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving classrom with id= ${faqId}` });
  }
};
const checkFAQAnswerInclude = async (req, res, next) => {
  const { faqAnswerId } = req.params;

  try {
    if (req.faq.listAnswer.includes(faqAnswerId)) return next();
    return res.status(HTTPStatus.FORBIDDEN).send({
      message: `Error retrieving when using answer doesn't exist in classroom with id= ${req.faq.id}`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error retrieving faqa with id= ${req.faq.id}`,
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
  checkFAQExist,
  checkFAQAnswerInclude,
};
