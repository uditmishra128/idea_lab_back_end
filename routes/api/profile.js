// const express = require("express");
// const router = express.Router();
// const { check, validationResult } = require("express-validator");

// const auth = require("../../middleware/auth");
// const Profile = require("../../models/Profile");
// const User = require("../../models/User");

// // @route   Get /api/profile/me
// // @desc    Get current user profile
// // @access  Private

// router.get("/me", auth, async (req, res) => {
//   try {
//     const profile = await Profile.findOne({ user: req.user.id }).populate(
//       "user",
//       ["name", "avatar"]
//     );
//     if (!profile) {
//       return res
//         .status(400)
//         .json({ msg: "There is no profile found for user." });
//     }

//     res.send(profile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   Delete /api/profile
// // @desc    Delete profile, users, posts
// // @access  Private

// router.delete("/", auth, async (req, res) => {
//   try {
//     // TODO - remove user posts

//     // Remove Profile
//     await Profile.findOneAndRemove({ user: req.user.id });

//     // Remove User
//     await Profile.findOneAndRemove({ _id: req.user.id });

//     res.json({ msg: "User Deleted Successfully!" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;
