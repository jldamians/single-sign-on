"use strict";

const querystring = require('querystring');
const HttpStatus = require('http-status-codes');

const { uuid, origin } = require("../utils");

const { apps, users, tokens } = require("../models");

const SessionUserDB = {};
const SessionApplicationDB = {};
const TokenCache = {};

async function getApplicationInfo({client_id, redirect_uri}) {
  if (!client_id) {
    throw new Error('Debe enviar el parámetro client_id');
  }

  if (!redirect_uri) {
    throw new Error('Debe enviar el parámetro redirect_uri');
  }

  const information = await apps.findOne({ 
    clientID: client_id,
  });

  if (!information) {
    throw new Error('El valor del parámetro client_id es incorrecto');
  }

  const originUrl = origin(redirect_uri);

  if (information.jwtAud !== originUrl) {
    throw new Error('El valor del parámetro redirect_uri no está permitido');
  }

  return information;
}

async function signin({username, password}) {
  const information = await users.findOne({ username });

  if (!information) {
    throw new Error('Usuario incorrecto');
  }

  if (!information.pwdCompare(password)) {
    throw new Error('Contraseña incorrecta');
  }

  return information;
}

async function cachingTokenCode(params) {
  console.log(params);
  // {token_code, client_id, user_id, audience}
  const newToken = new tokens({ ...params });

  await newToken.save();
}

exports.authenticate = async (req, res, next) => {
  // login

  let app;
  
  try {
    app = await getApplicationInfo(req.query);
  } catch ({message}) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message });
  }

  let user;

  try {
    user = await signin(req.body);
  } catch ({message}) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message });
  }
  
  /*
    Tras haber solicitado autorización al propietario del recurso,
    el cliente deberá recibir una "concesión de autorización" desde
    servidor de autorización

    La concesión (código de autorización) se obtiene 
    utilizando un servidor de autorización como intermediario 
    entre el cliente y el propietario del recurso
  
    La concesión es una credencial que representa la 
    autorización del propietario para acceder 
    a sus recursos protegidos, y deberá ser utilizado 
    por el cliente para obtener un "token de acceso"
  */
 
  // session
 
  req.session.user = user._id;
 
  // authorization grant

  const tokenCode = uuid();

  const { state, client_id, redirect_uri } = req.query;

  try {
    await cachingTokenCode({
      client_id,
      user_id: user._id,
      audience: app.name,
      token_code: tokenCode,
    });
  } catch ({message}) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message })
  }

  // token code and redirect

  const params = { code: tokenCode };

  if (state) {
    params['state'] = state;
  }

  const query = querystring.stringify(params);

  return res.redirect(`${redirect_uri}?${query}`);
};

exports.login = async (req, res) => {
  const { 
    state, client_id, redirect_uri, response_type,
  } = req.query;
  
  let application;
  
  try {
    application = await getApplicationInfo(req.query);
  } catch ({message}) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message });
  }

  if (req.session && req.session.user) {
    const tokenCode = uuid();

    try {
      await cachingTokenCode({
        client_id,
        token_code: tokenCode,
        user_id: req.session.user,
        audience: application.name,
      });
    } catch ({message}) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message })
    }

    const params = { code: tokenCode };

    if (state) {
      params['state'] = state;
    }

    const query = querystring.stringify(params);

    return res.redirect(`${redirect_uri}?${query}`);
  }

  return res.render("login", {
    provider: 'Factur@ctiva',
  });
}

exports.verify = async (req, res) => {debugger;
  const authorization = req.headers["authorization"];

  const auth = req.get("authorization");

  debugger;
}

exports.logout = (req, res) => {
  req.session.destroy();

  res.send("Logout success!");
}
