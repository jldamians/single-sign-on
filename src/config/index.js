"use strict";

require("dotenv").config();

const config = {
  port: process.env.PORT,
  cookieName: process.env.COOKIE_NAME,
  cookieSecret: process.env.COOKIE_SECRET,
  cookieExpiration: process.env.COOKIE_EXPIRATION,
  jwtPrivateKeyFile: process.env.JWT_PRIVATE_KEY_FILE,
};

module.exports = { config };

