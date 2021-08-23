import db from '../../models/index.js';
import HTTPStatus from 'http-status';

const FAQ = db.FAQs;
const FAQAnswer = db.FAQAnswers;
const User = db.users;
const create = async (req, res) => {
  const { question, answer } = req.body;
  const { user_id } = req.user;
  try {
    const user = await User.findById(user_id);
    const faq = await FAQ.create({
      question,
      answer,
      image,
      ownerId: user_id,
      ownerName: user.name,
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
  const { faqId } = req.params;
  try {
    const faq = await FAQ.findById(faqId);
    if (faq) return res.send(faq);

    return res
      .status(HTTPStatus.NOT_FOUND)
      .send({ message: `Not found FAQ with id ${faqId}` });
  } catch (error) {
    return res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .send({ message: `Error retrieving FAQ with id=  ${faqId}` });
  }
};

const update = async (req, res) => {
  const { faqId } = req.params;

  if (!req.body) {
    return res.status(HTTPStatus.BAD_REQUEST).send({
      message: 'FAQ question  to update can not be empty!',
    });
  }
  try {
    const faq = await FAQ.findByIdAndUpdate(faqId, req.body, {
      useFindAndModify: false,
    });
    if (faq) return res.send({ message: 'FAQ was updated successfully.' });

    return req.status(HTTPStatus.NOT_FOUND).send({
      message: `Cannot update FAQ with id=${faqId}. Maybe FAQ was not found!`,
    });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Error updating FAQ with id=${faqId}`,
    });
  }
};

const deleteOne = async (req, res) => {
  const { faqId } = req.params;
  try {
    const faq = await FAQ.findByIdAndRemove(faqId);
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
      message: `Cannot delete  this FAQ with id=${faqId}. Maybe this FAQ was not found!`,
    });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
      message: `Could not delete FQA with id= ${faqId}`,
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
