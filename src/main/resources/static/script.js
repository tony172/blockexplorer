var BTCtoUSD;
var usdMarketCap;
var usd24Vol;
var usd24Change;

window.addEventListener('DOMContentLoaded', (event) => {
  var input = document.getElementById("mainInput");
  input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      processInput();
    }
  });

  var rootContainer = document.createElement("div");
  rootContainer.id = "rootContainer";
  rootContainer.classList.add("container");
  document.body.appendChild(rootContainer);

  $.get( "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true",
    function( data ) {
      BTCtoUSD = data["bitcoin"]["usd"];
      usdMarketCap = data["bitcoin"]["usd_market_cap"];
      usd24Vol = data["bitcoin"]["usd_24h_vol"];
      usd24Change = data["bitcoin"]["usd_24h_change"];
      document.getElementById("marketCap").innerHTML += " $" + parseFloat(usdMarketCap).toFixed(2);
      document.getElementById("vol").innerHTML += " $" + parseFloat(usd24Vol).toFixed(2);
      document.getElementById("change").innerHTML += " " + parseFloat(usd24Change).toFixed(2) + " %";
      $.get( "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd",
      function( data ) {
        BTCtoUSD *= data["tether"]["usd"];
        document.getElementById("currentPrice").innerHTML += " $" + BTCtoUSD.toFixed(2);
      });
    });
    draw30DaysPriceHistory();
    $.post("/latest10Blocks",
    function(data, status) {
      print10LatestBlocks(data);
      $.post("/latest10Transactions",
      function(data, status) {
      print10LatestTransactions(data);
      document.getElementById("loading").style.visibility = 'hidden';
    });
    });
});

function processInput() {
    var value = document.getElementById("mainInput").value;

    document.getElementById("loading").style.visibility = 'visible';
    $.post("/process",
    {value: value},
    function(data, status) {
      var input = document.getElementById("mainInput");
      input.style.borderColor = "grey";
      input.style.borderWidth = "1px";
      if (data.status == "none") {
        input.style.borderColor = "red";
        input.style.borderWidth = "2px";
        document.getElementById("loading").style.visibility = 'hidden';
        return;
      }
      clearScreen();
      if (data.status == "tx") {
        printTxInfo(data);
        printTxInputs(data);
        printTxOutputs(data);
      }
      if (data.status == "block") {
        printBlockInfo(data);
      }
      document.getElementById("loading").style.visibility = 'hidden';
      });
}

function printTxInfo(data) {
  var rootContainer = document.getElementById("rootContainer");

  var details = document.createElement("a");
  details.innerHTML = "<b> Transaction details</b>"
  details.style.fontSize = "25px";
  details.style.marginTop = "30px";
  var mainContainer = document.createElement("div");
  mainContainer.id = "txInfoContainer";
  mainContainer.classList.add("container");

  var row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  var col1 = document.createElement("div");
  col1.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = "Hash";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.txInfo.txId;
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Status";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  if (data.txInfo.confirmations > 0) {
    txt.innerText = "Confirmed";
    txt.style.color = "green";
  }
  else {
    txt.innerText = "Unconfirmed";
    txt.style.color = "red";
  }
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Time";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.txInfo.time;
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Size";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.txInfo.size + " bytes";
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Included in block";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.txInfo.blockHeight;
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Confirmations";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.txInfo.confirmations;
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Total Input";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  var totalInputs = 0;
  for (var i = 0; i < data.txInfo.inputs.length; i++) {
    totalInputs += data.txInfo.inputs[i].value;
  }
  txt.innerText = totalInputs + " BTC";
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Total Output";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  var totalOutputs = 0;
  for (var i = 0; i < data.txInfo.outputs.length; i++) {
    totalOutputs += data.txInfo.outputs[i].value;
  }
  txt.innerText = totalOutputs + " BTC";
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Fees";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  var fees = 0;
  if (totalInputs - totalOutputs > 0)
    fees = totalInputs - totalOutputs;
  txt.innerText = fees + " BTC";
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);


  rootContainer.appendChild(details);
  rootContainer.appendChild(mainContainer);
}

