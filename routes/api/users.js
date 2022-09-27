const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

// @route   Post /api/users
// @desc    Register user
// @access  Public

router.post(
  "/create",
  [
    check("name", "Name can not be empty").not().isEmpty(),
    check("email", "Enter a valid email id").isEmail(),
    check("phone", "Enter a vaild Phone number").isMobilePhone(),
    check("college", "College can not be empty").not().isEmpty(),
    check("branch", "Branch can not be empty").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, college, branch } = req.body;

    try {
      // Check if user already exist

      let user = await User.findOne({
        $or: [
          {
            email: email,
          },
          {
            phone: phone,
          },
        ],
      });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        phone,
        college,
        branch,
      });

      await user.save();

      // Return json web token

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   Post /api/users
// @desc    get user
// @access  Public

router.post(
  "/getUser",
  [check("email", "Enter a valid email id").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, college, branch } = req.body;

    try {
      // Check if user already exist

      let user = await User.findOne({ email });
      if (user) {
        return res.status(200).json({ sucess: [{ user: user }] });
      }

      user = new User({
        name,
        email,
        phone,
        college,
        branch,
      });

      await user.save();

      // Return json web token

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
