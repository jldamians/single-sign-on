"use strict";

const { config } = require("../config");

const mongoose = require("mongoose");

mongoose.connect(config.mongodbUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

exports.apps = require("./apps");
exports.users = require("./users");
exports.tokens = require("./tokens");
