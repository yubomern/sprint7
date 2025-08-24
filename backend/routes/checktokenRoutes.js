
// checkuser.js
const express = require("express");
const jwt = require("jsonwebtoken");

const router  = express.Router();

const JWT_SECRET = "sprint4secret"; // put in .env

// Middleware to check token
router.use((req, res, next) => {
  const {token}  = req.cookies;
  console.log('verifiy');
  console.log(req.headers["authorization"]?.split(" ")[1]); // Expect "Bearer token"

  if (!token) {
    return res.status(401).json({ message: "No token provided", expired: true });
  }
   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY|| "sprint4secret");
   console.log("decoded"  +   decoded);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
     console.table(decoded);
     
    if (err) {
      return res.status(403).json({ message: "Token expired or invalid", expired: true });
    }
    req.user = decoded;
    next();
  });
});

// Example secured route
router.get("/current-user", (req, res) => {
  res.json({ message: "✅ Token valid", user: req.user });
});



const verifyToken = (req, res, next) => {
        const tokenheader = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token
        console.log("token header   " +  tokenheader);
        sessionStorage.setItem('token-header' ,  tokenheader);
        const {token}  = req.cookies;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        jwt.verify(token, process.env.JWT_SECRET|| "sprint4secret", (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(403).json({ message: 'Token expired' });
                }
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.user = decoded; // Attach decoded user information to the request
            next();
        });
    };



    // Example in an Express.js route
router.get('/', verifyToken, (req, res) => {
        res.json({ message: 'Access granted', user: req.user });
    });

module.exports =router