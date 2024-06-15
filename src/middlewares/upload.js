const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder = '';
    if (file.fieldname === 'profileImage') {
      uploadFolder = 'public/images/profile';
    } else {
      uploadFolder = 'public/images/products';
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().getTime() +
        '' +
        Math.round(Math.random() * 1000000000) +
        '.' +
        file.mimetype.split('/')[1]
    );
  },
});

module.exports = multer({
  storage: storage,
  limits: {fileSize: 3000000 /* bytes */},
});
