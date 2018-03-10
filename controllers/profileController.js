const player = require('../db/player/index');
const bcrypt = require('bcryptjs');

const validateRegistration = request => {
    if (request.body.newPassword) {
        request.checkBody('newPassword', 'password is required(must be minimum 8 characters)').notEmpty().isLength(8, 20);
        request.checkBody('newPassword2', 'Password do not match').equals(request.body.newPassword);
    }
    return request.validationErrors();
};

const update = function (request, response, next) {
    const errors = validateRegistration(request);

    if (errors) {
        response.render('profile', {errors});
    } else {
        const {first_name, last_name, username, email, newPassword} = request.body;

        player.findPlayerById(request.user.userid)
            .then((user) => {
                let defaultFirstName = user.firstName;
                let defaultLastName = user.lastName;
                let defaultEmail = user.email;
                let defaultUsername = user.username;
                let defaultPassword = user.password;


                if (first_name) {
                    defaultFirstName = first_name;
                }
                if (last_name) {
                    defaultLastName = last_name;
                }

                if (username) {
                    defaultUsername = username;
                }
                if (newPassword) {
                    const salt = bcrypt.genSaltSync();
                    defaultPassword = bcrypt.hashSync(newPassword, salt);
                }

                if (email) {
                    player.findByPlayerEmail(email)
                        .then(foundUser => {
                            if (foundUser) {
                                request.flash('error', 'Account with such Email already exist, please choose different one');
                                response.redirect('/profile');
                            }
                            else {
                                player.update(defaultFirstName, defaultLastName, defaultUsername, email, defaultPassword, request.user.userid)
                                    .then((res) => {
                                        request.flash('success_msg', 'Your profile was updated successfully');
                                        response.redirect('/profile');
                                    })
                                    .catch(err => {
                                        response.redirect('/profile');
                                    });
                            }
                        })
                        .catch((err) => {
                            return response.send(err);
                        });

                } else {
                    player.update(defaultFirstName, defaultLastName, defaultUsername, defaultEmail, defaultPassword, request.user.userid)
                        .then((res) => {
                            request.flash('success_msg', 'Your profile was updated successfully');
                            response.redirect('/profile');
                        })
                        .catch(err => {
                            response.redirect('/profile');
                        });
                }

            })
            .catch((err) => {
                return response.send(err);
            });


    }
};

const loadInfo = (request, response, next) => {

    player.findPlayerById(request.user.userid)
        .then(user => {
            response.render('profile', {user});
        }).catch((err) => {
        return response.send(err);
    });
};


const deleteAccount = (request, response, next) => {
    player.deletePlayer(request.user.userid)
        .then((user) => {
            response.redirect('/login');
            request.logout();
            request.session.destroy();
        }).catch((err) => {
        return response.send(err);
    });
};
module.exports = {
    update,
    loadInfo,
    deleteAccount
};