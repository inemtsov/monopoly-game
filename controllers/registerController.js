const player = require('../db/player/index');
const bcrypt = require('bcryptjs');


const validateRegistration = request => {
    request.checkBody('first_name', 'first name is required').notEmpty();
    request.checkBody('last_name', ' last Name is required').notEmpty();
    request.checkBody('email', 'email is required').notEmpty();
    request.checkBody('email', 'email is not valid').isEmail();
    request.checkBody('username', 'username is required').notEmpty();
    request.checkBody('password', 'password length must be minimum 8 characters').isLength(8, 20);
    request.checkBody('password', 'password is required').notEmpty();
    request.checkBody('password_confirmation', 'Password do not match').equals(request.body.password);

    return request.validationErrors();
};

module.exports.createUser = function (request, response, next) {
    const errors = validateRegistration(request);

    if (errors) {
        response.render('register', {errors});
    } else {
        const {first_name, last_name, username, email, password} = request.body;
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        const defaultAvatar = '/images/avatars/avatar.png';

        player.createUser(first_name, last_name, username, email, hash, defaultAvatar)
            .then(() => {
                request.flash('success_msg', 'You are registered and now can login');
                response.redirect('/login');
            })
            .catch(err => {
                request.flash('error', 'Player already exist, please choose different email');
                response.redirect('/register');
            });
    }
};
