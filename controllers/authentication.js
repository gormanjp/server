const jwt = require("jwt-simple");

const config = require("../config");
const User = require("../models/user");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // sub == subject
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  console.log(res, req);
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  // See if a user with the given email exists
  if (!email || !password) {
    return res.status(422).send({ error: "missing email or password" });
  }
  User.findOne({ email: email }, function(error, existingUser) {
    if (error) {
      return next(error);
    }

    // If a user with email already exists, return error
    if (existingUser) {
      return res.status(422).send({ error: "email in use!" });
    }

    // If a user with email does not exist, create and sace user record
    const user = new User({
      email: email,
      password: password
    });
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      // Respond to request indicating the user was created
      res.json({ teken: tokenForUser(user) });
    });
  });
};
