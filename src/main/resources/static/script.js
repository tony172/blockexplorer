var input = document.getElementById("mainInput");

input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    processInput();
  }
});

function processInput() {
    var value = document.getElementById("mainInput").value;
    $.post("/process",
    {value: value},
    function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
      });
}