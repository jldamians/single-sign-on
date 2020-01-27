"use strict";

const { URL } = require("url");

module.exports = (uri) => {
  const url = new URL(uri);

  return url.origin;
}
