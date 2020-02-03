"use strict";

const fs = require("fs");
const jwt = require("jsonwebtoken");

const { config } = require("../config");

module.exports = function(payload) {
  const options = {
    algorithm: "RS256",
    expiresIn: "1h",
    issuer: "sso.factiva.server",
  };

  const token = jwt.sign(payload, { key: getCert(), passphrase: config.jwtPrivateKeyPass }, options);

  return token;
}

function getCert() {
  const cert = fs.readFileSync(config.jwtPrivateKeyPath);

  return cert;
}
