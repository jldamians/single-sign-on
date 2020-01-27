"use strict";

const path = require("path");

const logger = require("morgan");

const express = require("express");

const session = require("express-session");

const cookieParser = require("cookie-parser");

const { config } = require("./config");

const routes = require("./routes");

const app = express();

app.engine("ejs", require("ejs-mate"));

// app settings

app.set("json spaces", 2);

app.set("port", config.port);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));

// load middlewares

/*app.use("/imgs", express.static(
  path.join(__dirname, "/public/imgs")
));*/

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

app.use((req, res, next) => {
  console.log('estas son las sesiones del servidor =>');

  console.log(req.session);

  next();
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());

app.use(logger("dev"));

// load routes

app.use("/", routes);

module.exports = app;
