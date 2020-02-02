"use strict";

const express = require("express");

const ctrl = require("../controllers");

const { users } = require("../models");

const appsRoute = require("../routes/apps");
const signupRoute = require("../routes/signup");

const router = express.Router();

router
  .route("/login")
  .get(ctrl.login)
  .post(ctrl.authenticate)
  ;

router
  .route("/verify")
  .post(ctrl.verify)
  ;

router
  .route("/logout")
  .get(ctrl.logout)
  .post(ctrl.logout)
  ;

router
  .use(appsRoute)
  .use(signupRoute)
  ;

module.exports = router;
