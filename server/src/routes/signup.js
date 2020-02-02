"use strict";

const { Router } = require("express");

const { users } = require("../models");

const router = Router();

router
  .route("/signup")
  .post(async function(req, res) {
    try {
      const result = await register(req.body);
      
      res.status(200).json(result);
    } catch ({message}) {
      res.status(404).json({ message });
    }
  });

async function validateIfUsernameWasTaken(username) {
  const user = await users.findOne({ username });

  if (user) {
    return true;
  } else {
    return false;
  }
}

async function register({ names, email, username, password }) {
  const wasTaken = await validateIfUsernameWasTaken(username);

  if (wasTaken === true) {
    throw new Error(`The username '${username}' is already Taken`);
  }

  const newUser = new users();

  newUser.names = names;
  newUser.email = email;
  newUser.username = username;
  newUser.password = newUser.pwdEncrypt(password);

  return await newUser.save();
}

module.exports = router;
