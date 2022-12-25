const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

module.exports.userCollection = client.db('Interview_task').collection('users');

module.exports.categoriesCollection = client.db('Interview_task').collection('categories');

module.exports.productsCollection = client.db('Interview_task').collection('products');
