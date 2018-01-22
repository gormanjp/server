const User = require("../models/user");

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
      res.json(user);
    });
  });
};
