if (process.env.NODE_ENV === "development") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const expressValidator = require("express-validator");

const index = require("./routes/index");
const users = require("./routes/users");
const login = require("./routes/login");
const register = require("./routes/register");
const lobby = require("./routes/lobby");
const profile = require("./routes/profile");
const logout = require("./routes/logout");
const createGame = require('./routes/createGame');
const game = require('./routes/game');


const passport = require("./config/passport");
const pgSessionStore = require("connect-pg-simple");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(
    expressValidator({
        errorFormatter: function (param, msg, value) {
            let namespace = param.split("."),
                root = namespace.shift(),
                formParam = root;

            while (namespace.length) {
                formParam += "[" + namespace.shift() + "]";
            }
            return {
                param: formParam,
                msg: msg,
                value: value
            };
        }
    })
);

const sessionStore = new (pgSessionStore(session))();
app.sessionStore = sessionStore;

app.use(
    session({
        store: sessionStore,
        secret: "monopoly",
        saveUninitialized: false,
        resave: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

app.use("/", index);
app.use("/users", users);
app.use("/login", login);
app.use("/register", register);
app.use("/lobby", lobby);
app.use("/profile", profile);
app.use("/logout", logout);
app.use('/createGame', createGame);
app.use('/game', game);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});


module.exports = app;
