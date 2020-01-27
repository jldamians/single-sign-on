"use strict";

const express = require("express");

const ctrl = require("../controllers");

const router = express.Router();

router
  .route("/login")
  .get(ctrl.login)
  .post(ctrl.authenticate)
  ;

router
  .route("/logout")
  .get(ctrl.logout)
  .post(ctrl.logout)
  ;

module.exports = router;
