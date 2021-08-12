import mongoose from 'mongoose';
import posts from './post.model.js';
import comments from './comment.model.js';
import replycomments from './comment.model.js';
import logs from './log.model.js';
import flashcards from './flashcard.model.js';
import lessons from './lesson.model.js';
import FAQs from './FAQ.model.js';
import FAQAnswers from './FAQAnswer.model.js';
import users from './user.model.js';
mongoose.Promise = global.Promise;

const db = {
  mongoose,
  posts,
  comments,
  replycomments,
  logs,
  flashcards,
  lessons,
  FAQs,
  FAQAnswers,
  users,
};

export default db;
