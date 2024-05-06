const { v4: uuidv4 } = require("uuid");
const validate = require("validate.js");
const constraints = require("../lib/constraints");
const bcrypt = require("bcryptjs");
const DB = require("../lib/db");

let _ = class User {
  constructor() {
    this.created = Date.now();
    this.id = uuidv4();
    this.name = {
      first: null,
      last: null,
    };
    this.email = null;
    this.security = {
      passwordHash: null,
    };
    this.banned = false;
  }

  // save the user to the database
  save(data) {
    // console.log(`Successfully saved user ${this.id} to the database`);
    DB.write(data);
  }

  // Find a user with a given id
  find(id) {
    return "";
  }

  setFirstName(firstName) {
    try {
      if (firstName) {
        firstName = firstName.trim().replace(/ +/g, "");
      }
      let msg = validate.single(firstName, constraints.name);
      if (msg) {
        return msg;
      } else {
        this.name.first = firstName;
        return;
      }
    } catch (error) { }
  }

  setLastName(lastName) {
    try {
      if (lastName) {
        lastName = lastName.trim().replace(/ +/g, "");
      }

      let msg = validate.single(lastName, constraints.name);

      if (msg) {
        return msg;
      } else {
        this.name.last = lastName;
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  setEmail(email) {
    try {
      let msg = validate.single(email, constraints.email);

      if (msg) {
        return msg;
      } else {
        this.email = email;
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async setPassword(password) {
    try {
      let msg = validate.single(password, constraints.password);
      if (msg) {
        return msg;
      } else {
        this.security.passwordHash = await bcrypt.hash(password, 10);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
};

module.exports = _;
