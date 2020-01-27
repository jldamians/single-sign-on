"use strict";

const HttpStatus = require('http-status-codes');

const { uuid, origin } = require("../utils");

const SessionUserDB = {};
const SessionApplicationDB = {};
const TokenCache = {};

const OriginApplicationNameDB = {
  "http://localhost:3001": "factiva.emisores",
  "http://localhost:3002": "factiva.receptores",
};

exports.authenticate = (req, res, next) => {
  const { username, password } = req.body;

  if (username !== 'jldamians' || password !== '123456') {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Accesos incorrectos' });
  }

  const { redirect_uri } = req.query;

  if (!redirect_uri) {
    return res.redirect("/");
  }

  const userId = uuid();

  const tokenCode = uuid();

  const originUrl = origin(redirect_uri);

  ///////////////////////////////////////////////////

  const originName = OriginApplicationNameDB[originUrl];

  if (SessionApplicationDB.hasOwnProperty(userId) === false) {
    SessionApplicationDB[userId] = { [originName]: true };
  } else {
    SessionApplicationDB[userId][originName] = true;
  }

  TokenCache[tokenCode] = {
    userId: userId,
    provider: OriginApplicationNameDB[originUrl],
  };

  ///////////////////////////////////////////////////

  req.session.user = userId;

  SessionUserDB[userId] = username;

  return res.redirect(`${redirect_uri}?token=${tokenCode}`)
};

exports.login = (req, res, next) => {
  const { redirect_uri } = req.query;

  if (!redirect_uri) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'Defina el servicio' });
  } else {
    const originUrl = origin(redirect_uri);

    if (originUrl !== 'http://localhost:3001') {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Origen no permitido' });
    }
  }

  if (req.session && req.session.user) {
    const tokenCode = uuid();

    const userId = req.session.user;

    const originUrl = origin(redirect_uri);

    ///////////////////////////////////////////////////

    const originName = OriginApplicationNameDB[originUrl];

    if (SessionApplicationDB.hasOwnProperty(userId) === false) {
      SessionApplicationDB[userId] = { [originName]: true };
    } else {
      SessionApplicationDB[userId][originName] = true;
    }

    TokenCache[tokenCode] = {
      userId: userId,
      provider: OriginApplicationNameDB[originUrl],
    };

    ///////////////////////////////////////////////////
    return res.redirect(`${redirect_uri}?token=${tokenCode}`);
  }

  return res.render("login", {
    provider: 'Factur@ctiva'
  });
}

exports.logout = (req, res) => {
  req.session.destroy();

  res.send("Logout success!");
}
