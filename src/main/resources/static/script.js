var input = document.getElementById("mainInput");

input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    processInput();
  }
});

function processInput() {
    alert(document.getElementById("mainInput").value);
}