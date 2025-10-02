/* Toggle between calculator and simulator */
document.getElementById('showCalculator').addEventListener('click', () => {
    document.getElementById('calculatorSection').classList.add('active');
    document.getElementById('calculatorSection2').classList.remove('active');
    document.getElementById('simulatorSection').classList.remove('active');
    document.getElementById('showCalculator').classList.add('active');
    document.getElementById('showSimulator').classList.remove('active');
    document.getElementById('showCalculator2').classList.remove('active');
});
document.getElementById('showSimulator').addEventListener('click', () => {
    document.getElementById('simulatorSection').classList.add('active');
    document.getElementById('calculatorSection').classList.remove('active');
    document.getElementById('calculatorSection2').classList.remove('active');
    document.getElementById('showSimulator').classList.add('active');
    document.getElementById('showCalculator').classList.remove('active');
    document.getElementById('showCalculator2').classList.remove('active');
});

document.getElementById('showCalculator2').addEventListener('click', () => {
  document.getElementById('calculatorSection2').classList.add('active');
  document.getElementById('calculatorSection').classList.remove('active');
  document.getElementById('simulatorSection').classList.remove('active');
  document.getElementById('showCalculator2').classList.add('active');
  document.getElementById('showCalculator').classList.remove('active');
  document.getElementById('showSimulator').classList.remove('active');
});

/* ==== Your existing Calculator Logic ==== */
["capital", "winrate"].forEach(id => {
    document.getElementById(id).addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            runSimulation();
        }
    });
});

function calculatePosition() {
    const entry = parseFloat(document.getElementById('entry').value);
    const sl = parseFloat(document.getElementById('sl').value);
    const tp = parseFloat(document.getElementById('tp').value);
    const risk = parseFloat(document.getElementById('risk').value);

    if(isNaN(entry) || isNaN(sl) || isNaN(tp) || isNaN(risk)) {
        document.getElementById("calculatorResult").style.display = "none";
        document.getElementById("calculatorError").style.display = "block";
        document.getElementById('error').innerHTML = 'Price input cannot be blank !';
        return;
    }
    else if (entry === sl || entry === tp || sl === tp){
      document.getElementById("calculatorResult").style.display = "none";
      document.getElementById("calculatorError").style.display = "block";
      document.getElementById('error').innerHTML = 'Entry, SL, TP Price has to be different !';
    }
    else if ((entry > sl && entry > tp) || (entry < sl && entry < tp)) {
        document.getElementById("calculatorResult").style.display = "none";
        document.getElementById("calculatorError").style.display = "block";
        document.getElementById('error').innerHTML = 'Take Profit and Stop Loss must be on opposite sides of Entry Price !';
        return;
    }
    else{
      document.getElementById("calculatorResult").style.display = "block";
      document.getElementById("calculatorError").style.display = "none";
    }

    const positionSize = Math.abs(risk / (entry - sl));
    const potentialProfit = positionSize * Math.abs(tp - entry);
    const rr = Math.abs(tp - entry) / Math.abs(entry - sl);
    const pnl = potentialProfit;
;

    document.getElementById('result').innerHTML = `
        <div class="label">Position Size (units)</div>
        <div class="value position">${positionSize.toFixed(6)} </div>
        <div class="label">Profit Target ($)</div>
        <div class="value pnl">$ ${pnl.toFixed(2)}</div>
        <div class="label">Risk-Reward (RR)</div>
        <div class="value rr">${rr.toFixed(2)}</div>
    `;
}
document.getElementById('calculateBtn').addEventListener('click', calculatePosition);
const inputs = ['entry','sl','tp','risk'];
inputs.forEach((id, index) => {
    document.getElementById(id).addEventListener('keydown', function(e){
        if(e.key === "Enter") {
            e.preventDefault();
            if(index < inputs.length - 1) {
                document.getElementById(inputs[index + 1]).focus();
            } else {
                calculatePosition();
            }
        }
    });
});

// Add Size Calcualtion Section:
const inputCurrent = [
  document.getElementById("currentEntry"),
  document.getElementById("currentSize"),
  document.getElementById("newEntry"),
  document.getElementById('lockProfitDropdown')
];

const currentProfit = document.getElementById("currentProfit");
const lockProfit = document.getElementById("lockProfit");