function printTxInputs(data) {
  var rootContainer = document.getElementById("rootContainer");
  var inputs = document.createElement("a");
  inputs.innerHTML = "<b> Inputs</b>"
  inputs.style.fontSize = "25px";
  inputs.style.paddingTop = "30px";
  rootContainer.appendChild(inputs);

  for (var i = 0; i < data.txInfo.inputs.length; i++) {
    var mainContainer = document.createElement("div");
    mainContainer.classList.add("container", "border-bottom");

    var row = document.createElement("div");
    row.classList.add("row", "mt-2", "pb-2");

    var col1 = document.createElement("div");
    col1.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = "Index";
    col1.appendChild(txt);

    var col2 = document.createElement("div");
    col2.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = i;
    col2.appendChild(txt);

    row.appendChild(col1);
    row.appendChild(col2);
    mainContainer.appendChild(row);

    var row = document.createElement("div");
    row.classList.add("row", "mt-2", "pb-2");

    var col1 = document.createElement("div");
    col1.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = "Address";
    col1.appendChild(txt);

    var col2 = document.createElement("div");
    col2.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = data.txInfo.inputs[i].addresses[0];
    col2.appendChild(txt);

    row.appendChild(col1);
    row.appendChild(col2);
    mainContainer.appendChild(row);

    var row = document.createElement("div");
    row.classList.add("row", "mt-2", "pb-2");

    var col1 = document.createElement("div");
    col1.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = "ScriptPubKey";
    col1.appendChild(txt);

    var col2 = document.createElement("div");
    col2.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = data.txInfo.inputs[i].scriptPubKey;
    col2.appendChild(txt);

    row.appendChild(col1);
    row.appendChild(col2);
    mainContainer.appendChild(row);

    var row = document.createElement("div");
    row.classList.add("row", "mt-2", "pb-2");

    var col1 = document.createElement("div");
    col1.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = "Value";
    col1.appendChild(txt);

    var col2 = document.createElement("div");
    col2.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = data.txInfo.inputs[i].value + " BTC";
    col2.appendChild(txt);

    row.appendChild(col1);
    row.appendChild(col2);
    mainContainer.appendChild(row);
    rootContainer.appendChild(mainContainer);
  }
}

function printTxOutputs(data) {
  var rootContainer = document.getElementById("rootContainer");
  var outputs = document.createElement("a");
  outputs.innerHTML = "<b> Outputs</b>"
  outputs.style.fontSize = "25px";
  outputs.style.paddingTop = "30px";
  rootContainer.appendChild(outputs);

  for (var i = 0; i < data.txInfo.outputs.length; i++) {
    var mainContainer = document.createElement("div");
    mainContainer.classList.add("container", "border-bottom");

    var row = document.createElement("div");
    row.classList.add("row", "mt-2", "pb-2");

    var col1 = document.createElement("div");
    col1.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = "Index";
    col1.appendChild(txt);

    var col2 = document.createElement("div");
    col2.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = i;
    col2.appendChild(txt);

    row.appendChild(col1);
    row.appendChild(col2);
    mainContainer.appendChild(row);

    var row = document.createElement("div");
    row.classList.add("row", "mt-2", "pb-2");

    var col1 = document.createElement("div");
    col1.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = "Address";
    col1.appendChild(txt);

    var col2 = document.createElement("div");
    col2.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = data.txInfo.outputs[i].addresses[0];
    col2.appendChild(txt);

    row.appendChild(col1);
    row.appendChild(col2);
    mainContainer.appendChild(row);

    var row = document.createElement("div");
    row.classList.add("row", "mt-2", "pb-2");

    var col1 = document.createElement("div");
    col1.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = "ScriptPubKey";
    col1.appendChild(txt);

    var col2 = document.createElement("div");
    col2.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = data.txInfo.outputs[i].scriptPubKey;
    col2.appendChild(txt);

    row.appendChild(col1);
    row.appendChild(col2);
    mainContainer.appendChild(row);

    var row = document.createElement("div");
    row.classList.add("row", "mt-2", "pb-2");

    var col1 = document.createElement("div");
    col1.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = "Details";
    col1.appendChild(txt);

    var col2 = document.createElement("div");
    col2.classList.add("col");
    var txt = document.createElement("a");
    if (data.txInfo.outputs[i].spent) {
      txt.innerText = "Spent";
      txt.style.color = "green";
    } else {
      txt.innerText = "Unspent";
      txt.style.color = "red";
    }
    col2.appendChild(txt);

    row.appendChild(col1);
    row.appendChild(col2);
    mainContainer.appendChild(row);

    var row = document.createElement("div");
    row.classList.add("row", "mt-2", "pb-2");

    var col1 = document.createElement("div");
    col1.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = "Value";
    col1.appendChild(txt);

    var col2 = document.createElement("div");
    col2.classList.add("col");
    var txt = document.createElement("a");
    txt.innerText = data.txInfo.outputs[i].value + " BTC";
    col2.appendChild(txt);

    row.appendChild(col1);
    row.appendChild(col2);
    mainContainer.appendChild(row);

    rootContainer.appendChild(mainContainer);
  }
}

