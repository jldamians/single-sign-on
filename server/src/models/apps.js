"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  /*description: {
    type: String,
  },*/
  // should be an absolute path for the server that will be consuming the tokens
  /*audience: {
    type: String,
    required: true,
    unique: true,
  },*/
  redirectUri: {
    type: String,
    required: false,
    unique: true,
  },
  clientID: {
    type: String,
    required: true,
    unique: true,
  },
  /*clientSecret: {
    type: String,
    required: true,
    unique: false,
  },*/
  // expiration time
  jwtExp: {
    type: Number,
    required: false,
  },
  // audience
  // should be an absolute path for the server that will be consuming the tokens
  jwtAud: {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model('apps', schema);
