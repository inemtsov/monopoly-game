var slider = document.getElementById("bankroll");
var output = document.getElementById("bankroll-value");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
}
