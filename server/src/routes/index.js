"use strict";

const express = require("express");

const ctrl = require("../controllers");
const appsRoute = require("../routes/apps");
const signupRoute = require("../routes/signup");

const router = express.Router();

router
  .route("/authorize")
  .get(ctrl.toAuthorize)
  .post(ctrl.toLogin);

router
  .route("/token")
  .post(ctrl.getAccessToken);

/*router
  .route("/logout")
  .get(ctrl.logout)
  .post(ctrl.logout)
  ;*/

router
  .use(appsRoute)
  .use(signupRoute)
  ;

module.exports = router;
