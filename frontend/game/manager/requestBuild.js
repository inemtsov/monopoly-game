const gameId = require("./gameId");
const userId = require("./userId");

const requestBuild = event => {
    event.preventDefault();

    //'#filterDay input:radio:checked
    var propertyToConstruct = $("#houseNumberGroup input:radio:checked").attr("propertyId");
    var housesToConstruct = $("#houseNumberGroup input:radio:checked").val();

    //console.log("property: "+propertyToConstruct+" nbofhouses: " + housesToConstruct );

    fetch(`/game/${gameId()}/build/${propertyToConstruct}/${housesToConstruct}`, {
        method: "POST",
        credentials: "include"
    });
};

module.exports = requestBuild;
