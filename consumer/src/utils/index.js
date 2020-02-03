"use strict";

const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const { config } = require("../config");

exports.jwtVerify = function(accessToken) {
  const options = { algorithms: 'RS256' };

  const decoded = jwt.verify(accessToken, getCert(), options);
}

function getCert() {
  const cert = fs.readFileSync(config.jwtPublicKeyFile);

  return cert;
}

exports.authorizeUrl = function() {
  return path.join(config.ssoServerUrl, "/authorize");
}

exports.tokenUrl = function() {
  return path.join(config.ssoServerUrl, "/token");
}

exports.btoa = function(key, secret) {
  return new Buffer(`${key}:${secret}`).toString("base64");
}