function draw30DaysPriceHistory() {
  var prices = [];
  var dates = [];
  $.get("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily", function( data ) {
        rawData = data["prices"];
        for (var i = 0; i < rawData.length; i++) {
          var tmp = ("" + rawData[i]).split(",");
          var date = new Date(parseInt(tmp[0]));
          var day = date.getDate();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          var formattedTime = day + '/' + month + '/' + year;
          dates.push(formattedTime);
          prices.push(parseFloat(tmp[1]).toFixed(2));
        }
  
      var mainContainer = document.getElementById("mainContainer");
      var row = document.createElement("div");
      row.classList.add("row");
      row.id = "chartRow";
      var col1 = document.createElement("div");
      col1.classList.add("col");
      var col2 = document.createElement("div");
      col2.classList.add("col-10");
      var col3 = document.createElement("div");
      col3.classList.add("col");
      var chartContainer = document.createElement("div");
      chartContainer.classList.add("chart-container");
      chartContainer.style.height = "500px";
      var canvas = document.createElement("canvas");
      canvas.id = "myChart";

      chartContainer.appendChild(canvas);
      col2.appendChild(chartContainer);
      row.appendChild(col1);
      row.appendChild(col2);
      row.appendChild(col3);
      mainContainer.appendChild(row);

      var ctx = document.getElementById('myChart').getContext('2d');
      var chart = new Chart(ctx, {
      type: 'line',
  
      data: {
          labels: dates,
          datasets: [{
              label: 'Bitcoin 30 day price history',
              fill: false,
              backgroundColor: 'blue',
              borderColor: 'blue',
              data: prices
          }]
      },
  
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
              type: 'timeseries',
          }
      }
    }
    });
  });
}

function clearScreen() {
  var root = document.getElementById("rootContainer");
  if (root)
    root.remove();

  var chart = document.getElementById("chartRow");
  if (chart)
    chart.remove();

  var rootContainer = document.createElement("div");
  rootContainer.id = "rootContainer";
  rootContainer.classList.add("container");
  document.body.appendChild(rootContainer);
}

