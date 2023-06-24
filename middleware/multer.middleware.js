const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../public/images'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
        }
    }),
    limits: {
        fieldNameSize: 300,
        fieldSize: 2000000
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(null, false);
            throw new Error('Only image files are allowed.')
        }
    }
});

const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await sharp(req.files.thumbnail[0].path)
        // .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${req.files.thumbnail[0].filename.replace(/\.[^/.]+$/, '.jpeg')}`)
    fs.unlinkSync(`public/images/${req.files.thumbnail[0].filename}`);
    await Promise.all(req.files.images.map(async (file) => {
        await sharp(file.path)
            // .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/images/products/${file.filename.replace(/\.[^/.]+$/, '.jpeg')}`)
        fs.unlinkSync(`public/images/${file.filename}`);
    }));
    next();
}

const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/images/blogs/${file.filename}`)
        // .fs.unlinkSync(`public/images/blogs/${file.filename}`);
    }));
    next();
}

module.exports = { upload, productImgResize, blogImgResize };