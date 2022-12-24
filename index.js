const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { use } = require('express/lib/router');
const multer = require('multer');
const res = require('express/lib/response');

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
   },
   filename: function (req, file, cb) {
      const splitName = file.originalname.split('.');
      const fileExtension = splitName[splitName.length - 1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension)
   }
})

const upload = multer({
   storage: storage,
   limits: {
      fileSize: 1000000
   }
})
require('dotenv').config();
const saltRounds = 10;
const port = process.env.PORT || 5000;
const app = express();
app.use(express.static('public'))
require('dotenv').config();

// Middleware
app.use(cors())
app.use(express.json())

// MongoDb

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {

   const authHeader = req.headers.authorization;
   if (!authHeader) {
      return res.status(401).send({ message: 'unauthorized access' });
   }

   const token = authHeader.split(' ')[1];
   console.log(token)

   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
      if (err) {
         return res.status(403).send(err)
      }
      req.decoded = decoded;
      console.log(req.decoded)
      next();
   })

}


async function run() {
   try {

      const categoriesCollection = client.db('Interview_task').collection('categories');
      const userCollection = client.db('Interview_task').collection('users');
      const productsCollection = client.db('Interview_task').collection('products');

      // User Register============================================
      app.post('/register', async (req, res) => {
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
      });

      // User Login=============================================
      app.post('/login', async (req, res) => {
         const userReq = req.body;
         const query = { email: userReq.email }
         const user = await userCollection.findOne(query);

         if (!user || !bcrypt.compareSync(userReq.password, user.password)) {
            return res.status(401).send({ success: false, 'message': "Your credentials were wrong" })
         }

         const token = jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
         const { _id, name, email } = user;

         res.send({ accessToken: token, user: { name, email, id: _id } });
      });

      // Categories fetch===========================================
      app.get('/categories', async (req, res) => {
         const query = {};
         const categories = await categoriesCollection.find(query).toArray();
         res.send(categories);
      })


      // Add Product=============================================
      app.post('/products', verifyJWT, upload.single('image'), async (req, res) => {
         const products = req.body;
         products.image = req.file.destination.substring(7) + req.file.filename;
         const result = await productsCollection.insertOne(products);
         res.send(result);
      });

      // Get Product=============================================
      app.get('/products', async (req, res) => {
         const category = req.params.category;
         let query = {};
         if (category) {
            query = { catrgory: category }
         }
         const products = await productsCollection.find(query).toArray();
         const prodItem = products.map(product => ({ ...product, image: process.env.SITE_URL + '/' + product.image }))
         res.send(prodItem);
      });

   } catch (e) {
      res.json(e)
   }
   finally {

   }

}
run().catch(console.log)

app.get('/', async (req, res) => {
   res.send('Interview tasks Server running')
})

app.listen(port, () => console.log(`OldGold running on port ${port}`))