function print10LatestBlocks(data) {
  var rootContainer = document.getElementById("rootContainer");
  var blocks = document.createElement("a");
  blocks.innerHTML = "<b> Latest 10 blocks</b>"
  blocks.style.fontSize = "25px";
  blocks.style.paddingTop = "30px";
  var header = document.createElement("div");
  header.classList.add("row");
  var col = document.createElement("div");
  col.classList.add("col");
  col.appendChild(blocks);
  header.appendChild(col);
  var col = document.createElement("div");
  col.classList.add("col");
  col.id = "latestRightHeader";
  header.appendChild(col);
  rootContainer.appendChild(header);

  var mainRow = document.createElement("div");
  mainRow.classList.add("row");
  mainRow.id = "latestRow";
  var leftCol = document.createElement("div");
  leftCol.classList.add("col", "border-right");
  var rightCol = document.createElement("div");
  rightCol.classList.add("col");
  rightCol.id = "latestRightCol";
  var row = document.createElement("div");
  row.classList.add("row");
  var col = document.createElement("div");
  col.classList.add("col");
  col.innerText = "Height";
  row.appendChild(col);
  var col = document.createElement("div");
  col.classList.add("col");
  col.innerText = "Mined";
  row.appendChild(col);
  var col = document.createElement("div");
  col.classList.add("col");
  col.innerText = "Size";
  row.appendChild(col);
  leftCol.appendChild(row);

  for (var i = 0; i < data.length; i++) {
    var row = document.createElement("div");
    row.classList.add("row");
    var col = document.createElement("div");
    col.classList.add("col");
    col.innerHTML = '<a href="#" onclick=showBlock(innerText)>' + data[i].height + '</a>';
    row.appendChild(col);
    var col = document.createElement("div");
    col.classList.add("col");
    col.innerText = data[i].time;
    row.appendChild(col);
    var col = document.createElement("div");
    col.classList.add("col");
    col.innerText = data[i].size + " bytes";
    row.appendChild(col);
    leftCol.appendChild(row);
  }

  mainRow.appendChild(leftCol);
  mainRow.appendChild(rightCol);
  rootContainer.appendChild(mainRow);
}

function print10LatestTransactions(data) {
  var blocks = document.createElement("a");
  blocks.innerHTML = "<b> Latest 10 transactions</b>"
  blocks.style.fontSize = "25px";
  blocks.style.paddingTop = "30px";
  document.getElementById("latestRightHeader").appendChild(blocks);
  var rightCol = document.getElementById("latestRightCol");
  var row = document.createElement("div");
  row.classList.add("row");
  var col = document.createElement("div");
  col.classList.add("col");
  col.innerText = "Hash";
  row.appendChild(col);
  var col = document.createElement("div");
  col.classList.add("col");
  col.innerText = "Amount (BTC)";
  row.appendChild(col);
  var col = document.createElement("div");
  col.classList.add("col");
  col.innerText = "Amount (USD)";
  row.appendChild(col);
  rightCol.appendChild(row);

  for (var i = 0; i < data.length; i++) {
    var row = document.createElement("div");
    row.classList.add("row");
    var col = document.createElement("div");
    col.classList.add("col", "text-truncate");
    col.innerHTML = '<a href="#" onclick=showTransaction(innerText)>' + data[i].txId + '</a>';
    row.appendChild(col);
    var col = document.createElement("div");
    col.classList.add("col");
    col.innerText = (data[i].amount).toFixed(8) + " BTC";
    row.appendChild(col);
    var col = document.createElement("div");
    col.classList.add("col");
    col.innerText = "$ " + (data[i].amount * BTCtoUSD).toFixed(2);
    row.appendChild(col);
    rightCol.appendChild(row);
  }
}

function showTransaction(txId) {
  document.getElementById("loading").style.visibility = 'visible';
  $.post("/process",
    {value: txId},
    function(data, status){
      clearScreen();
      if (data.status == "tx") {
        printTxInfo(data);
        printTxInputs(data);
        printTxOutputs(data);
      }
      document.getElementById("loading").style.visibility = 'hidden';
    });
}

function showBlock(blockHash) {
  document.getElementById("loading").style.visibility = 'visible';
  $.post("/process",
    {value: blockHash},
    function(data, status){
      clearScreen();
      if (data.status == "block") {
        printBlockInfo(data);
      }
      document.getElementById("loading").style.visibility = 'hidden';
    });
}

