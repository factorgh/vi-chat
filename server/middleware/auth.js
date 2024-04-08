import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res.status(403).json({ msg: "An error ocurred" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimLeft();
  }

  const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
  req.user = verifiedUser;
  next();
};
