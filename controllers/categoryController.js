const { categoriesCollection } = require('../db');

module.exports = {
   get: async (req, res) => {
      const query = {};
      const categories = await categoriesCollection.find(query).toArray();
      const data = {};
      categories.forEach(category => {
         if (!category.parent_id) {
            data[category._id] = category;
         }
         else {
            if (data[category.parent_id].children) {
               data[category.parent_id].children.push(category)
            } else {
               data[category.parent_id].children = [category];
            }
         }
      })
      res.send(Object.values(data));
   }
}