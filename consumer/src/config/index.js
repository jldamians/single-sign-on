"use strict";

require("dotenv").config();

const config = {
  publicKey,
  ssoServerUrl: process.env.SSO_SERVER_URL,
  jwtPublicKeyFile: process.env.JWT_PUBLIC_KEY_FILE,
};

module.exports = { config };
