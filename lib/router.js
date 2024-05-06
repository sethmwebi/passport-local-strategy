const express = require("express");
const User = require("../models/User");
const passport = require("passport");

let _ = express.Router();

_.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(firstName, lastName, email, password);
    let user = new User();

    let msg = false;

    msg = user.setFirstName(firstName);
    if (msg)
      res
        .status(400)
        .json({ error: { code: 400, type: "first name", message: msg } });

    msg = user.setLastName(lastName);
    if (msg)
      res
        .status(400)
        .json({ error: { code: 400, type: "last name", message: msg } });

    msg = user.setEmail(email);
    if (msg)
      res
        .status(400)
        .json({ error: { code: 400, type: "email", message: msg } });

    msg = await user.setPassword(password);
    if (msg)
      res
        .status(400)
        .json({ error: { code: 400, type: "password", message: msg } });

    user.save();
    res.status(200).json(user);
  } catch (error) {
    throw new Error(error);
  }
});

_.post("/login", (req, res, next) => {
  console.log(`1. Login handler ${JSON.stringify(req.body)}`);
  passport.authenticate("local", (err, user) => {
    console.log(`3. Passport authentication cb ${JSON.stringify(user)}`);
    if (err) {
      return res.status(401).json({
        timestamp: Date.now(),
        msg: `Access denied. Username or password is incorrect.`,
        code: 401,
      });
    }
    if (!user) {
      return res
        .status(401)
        .json({ timestamp: Date.now(), msg: `Unauthorized user`, code: 401 });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        redirectTo: "/profile",
      });
    });
  })(req, res, next);
});

_.post("/logout", async (req, res) => {
  try {
    res.status(200).json({
      timestamp: Date.now,
      msg: "Logged out successfully!",
      code: 200,
    });
  } catch (error) {
    throw new Error(error);
  }
});

_.all("*", async (req, res) => {
  try {
    res.status(404).json({
      timestamp: Date.now,
      msg: "No route matches your request",
      code: 404,
    });
  } catch (error) { }
});
module.exports = _;