function calculateProfit() {
  const currentEntry = Number(inputCurrent[0].value) || 0;
  const currentSize  = Number(inputCurrent[1].value) || 0;
  const newEntry     = Number(inputCurrent[2].value) || 0;
  const lockprofitShow = Number(inputCurrent[3].value) || 0;

  const profit = Math.abs((newEntry - currentEntry) * currentSize);
  const lockProfitVal = profit * lockprofitShow /100;

  // ✅ put result into the input box
  currentProfit.value = profit.toFixed(2);
  lockProfit.value = lockProfitVal.toFixed(2);
  
}

inputCurrent.forEach(input => {
  input.addEventListener("input", () => {
    if (inputCurrent.every(i => i.value.trim() !== "")) {
      calculateProfit();
    }
  });
});

function calculatePosition2() {
  const currentEntry = parseFloat(document.getElementById('currentEntry').value);
  const currentSize = parseFloat(document.getElementById('currentSize').value);

  const newEntry = parseFloat(document.getElementById('newEntry').value);
  const newSL = parseFloat(document.getElementById('newSL').value);
  const newTP = parseFloat(document.getElementById('newTP').value);
  const lockProfit = parseFloat(document.getElementById('lockProfitDropdown').value) * (currentProfit.value / 100);

  if (isNaN(currentEntry) || isNaN(currentSize) || isNaN(newEntry) || isNaN(newSL) || isNaN(newTP)) {
    document.getElementById("calculatorResult2").style.display = "none";
    document.getElementById("calculatorError2").style.display = "block";
    document.getElementById("error2").innerText = "Price input cannot be blank ! !";
    return;
  } else if (newEntry === newSL || newEntry === newTP || newSL === newTP) {
    document.getElementById("calculatorResult2").style.display = "none";
    document.getElementById("calculatorError2").style.display = "block";
    document.getElementById("error2").innerText = "New SL cannot equal New Entry !";
    return;
  } else {
    document.getElementById("calculatorResult2").style.display = "block";
    document.getElementById("calculatorError2").style.display = "none";
  }

  // Calculate new additon size
  var newSize = 0;
  if (newEntry > currentEntry) { //long scenario
    newSize = ((newSL - currentEntry) * currentSize - lockProfit) / (newEntry - newSL);
  } else { //short scenario
    newSize = ((currentEntry - newSL) * currentSize - lockProfit) / (newSL - newEntry);
  }

  //newSize is negative means that you cannot add for your desire price at this point !
  if(newSize <= 0){
    document.getElementById("calculatorResult2").style.display = "none";
    document.getElementById("calculatorError2").style.display = "block";
    document.getElementById("error2").innerText = "Desired SL and locked profit are not achievable at this point !";
    return;
  }

  // total size
  const totalSize = currentSize + newSize ;

  // New average entry
  const overallEntry = (currentEntry * currentSize + newEntry * newSize) / (totalSize);

  // New Profit if new TP hit
  const newProfit = Math.abs(newTP - overallEntry) * totalSize;


  document.getElementById('result2').innerHTML = `
        <div class="label">Size to Add</div>
        <div class="value position">${newSize.toFixed(6)} </div>
        <div class="label">New Total Size</div>
        <div class="value pnl">${totalSize.toFixed(6)}</div>
        <div class="label">Overall Entry Price ($)</div>
        <div class="value pnl">$ ${overallEntry.toFixed(2)}</div>
        <div class="label">Target Profit ($)</div>
        <div class="value pnl">$ ${newProfit.toFixed(6)} </div>
    `;
}

document.getElementById('calculateBtn2').addEventListener('click', calculatePosition2);
const inputs2 = ['currentEntry', 'currentSize', 'newEntry', 'newSL', 'newTP'];
inputs2.forEach((id, index) => {
  document.getElementById(id).addEventListener('keydown', function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < inputs2.length - 1) {
        document.getElementById(inputs2[index + 1]).focus();
      } else {
        calculatePosition2();
      }
    }
  });
});