function showMain() {
  document.getElementById("loading").style.visibility = 'visible';
  clearScreen();
  $.get( "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true",
  function( data ) {
    BTCtoUSD = data["bitcoin"]["usd"];
    usdMarketCap = data["bitcoin"]["usd_market_cap"];
    usd24Vol = data["bitcoin"]["usd_24h_vol"];
    usd24Change = data["bitcoin"]["usd_24h_change"];
    document.getElementById("marketCap").innerHTML = "<b>Market Cap: </b> $" + parseFloat(usdMarketCap).toFixed(2);
    document.getElementById("vol").innerHTML = "<b>24h Volume: </b> $" + parseFloat(usd24Vol).toFixed(2);
    document.getElementById("change").innerHTML = "<b>24h Change: </b> " + parseFloat(usd24Change).toFixed(2) + " %";
    $.get( "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd",
    function( data ) {
      BTCtoUSD *= data["tether"]["usd"];
      document.getElementById("currentPrice").innerHTML = "<b>Current price: </b> $" + BTCtoUSD.toFixed(2);
    });
  });
  draw30DaysPriceHistory();
  $.post("/latest10Blocks",
  function(data, status) {
    print10LatestBlocks(data);
    $.post("/latest10Transactions",
    function(data, status) {
    print10LatestTransactions(data);
    document.getElementById("loading").style.visibility = 'hidden';
  });
  });
}

function printBlockInfo(data) {
  var rootContainer = document.getElementById("rootContainer");

  var details = document.createElement("a");
  details.innerHTML = "<b> Block details</b>"
  details.style.fontSize = "25px";
  details.style.marginTop = "30px";
  var mainContainer = document.createElement("div");
  mainContainer.id = "blInfoContainer";
  mainContainer.classList.add("container");

  var row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  var col1 = document.createElement("div");
  col1.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = "Hash";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.blockInfo.hash;
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Height";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.blockInfo.height;
  
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Time";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.blockInfo.fullTime;
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Size";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.blockInfo.size + " bytes";
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Confirmations";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.blockInfo.confirmations;
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Difficulty";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.blockInfo.difficulty;
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Merkle root";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.blockInfo.merkleRoot;
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Nonce";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.blockInfo.nonce;
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Total transactions";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.blockInfo.txIds.length;
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);
  rootContainer.appendChild(details);
  rootContainer.appendChild(mainContainer);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Total amount";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.blockInfo.amount + " BTC";
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);

  row = document.createElement("div");
  row.classList.add("row", "mt-2", "border-bottom", "pb-2");

  col1 = document.createElement("div");
  col1.classList.add("col");
  txt = document.createElement("a");
  txt.innerText = "Total fee";
  col1.appendChild(txt);

  var col2 = document.createElement("div");
  col2.classList.add("col");
  var txt = document.createElement("a");
  txt.innerText = data.blockInfo.fee + " BTC";
  col2.appendChild(txt);

  row.appendChild(col1);
  row.appendChild(col2);
  mainContainer.appendChild(row);
  rootContainer.appendChild(details);
  rootContainer.appendChild(mainContainer);

  var rootContainer = document.getElementById("rootContainer");
  var inputs = document.createElement("a");
  inputs.innerHTML = "<b> Transactions</b>"
  inputs.style.fontSize = "25px";
  inputs.style.paddingTop = "30px";
  rootContainer.appendChild(inputs);

  for (var i = 0; i < data.blockInfo.txIds.length; i++) {
    var mainContainer = document.createElement("div");
    mainContainer.classList.add("container", "border-bottom");

    var row = document.createElement("div");
    row.classList.add("row", "mt-2", "pb-2");

    var col1 = document.createElement("div");
    col1.classList.add("col");
    var txt = document.createElement("a");
    txt.innerHTML = '<a href="#" onclick=showTransaction(innerText)>' + data.blockInfo.txIds[i] + '</a>';
    col1.appendChild(txt);

    
    row.appendChild(col1);
    mainContainer.appendChild(row);
    mainContainer.appendChild(row);
    rootContainer.appendChild(mainContainer);
  }
}
