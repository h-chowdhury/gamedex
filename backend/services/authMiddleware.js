import jwt from 'jsonwebtoken';

// verify validity of token
export const verifyToken = (req, res, next) => {

  // get token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // return error if token does not exist
  if (!token) {
    return res.status(401).json({message: "No token, authorisation denied."})
  }

  try {
    // verify token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({message: "Invalid token"});
  }  

}