"use strict";

require("dotenv").config();

const config = {
  appPort: process.env.APP_PORT,
  cookieName: process.env.COOKIE_NAME,
  cookieSecret: process.env.COOKIE_SECRET,
  cookieExpiration: process.env.COOKIE_EXPIRATION,
  jwtPrivateKeyPath: process.env.JWT_PRIVATE_KEY_PATH,
  jwtPrivateKeyPass: process.env.JWT_PRIVATE_KEY_PASS,
  mongodbUri: process.env.MONGODB_URI,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
};

module.exports = { config };
