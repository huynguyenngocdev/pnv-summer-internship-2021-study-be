import mongoose from "mongoose";
import env from "./config.js";
const { MONGO_URI } = env;
const connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log(MONGO_URI);
      console.log("Database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
export default connect;
