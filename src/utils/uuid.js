"use strict";

const { v4 } = require("uuid");

const Hashids = require("hashids");

module.exports = () => {
  const hashids = new Hashids();

  const uuid = v4().replace(/-/gi, "");

  return hashids.encodeHex(uuid);
};
