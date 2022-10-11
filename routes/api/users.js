const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
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
      res.status(201).send({
        sucess: {
          user: user,
        },
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   Post /api/users
// @desc    get user
// @access  Public

router.get("/get_user/:id", async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ msg: "Enter a vaild user_id" });
  }

  try {
    // Check if user already exist

    let user = await User.findById(req.params.id);
    if (user) {
      return res.status(200).json({ sucess: [{ user: user }] });
    }

    res.status(404).json({ msg: "user not found" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
