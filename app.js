require("dotenv").config();
require("./config/database").connect();

const createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const HTTPStatus = require("http-status");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const authRouter = require("./routes/auth");

const app = express();

app.use(bodyParser.json({ type: "application/*+json" }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Declare Routers
app.use("/", indexRouter);
app.use("/api", indexRouter);
app.use("/auth", authRouter);

app.use("/api/users", usersRouter);

app.use("*", (req, res) => {
  res.status(HTTPStatus.NOT_FOUND).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: HTTPStatus.NOT_FOUND,
      message: "You reached a route that is not defined on this server",
    },
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(HTTPStatus.NOT_FOUND));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR);
  res.render("error");
});

module.exports = app;
