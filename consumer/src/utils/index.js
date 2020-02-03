"use strict";

const fs = require("fs");
const path = require("path");
const request = require("request");
const Promise = require("bluebird");
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

exports.getAccessToken = function(url, code, auth) {
  const options = {
    url,
    body: {
      code,
      grant_type: "authorization_code",
    },
    json: true,
    headers: {
      Authorization: auth,
    }
  };

  return new Promise(function(resolve, reject) {
    request.post(options, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}
