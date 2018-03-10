const GameManager = require("./manager");
GameManager.init();
GameManager.updateLogScroll();

$("#id_of_textbox").keypress(event => {
    if (event.keyCode === 13) {
        $('#chat-area button').trigger('click');
    }
});

//$("#buildModalButton").bind('click', wantToBuild());

$("#propertyModal").on("show.bs.modal", function (event) {
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    let modal = $(this);
    //modal.find(".modal-title").text("ID: " + modal.find(".id").val);
    modal.find(".modal-body input").val(recipient);
});

$(".col").click(function (event) {
    var prop = $("#properties" + this.id);
    var fields = prop.val().split(",");
    $("#propertyModal").find(".modal-title").text(fields[0]);
    if (fields[10] === "1") {// then it's a property
        //$("#propertyModal").find(".modal-content").css("border-top-width", "25px");
        if ($("#" + this.id).css('border-top-color') != "rgb(0, 0, 0)")
            $("#propertyModal").find(".modal-header").css("background-color", $("#" + this.id).css('border-top-color'));
        $("#propertyModal").find(".container-fluid").text(" ");
        //$("#propertyModal").find(".container-fluid").append(createRow("Cost to buy: $", fields[1]));
        //$("#propertyModal").find(".container-fluid").append(createRow("Rent: $", fields[2]));
        $("#propertyModal").find(".container-fluid").append(createRow("Rent with color set: $", fields[3]));
        $("#propertyModal").find(".container-fluid").append(createRowHouse("With 1 House ", fields[4]));
        $("#propertyModal").find(".container-fluid").append(createRowHouse("With 2 Houses ", fields[5]));
        $("#propertyModal").find(".container-fluid").append(createRowHouse("With 3 Houses ", fields[6]));
        $("#propertyModal").find(".container-fluid").append(createRowHouse("With 4 Houses ", fields[7]));
        $("#propertyModal").find(".container-fluid").append(createRow("With Hotel $", fields[8]));
        $("#propertyModal").find(".container-fluid").append(createRow("House costs $", fields[9]));
        $("#propertyModal").find(".container-fluid").append("<div class='rowProperty'>If a player owns ALL the lots of any Color-Group, the rent is Doubled on Unimproved Lots in that group");
    }
    else {
        $("#propertyModal").find(".modal-header").css("background-color", "grey");
        $("#propertyModal").find(".container-fluid").text(" ");
    }
    $("#propertyModal").modal("show");
});

function createRow(text, item) {
    return "<div class='rowProperty'>" + text + item + "</div>";
}

function createRowHouse(text, item) {
    return "<div class='rowHouse'>" + text + "<div class='rent'>$" + item + "</div></div>";
}