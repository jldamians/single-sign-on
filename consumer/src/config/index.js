"use strict";

require("dotenv").config();

const config = {
  appPort: process.env.APP_PORT,
  ssoServerUrl: process.env.SSO_SERVER_URL,
  jwtPublicKeyPath: process.env.JWT_PUBLIC_KEY_PATH,
  cookieSecret: process.env.COOKIE_SECRET,
  cookieName: process.env.COOKIE_NAME,
  cookieExpiration: process.env.COOKIE_EXPIRATION,
};

module.exports = { config };
