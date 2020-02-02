"use strict";

const { Router } = require("express");

const { apps } = require("../models");

const { uuid } = require("../utils");

const router = Router();

router.route("/apps")
  .post(async function(req, res) {
    const { name, callback, audience } = req.body;

    try {
      const newApp = new apps();
  
      newApp.name = name;
      newApp.redirectUri = callback;
      newApp.jwtAud = audience;
      newApp.clientID = uuid();
  
      const result = await newApp.save();

      res.status(200).json(result);
    } catch ({message}) {
      res.status(404).json({ message });
    }
  });

module.exports = router;

