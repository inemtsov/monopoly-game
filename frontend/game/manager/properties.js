const gameId = require("./gameId");
const userId = require("./userId");
const ELEMENTS = require("./elements");


/*$("#exampleModal").on("show.bs.modal", function (event) {
    let button = $(event.relatedTarget);
    let recipient = button.data("whatever");
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    let modal = $(this);
    modal.find(".modal-title").text("Properties of " + recipient);
    modal.find(".modal-body input").val(recipient);
});*/


const properties = ({userid, ownerUsername, propertiesList}) => {
    //$('#buyModal')
    if (userid == userId()) {
        //console.log(propertiesList);
        let propertiesModal = $('#propertiesModal');
        let len = propertiesList.length;
        propertiesModal.modal('show');
        propertiesModal.find(".modal-title").text("Properties of " + ownerUsername.username);
        propertiesModal.find(".propertyTable").html(" ");
        $(".propertyTable").css('background-color', 'white');
        for (var i = 0; i < len; i++) {
            propertiesModal.find(".group" + propertiesList[i].property_group_).append('<div class="propertyCell">' + propertiesList[i].name + '</br> (' + propertiesList[i].numberOfBuildings + ' houses)</div>');
            if (propertiesList[i].setOwned == 1) {
                $(".group" + propertiesList[i].property_group_).css('background-color', 'LightGreen');
            }
            else {
                $(".group" + propertiesList[i].property_group_).css('background-color', 'white');
            }
        }
    }
};

module.exports = properties;
