const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const player = require('../db/player/index');

router.use(express.static('./public'));


const storage = multer.diskStorage({
    destination: './public/images/avatars',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('avatar');

function checkFileType(file, cb) {

    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const uploadAvatar = function (req, res) {
    upload(req, res, (err) => {
        if (err) {
            res.render('profile', {
                msg: err
            });
        } else {
            if (req.file === undefined) {
                res.render('profile', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                player.setAvatar(`/images/avatars/${req.file.filename}`, req.user.userid)
                    .then(res => {
                        res.render('profile');
                    })
                    .catch(err => {
                        res.redirect('/profile');
                    });
            }
        }
    });
};

module.exports = {
    uploadAvatar
};