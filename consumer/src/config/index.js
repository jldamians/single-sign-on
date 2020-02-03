"use strict";

require("dotenv").config();

const config = {
  appPort: process.env.APP_PORT,
  ssoServerUrl: process.env.SSO_SERVER_URL,
  jwtPublicKeyPath: process.env.JWT_PUBLIC_KEY_PATH,
};

module.exports = { config };
