import jwt from "jsonwebtoken";

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      let token;

      // ✅ Check cookies
      if (req.cookies?.token) {
        token = req.cookies.token;
      }

      // ✅ Or check Authorization header
      if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({ message: "No token provided, please login" });
      }

      // ✅ Verify token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }

        req.user = decoded;
        console.log("✅ Authorized user:", decoded);

        // ✅ Optional role check
        if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
          return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }

        next();
      });
    } catch (error) {
      console.error("Authorize middleware error:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

export default authorize;
