const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator");
const { ROLE } = require("../../config/constant");
const Admin = require("../../models/admin");

// @route   Get /api/auth
// @desc    ADMIN
// @access  Public

router.post(
  "/admin",
  [check("email", "Enter a valid email id").isEmail()],
  auth.authRole(ROLE.ADMIN),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await Admin.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }
      // Return json web token

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_TOKEN,
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

// @route   Post /api/auth
// @desc    Authenticate user & get token
// @access  Public

router.post(
  "/sendOtp",
  [
    check("email", "Enter a valid email id").isEmail(),
    check("otp", "Otp is required ").exists(),
  ],
  async (req, res) => {
    const { email, otp } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ email });
    try {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      // Message object
      let message = {
        // Comma separated list of recipients
        to: email,

        // Subject of the message
        subject: "Registration OTP for IDEA Lab",

        // plaintext body
        text: "Hello to myself!",

        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">LNCT IDEA LAB</a>
              </div>
              <p style="font-size:1.1em">Hi,</p>
              <p> Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
              <p style="font-size:0.9em;">Regards,<br />AICTE IDEA Lab LNCT</p>
              <hr style="border:none;border-top:1px solid #eee" />
            </div>
          </div>`,
      };
      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.log("Error occurred");
          console.log(error.message);
          return process.exit(1);
        }

        console.log("Message sent successfully!");

        transporter.close();
        if (user) {
          return res.send({
            success: { send: true, user: user },
          });
        } else {
          return res.send({ success: { send: true } });
        }
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
