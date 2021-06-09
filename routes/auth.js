const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = mongoose.model("User");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const sanitize = require("mongo-sanitize");

router.post("/signup", (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    return res.status(422).json({ error: "Please Enter All The Fields" });
  }

  User.findOne({ email: sanitize(req.body.email) })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User Exist Already" });
      }

      bcrypt.hash(password, 15).then((hashedPassword) => {
        const user = new User({
          email: req.body.email,
          name: req.body.name,
          password: hashedPassword,
        });

        user
          .save()
          .then((user) => {
            res.json({ Msg: "SignedUp Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(422).json("Email or Password is missing");
  }

  User.findOne({ email: sanitize(req.body.email) })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json("Invalid Email or Password");
      }

      bcrypt
        .compare(req.body.password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            console.log(doMatch);
            //res.json('Successfully signed in');
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email } = savedUser;
            res.json({
              token,
              user: {
                _id,
                name,
                email,
              },
            });
          } else {
            return res.status(422).json("Invalid Email or Password");
          }
        })
        .catch((err) => {
          console.log("Error: " + err);
        });
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
});

module.exports = router;
