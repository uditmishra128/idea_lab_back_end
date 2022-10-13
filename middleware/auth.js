const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
async function authUser(req, res, next) {
  const email = req.header("email");
  const password = req.header("password");

  // verify
  try {
    let user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Server Error" });
  }
}

function authRole(role) {
  return (req, res, next) => {
    if (req.body.role !== role) {
      res.status(401);
      return res.send("Not allowed");
    }

    next();
  };
}
module.exports = {
  authUser,
  authRole,
};

// function authUser(req, res, next) {
//   // Get token from header
//   const token = req.header("x-auth-token");

//   // check if not token
//   if (!token) {
//     return res
//       .status(401)
//       .json({ msg: "No token found, autherization denied" });
//   }

//   // verify token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_TOKEN);

//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// }
