const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.verifyJWT = (req, res, next) => {

   const authHeader = req.headers.authorization;
   if (!authHeader) {
      return res.status(401).send({ message: 'unauthorized access' });
   }

   const token = authHeader.split(' ')[1];

   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
      if (err) {
         return res.status(403).send(err)
      }
      req.decoded = decoded;
      next();
   })

}