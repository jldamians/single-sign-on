"use strict";

const path = require("path");
const cors = require("cors");
const logger = require("morgan");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const { config } = require("./config");

const routes = require("./routes");

// initializations

const app = express();

// settings

app.engine("ejs", require("ejs-mate"));

app.set("json spaces", 2);

app.set("port", config.appPort);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));

// middlewares

// To enable HTTP cookies.
// Add header "Access-Control-Allow-Credentials: true".
app.use(cors({
  credentials: true,
}));

app.use("/static", express.static(
  path.join(__dirname, "/public")
));

app.use(session({
  // En el caso de haber varias app corriendo en el mismo host,
  // se deberá separar las "cookies" de sesión entre sí. Para
  // ello deberá establecer un nombre diferente por app.
  name: config.cookieName, // default value is "connect.sid"
  secret: config.cookieSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // configurar como "null" si quiere que la sesión permanesca viva
    maxAge: parseInt(config.cookieExpiration),
  },
}));

app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());

app.use(logger("dev"));

// routes

app.use("/", routes);

module.exports = app;