/* ==== Your existing Simulator Logic ==== */
function runSimulation() {
  document.getElementById("simulatorResult").style.display = "block";
  const startCapital = parseFloat(document.getElementById("capital").value);
  const inputWinrate = parseFloat(document.getElementById("winrate").value)/100;
  const commissionPercent = parseFloat(document.getElementById("commissionPercent").value);

  if (
    isNaN(startCapital) || startCapital <= 0 ||
    isNaN(inputWinrate) || inputWinrate < 0 || inputWinrate > 1 ||
    isNaN(commissionPercent) || commissionPercent < 0 || commissionPercent > 10
  ) {
    alert("Please enter valid input values.");
    return;
  }

  const days = 365;
  const tradesPerDay = 3;
  const rr = document.getElementById("riskreward").value;
  const dailyGrowth = 1.02;
  const riskPercent = 0.01;

  let capital = startCapital;
  let targetCapitals = [startCapital];
  for (let i = 1; i < days; i++) {
    targetCapitals.push(targetCapitals[i - 1] * dailyGrowth);
  }

  let winningDaysCount = 0;
  let equityCurve = [];

  let html =
    "<table><tr><th>Day</th><th>Target</th><th>Bucket Base</th><th>Risk %</th><th>Risk $</th><th>Trades</th><th>Daily RR</th><th>Daily P/L</th><th>Commission</th><th>Final Capital</th><th>Target Met</th></tr>";

  for (let day = 0; day < days; day++) {
    const target = targetCapitals[day];
    const baseRiskCapital = Math.floor(capital / 100) * 100;
    const risk = baseRiskCapital * riskPercent;

    let trades = [];
    let profit = 0;
    let rrTotal = 0;

    const commissionPerTrade = risk * (commissionPercent / 100);
    const totalCommission = commissionPerTrade * tradesPerDay;

    for (let t = 0; t < tradesPerDay; t++) {
      const rnd = Math.random();

      if (rnd < inputWinrate) {
        let tradeProfit = risk * rr;
        if (Math.random() < 0.5) {
          tradeProfit = risk * 1;
          trades.push("+" + tradeProfit.toFixed(2) + " (trail)");
        } else {
          trades.push("+" + tradeProfit.toFixed(2));
        }
        profit += tradeProfit;
        rrTotal += tradeProfit / risk;
      } else if (rnd < inputWinrate + (1 - inputWinrate) / 2) {
        trades.push("0.00");
      } else {
        trades.push("-" + risk.toFixed(2));
        profit -= risk;
        rrTotal -= 1;
      }
    }

    profit -= totalCommission;
    capital += profit;

    if (profit > 0) winningDaysCount++;

    equityCurve.push(capital);

    let rowClass = ((day + 1) % 30 === 0) ? "highlight-row" : "";
    html += `<tr class="${rowClass}">
    <td>${day + 1}</td>
    <td>${target.toFixed(2)}</td>
    <td>$${baseRiskCapital}</td>
    <td>${(riskPercent * 100).toFixed(2)}%</td>
    <td>${risk.toFixed(2)}</td>
    <td>${trades.join(", ")}</td>
    <td>${rrTotal.toFixed(2)}</td>
    <td>${profit.toFixed(2)}</td>
    <td>${totalCommission.toFixed(2)}</td>
    <td>${capital.toFixed(2)}</td>
    <td>${capital >= target ? "✅" : "❌"}</td>
    </tr>`;
  }

  html += "</table>";

  const actualWinrate = (winningDaysCount / days).toFixed(3);

  document.getElementById("results").innerHTML =
    `<p><strong>Win Rate Based on Winning Days:</strong> ${actualWinrate}</p>` + html;

  drawEquityChart(equityCurve);
}

function drawEquityChart(data) {
  const canvas = document.getElementById("equityChart");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (data.length === 0) return;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const padding = 40;

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding / 2);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  ctx.fillStyle = "#333";
  ctx.font = "12px Arial";
  ctx.fillText(minVal.toFixed(2), 5, canvas.height - padding);
  ctx.fillText(maxVal.toFixed(2), 5, padding);

  ctx.strokeStyle = "#4caf50";
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < data.length; i++) {
    let x = padding + ((canvas.width - 2 * padding) * i) / (data.length - 1);
    let y =
      canvas.height - padding -
      ((data[i] - minVal) / (maxVal - minVal || 1)) *
        (canvas.height - 2 * padding);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}