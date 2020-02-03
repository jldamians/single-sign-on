"use strict";

exports.uuid = require("./uuid");
exports.token = require("./token");
exports.origin = require("./origin");

exports.atob = function(base64) {
  return new Buffer(base64, "base64").toString();
}
