"use strict";

const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const engine = require("ejs-mate");
const express = require("express");
const cookie = require("cookie-parser");
const session = require("express-session");

const { config } = require("./config");

const { isAuthenticated, callback } = require("./controllers");

// initializations

const app = express();

// settings

app.engine("ejs", engine);

app.set("json spaces", 2);

app.set("port", config.appPort);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));

// middlewares

app.use(cors({
  credentials: true,
}));

app.use("/static", express.static(
  path.join(__dirname, "/public")
));

app.use(cookie());

app.use(session({
  name: config.cookieName,
  secret: config.cookieSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: Number.parseInt(config.cookieExpiration),
  },
}));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(logger("dev"));

// routes

app.get("/callback", callback);

app.get("/", isAuthenticated, function(req, res, next) {
  res.render("me", {
    information: JSON.stringify(req.session.user),
    title: "Factur@ctiva",
  })
})

// starting the server

app.listen(app.get('port'), () => {
  console.log(`Server listening on port:${app.get('port')}`);
});
