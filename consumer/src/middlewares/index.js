"use strict";

const url = require("url");
const axios = require("axios");

exports.callback = function(req, res, nex) {
  return async function(req, res, next) {
    const { code, state } = req.query;
  }
}