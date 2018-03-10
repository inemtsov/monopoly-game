const socket = io();

const MOVE = "move";
const ROLL_DICE = "roll-dice";
const LOG = "log";

let $logContainer = $('.log-container');
$logContainer[0].scrollTop = $logContainer[0].scrollHeight;

$('#exampleModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget);
    let recipient = button.data('whatever');
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    let modal = $(this);
    modal.find('.modal-title').text('Properties of ' + recipient);
    modal.find('.modal-body input').val(recipient)
});

$(function () {
    $('#rollDice').submit(function () {
        socket.emit('roll-dice', 1);
        return false;
    });
});

socket.on(ROLL_DICE, (data) => {
    //console.log("dice result: " + data);
    $('#diceResult').html(data[0] + " / " + data[1]);
});

socket.on(LOG, (data) => {
    $('.log-container').append(data + "<br/>");
    updateLogScroll()
});

socket.on(MOVE, (positions) => {
    let previousDivId = "#" + positions[0] + " .hallway";
    let newDivId = "#" + positions[1] + " .hallway";
    $(previousDivId).html(" ");
    $(newDivId).html("<b style=\" border-radius: 100%; border: solid 16px yellow;\"></b>");
});


function updateLogScroll() {
    $logContainer[0].scrollTop = $logContainer[0].scrollHeight;
}