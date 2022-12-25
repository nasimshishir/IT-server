const express = require('express');
const cors = require('cors');

const { verifyJWT } = require('./middlewares/authMiddleware');
const { upload } = require('./middlewares/fileUpload');

const authController = require('./controllers/authController');
const categoryController = require('./controllers/categoryController');
const productController = require('./controllers/productController');



require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.static('public'))

// Middleware
app.use(cors())
app.use(express.json())




async function run() {
   try {
      app.post('/register', authController.register);
      app.post('/login', authController.login);

      app.get('/categories', categoryController.get);

      app.post('/products', verifyJWT, upload.single('image'), productController.store);
      app.get('/products', productController.get);

   }
   finally {

   }

}
run()

app.get('/', async (req, res) => {
   res.send('Interview tasks Server running')
})

app.listen(port, () => console.log(`OldGold running on port ${port}`))