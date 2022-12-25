const multer = require('multer');

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

module.exports.upload = multer({
   storage: storage,
   limits: {
      fileSize: 1000000
   }
})