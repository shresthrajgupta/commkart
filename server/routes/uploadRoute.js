import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();


const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function fileFilter(req, file, cb) {
    const fileTypes = /jpe?g|png|webp/;
    const mimeTypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimeTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Images only!'), false);
    }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImgae = upload.single('image');

router.post('/', (req, res) => {
    uploadSingleImgae(req, res, function (err) {
        if (err) {
            res.status(400).send({ message: err.message });
        } else {
            res.status(200).send({
                message: 'Image uploaded successfully',
                image: `/${req?.file?.path}`,
            });
        }

    });
});

export default router;