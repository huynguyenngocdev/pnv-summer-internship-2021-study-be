import env from 'dotenv';
env.config();
export default {
  API_PORT: process.env.API_PORT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  GOOGLE_FOLDER_ID: process.env.GOOGLE_FOLDER_ID,
  MONGO_URI: process.env.MONGO_URI,
  TOKEN_KEY: process.env.TOKEN_KEY,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  REDIRECT_URI: process.env.REDIRECT_URI,
  SECRET_KEY: process.env.SECRET_KEY,
};
