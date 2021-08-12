import db from '../../models/index.js';
import HTTPStatus from 'http-status';

const FAQ = db.FAQs;
const FAQAnswer = db.FAQAnswers;
//create FAQ
const create = async (req, res) => {
  const { question, answer } = req.body;

  try {
    const faq = await FAQ.create({
      question,
      answer,
    });
    return res.status(HTTPStatus.OK).send(faq);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while creating your FAQ',
    });
  }
};

//get all FAQ
const findAll = async (req, res) => {
  const { question } = req.params;
  const condition = question
    ? { question: { $regex: new RegExp(question), $options: 'i' } }
    : {};
  try {
    const faqs = await FAQ.find(condition);
    return res.status(HTTPStatus.OK).send(faqs);
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message:
        error.message || 'Some error occurred while retrieving question FAQ.',
    });
  }
};

// find a single FQA with an id
const findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await FAQ.findById(id);
    if (faq) return res.send(faq);

    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: `Not found FAQ with id ${id}` });
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving FAQ with id=  ${id}` });
  }
};

const update = async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'FAQ question  to update can not be empty!',
    });
  }
  try {
    const faq = await FAQ.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (faq) return res.send({ message: 'FAQ was updated successfully.' });

    return req.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update FAQ with id=${id}. Maybe FAQ was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error updating FAQ with id=${id}`,
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await FAQ.findByIdAndRemove(id);
    if (faq) {
      await FAQAnswer.deleteMany({
        _id: {
          $in: faq.listAnswer,
        },
      });
      return res.status(HTTPStatus.OK).send({
        message: 'FAQ was deleted successfully!',
      });
    }
    return res.status(HTTPStatus.NOT_FOUND).json({
      message: s`Cannot delete  this FAQ with id=${id}. Maybe this FAQ was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Could not delete FQA with id= ${id}`,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const faqs = await FAQ.deleteMany({});
    return res.status(HTTPStatus.OK).json({
      message: `${faqs.deletedCount} comments were deleted successfully!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message || 'Some error occurred while removing all FAQs.',
    });
  }
};
export { create, findOne, findAll, update, deleteOne, deleteAll };
