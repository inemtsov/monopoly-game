const gameId = require("./gameId");

const displayHouses = event => {
    event.preventDefault();

    let nbOfHousesAutorized = document.getElementById(event.target.id).getAttribute('houses');
let propertyToBuildId = event.target.id;
propertyToBuildId = propertyToBuildId.substring(6);
    $("#houseNumberGroup").html("");
    $("#buildActionButton").prop('disabled', true);

    for(let i = 0; i < nbOfHousesAutorized; i++){
        $("#houseNumberGroup").append('<label class="btn btn-primary active">' +
            '<input type="radio" name="options" value="'+ (i+1) +'" propertyId="'+propertyToBuildId+'" id="+' + i +'">' + (i+1) + ' house(s)</label>');
        document.querySelector("#houseNumberGroup").addEventListener('click', () =>{
            $("#buildActionButton").prop('disabled', false);
        });
    }
};

module.exports = displayHouses;
