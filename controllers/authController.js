const bcrypt = require('bcrypt');
require('dotenv').config();
const { userCollection } = require('../db');
const jwt = require('jsonwebtoken');


const saltRounds = 10;

module.exports = {
   register: async (req, res) => {
      const users = req.body;
      const hashedPassword = bcrypt.hashSync(users.password, saltRounds);
      // const filter = { email: users.email }
      const user = {
         name: users.name,
         email: users.email,
         password: hashedPassword,
      }
      const result = await userCollection.insertOne(user);
      res.send(result)
   },

   login: async (req, res) => {
      const userReq = req.body;
      const query = { email: userReq.email }
      const user = await userCollection.findOne(query);

      if (!user || !bcrypt.compareSync(userReq.password, user.password)) {
         return res.status(401).send({ success: false, 'message': "Your credentials were wrong" })
      }

      const token = jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
      const { _id, name, email } = user;

      res.send({ success: true, accessToken: token, user: { name, email, id: _id } });
   }
}