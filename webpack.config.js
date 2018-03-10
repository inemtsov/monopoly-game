const path = require("path");

module.exports = [
    {
        entry: "./frontend/main",
        output: {
            path: path.resolve(__dirname, "public/javascripts"),
            filename: "bundle.js"
        },
        target: "web"
    },
    {
        entry: "./frontend/game/",
        output: {
            path: path.resolve(__dirname, "public/javascripts"),
            filename: "gameBundle.js"
        },
        target: "web"
    }
];
