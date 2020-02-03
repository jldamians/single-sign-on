"use strict";

const url = require("url");
const axios = require("axios");
const crypto = require("crypto");
const querystring = require("querystring");

const utils = require("../utils");
const { config } = require("../config");

exports.isAuthenticated = function(req, res, next) {
  // https://alexbilbie.com/guide-to-oauth-2-grants/
  const response_type = "code";

  // https://en.wikipedia.org/wiki/Cross-site_request_forgery
  const state = crypto.randomBytes(15).toString('hex');

  const redirect_uri = `${req.protocol}://${req.headers.host}/callback`;

  let client_id;

  if (req.host === 'web01.factiva.com') {
    client_id = "RDOpkO1EWnI4PWzxkEw8SGYj8Mn";
  } else if (req.host === 'web02.factiva.com') {
    client_id = "kW3GQAkXV3s22GYKGQOju2Jxx9AR";
  } else if (req.host === 'web03.factiva.com') {
    client_id = "B00g2VgzMwUWO01D1EpZflB8z6A";
  }

  if (!req.session.user) {
    const qs = querystring.stringify({
      state,
      client_id,
      redirect_uri,
      response_type,
    });

    res.cookie("auth_state", state, { httpOnly: true });

    return res.redirect(`${utils.authorizeUrl}?${qs}`);
  }

  next();
}

exports.callback = async function(req, res, next) {
  const { code, state} = req.query;

  const { auth_state } = req.cookies;

  if (!state || state !== auth_state) {
    return next(new Error("El estado no coincide"));
  }

  res.clearCookie("auth_state");

  let client_id, client_secret;

  if (req.host === 'web01.factiva.com') {
    client_id = "RDOpkO1EWnI4PWzxkEw8SGYj8Mn";
    client_secret = "KTg3HZP5Q1CU7Sr9YbdMFNnuILtGfOw4";
  } else if (req.host === 'web02.factiva.com') {
    client_id = "kW3GQAkXV3s22GYKGQOju2Jxx9AR";
    client_secret = "BL1PsSDkW8X52QxefKhCGTq0guvIMNa4";
  } else if (req.host === 'web03.factiva.com') {
    client_id = "B00g2VgzMwUWO01D1EpZflB8z6A";
    client_secret = "U7G2g0yCiPmv5VS3rnqDaQ6JofpLWhBw";
  }

  const basicAuth = `Basic ${utils.btoa(client_id, client_secret)}`;

  let response;

  try {
    response = await utils.getAccessToken(utils.tokenUrl(), code, basicAuth);
  } catch ({message}) {
    return res.status(200).json({ message: `Error al canjear el token de acceso: ${message}` });
  }

  let decoded;

  try {
    const { access_token, token_type } = response.data;

    decoded = utils.jwtVerify(access_token);
  } catch ({message}) {
    return res.status(200).json({ message: `Error al verificar el token de acceso: ${message}` });
  }

  // TODO: revisar la data que se salva en sesión
  req.session.user = decoded;

  return res.redirect(url.parse(req.url).pathname);
}
