const jwt = require("jsonwebtoken");

function authUser(req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // check if not token
  if (!token) {
    return res
      .status(401)
      .json({ msg: "No token found, autherization denied" });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.jwtToken);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
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
