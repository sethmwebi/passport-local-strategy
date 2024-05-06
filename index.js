const express = require("express");
const router = require("./lib/router");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const DB = require("./lib/db");

const app = express();

app.use(
  cookieSession({
    name: "app-auth",
    keys: ["secret-new", "secret-old"],
    maxAge: 60 * 60 * 24,
  }),
);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log(`4 - Serialize user: ${JSON.stringify(user.id)}`);
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(`Deserializing user: ${id}`);
  const user = DB.findOne(id);
  if (user) {
    return done(null, { id: user.id, email: user.email });
  } else {
    return done(new Error("No user with id is found"));
  }
});

passport.use(
  "local",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      console.log(`2. Local strategy verify cb: ${JSON.stringify(username)}`);
      console.log(req.user);
      let user = DB.findByEmail(username);
      if (!user) {
        return done(null, false);
      }
      const result = await new Promise((resolve, reject) => {
        bcrypt.compare(password, user.security.passwordHash, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      });

      if (result) {
        return done(null, result);
      } else {
        return done(
          `Username or password is incorrect. Please try again!`,
          null,
        );
      }
    },
  ),
);
const port = process.env.PORT || 3000;

let _ = {};

_.start = () => {
  try {
    app.listen(port, () =>
      console.log(`Express server listening on port ${port}`),
    );
  } catch (error) {
    throw new Error(error);
  }
};

app.use("/api", router);
_.start();
