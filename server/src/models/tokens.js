"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema({
  token_code: {
    type: String,
    required: true,
    unique: true
  },
  client_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  audience: {
    type: String,
    required: true
  },
  /*expiration: {
    type: Number,
    required: false,
  },*/
});

module.exports = mongoose.model('tokens', schema);
