import env from 'dotenv';
env.config();
const config = {
  API_PORT: process.env.API_PORT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  MONGO_URI: process.env.MONGO_URI,
  TOKEN_KEY: process.env.TOKEN_KEY,
};
export default config;
