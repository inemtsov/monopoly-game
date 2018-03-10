const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const player = require("../db/player/index.js");

const PASSPORT_SETTINGS = {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
};

const passportHandler = (request, email, password, done) => {
    player
        .findByPlayerEmail(email)
        .then(user => {
            if (user === null) {
                return done(null, false, {message: "No user found"});
            } else {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        return done(null, false, {message: err.message});
                    }
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: "Wrong password"});
                    }
                });
            }
        })
        .catch(error => {
            return done(null, false, {message: error.message});
        });
};

const strategy = new LocalStrategy(PASSPORT_SETTINGS, passportHandler);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.userid);
});

passport.deserializeUser((userid, done) => {
    player
        .findPlayerById(userid)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            if (err) {
                done(null, false);
            }
        });
});

module.exports = passport;
