const uuid = require('uuid');
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination: 'product-data/images',
        filename: (err, file, cb) => {
            cb(null, uuid.v4() + '-' + file.originalname);
        },
    })
});

const multerMiddleware = upload.single('image');

module.exports = multerMiddleware;
