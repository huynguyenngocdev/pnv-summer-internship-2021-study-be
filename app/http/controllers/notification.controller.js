import db from '../../models/index.js';
import HTTPStatus from 'http-status';
const Notification = db.notifications;

const findAll = async (req, res) => {
  const { user_id } = req.user;
  try {
    const newMessage = await Notification.find(
      {
        userId: user_id,
        isRead: false,
      },
      { userId: 0 }
    )
      .limit(10)
      .sort({ createdAt: 'descending' });
    const oldMessage = await Notification.find(
      { user: user_id, isRead: true },
      { userId: 0 }
    )
      .limit(30)
      .sort({ createdAt: 'descending' });

    return res.status(HTTPStatus.OK).json({ newMessage, oldMessage });
  } catch (error) {
    return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      message:
        error.message || 'Some error occurred while retrieving classrooms.',
    });
  }
};

export { findAll };
