const { productsCollection } = require('../db');


module.exports = {
   store: async (req, res) => {
      const products = req.body;
      products.image = req.file.destination.substring(7) + req.file.filename;
      const result = await productsCollection.insertOne(products);
      res.send(result);
   },

   get: async (req, res) => {
      let categoryIds = [];
      const searchText = req.query.name;
      if (req.query.categories) {
         categoryIds = JSON.parse(req.query.categories);
      }
      let query = { name: new RegExp(searchText, 'i') };
      if (categoryIds.length > 0) {
         query.category = {
            $in: categoryIds,

         }
      }
      const products = await productsCollection.find(query).toArray();
      const prodItem = products.map(product => ({ ...product, image: process.env.SITE_URL + '/' + product.image }))
      res.send(prodItem);
   }
}