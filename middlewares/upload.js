const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder = '';
    switch (file.fieldname) {
      case 'profileImage':
        uploadFolder = 'public/images/profile';
        break;
      case 'productImage':
        uploadFolder = 'public/images/products';
        break;
      case 'paymentProofImage':
        uploadFolder = 'public/images/payment-proof';
        break;
      default:
        uploadFolder = '';
        break;
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
