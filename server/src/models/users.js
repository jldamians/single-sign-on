"use strict";

const mongoose = require("mongoose");

const bcrypt = require("bcrypt-nodejs");

const { config } = require("../config");

const { Schema } = mongoose;

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true
  },
  names: {
    type: String,
  },
});

schema.methods.pwdEncrypt = function (password) {
  const salt = bcrypt.genSaltSync(config.bcryptSaltRounds);

  return bcrypt.hashSync(password, salt);
};

schema.methods.pwdCompare = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', schema);
