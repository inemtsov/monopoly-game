const ELEMENTS = require("./elements");
const updateLogScroll = require("./updateLogScroll");
const updatePiecePosition = require("./updatePiecePosition");
const userId = require("./userId");
const askProperties = require("./askProperties");
const payJail = require("./payJail");
const useJailCard = require("./useJailCard");
const roll = require("./roll");
const displayHouses = require("./displayHouses");

const initGame = ({players, pot, propertiesBuildable, status, bankrupt}) => {
    // GAMEOVER
    let playerClass;
    if (bankrupt == userId()) {
        let gameOverModal = $('#gameOverModal');
        gameOverModal.modal('show');
    }

    $("#playerButtons").html("");
    var len = players.length;
    $(".space .hallway").html("");
    for (var i = 0; i < len; i++) {
        if (players[i].userid == userId() && players[i].isTurn == 1) {
            ELEMENTS.rollDice.disabled = false;
            ELEMENTS.finishTurn.disabled = false;
            $(".yourTurn").show();
        }
        if (players[i].userid == userId() && players[i].isTurn == 1 && players[i].hasRolled == 1) {
            // console.log("has rolled");
            ELEMENTS.rollDice.disabled = true;
        }

        if (players[i].userid == userId() && players[i].isTurn == 1 && players[i].inJail == 1 && players[i].hasRolled == 0) {
            let jailModal = $("#jailModal");
            jailModal.modal('show');
            jailModal.find(".modal-body").html('You have <b>' + players[i].jailFreeCardsOwned + '</b> get out of jail card(s)');

            //Add Roll button to the modal
            jailModal.find(".modal-footer").html(' <button type="button" id="rollJailButton" class="btn btn-primary" data-dismiss="modal">Roll dice</button>\n');
            let rollJailButton = document.querySelector('#rollJailButton');
            rollJailButton.addEventListener("click", roll);

            //Add pay button to the modal
            if (players[i].money > 50) {
                jailModal.find(".modal-footer").append('<button type="button" id ="payButton" class="btn btn-primary" data-dismiss="modal">Pay $50</button>');
                let payButton = document.querySelector('#payButton');
                payButton.addEventListener("click", payJail);
            }

            //add use card button to the modal
            if (players[i].jailFreeCardsOwned > 0) {
                jailModal.find(".modal-footer").append('<button type="button" id ="cardButton" class="btn btn-primary" data-dismiss="modal">Use my card</button>');
                let cardButton = document.querySelector('#cardButton');
                cardButton.addEventListener("click", useJailCard);
            }
        }

        if (players[i].userid == userId() && players[i].isTurn == 0) {
            $(".yourTurn").hide();
        }
        if (players[i].userid == userId() && players[i].inJail == 1) $(".youAreInJail").show();
        if (players[i].userid == userId() && players[i].inJail == 0) $(".youAreInJail").hide();
        if (players[i].userid == userId()) {
            $(".nbJailCard").html('Get out of jail card: <b>' + players[i].jailFreeCardsOwned + '</b>');
        }

        if (pot != null) {
            $(".gamePot").html('Game Pot: <b>$' + pot + '<b>');
        }

        if (players[i].userid == userId()) {
            playerClass = " btn-success ";
        } else {
            playerClass = " btn-primary ";
        }

        $("#playerButtons").append('<button type=\"button\" class=\"btn ' + playerClass + ' center-block playerButton\" id="button' + i +
            '" value=\"' + players[i].userid + '">' + players[i].username + ' <br/> $' + players[i].money + '</button>');

        let playerButton = document.querySelector('#button' + i);
        playerButton.addEventListener("click", askProperties);

        if (players[i].username.length > 5) players[i].username = players[i].username.substring(0, 5);
        let newDivId = "#" + players[i].position + " .hallway";
        $(newDivId).append(
            '<b class="playerPiece" id="id' + players[i].userid + '" style="solid 2px black;">' + players[i].username + '</br></b>'
        );
    }//end for loop players

    //build process
    if (propertiesBuildable != null) {
        if (propertiesBuildable[0].userid == userId()) {
            ELEMENTS.buildModalButton.disabled = false;
            //console.log(propertiesBuildable);
            let nbOfBuildable = propertiesBuildable.length;
            let buildModal = $('#buildModal');
            let propList = $("#propertiesBuildableList");


            buildModal.find("#propertiesBuildableList").html(" ");
            $("#buildActionButton").prop('disabled', true);
            for (var j = 0; j < nbOfBuildable; j++) {
                let nbOfHousesAutorized = 5 - propertiesBuildable[j].numberOfBuildings;

                propList.append(' <label class="btn btn-primary but' + propertiesBuildable[j].property_group_ +
                    '" id="buildI' + propertiesBuildable[j].board_position + '" houses="' + nbOfHousesAutorized + '"><input type="radio" name="options" value="' + propertiesBuildable[j].board_position + '" id="buildId' + propertiesBuildable[j].board_position + '"> ' + propertiesBuildable[j].name + ' ($' + propertiesBuildable[j].house_cost + ')</label>');

                let propertyButton = document.querySelector("#buildI" + propertiesBuildable[j].board_position);
                propertyButton.addEventListener('click', displayHouses);
            }
        }
        else ELEMENTS.buildModalButton.disabled = true;
    }
    else ELEMENTS.buildModalButton.disabled = true;


    if (status == false) {
        ELEMENTS.rollDice.disabled = true;
        ELEMENTS.finishTurn.disabled = true;
        ELEMENTS.buildModalButton.disabled = true;
    }
};

module.exports = initGame;
