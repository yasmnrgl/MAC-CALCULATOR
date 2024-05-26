"use strict";
let runningTotal = 0; 
let buffer = 0;
let textBuffer = "0";
let bufferLoaded = false; 
let currentKey;
let lastKey;
let previousOperator;

const calc = document.querySelector(".calculator");
const screen = document.querySelector(".display");

function handleButtonClick(value) {

  if (isNaN(+value)) {
    handleSymbol(value);
  } else {

    handleNumber(value);
  }
  rerender();
}

function handleNumber(value) {

  if (!bufferLoaded) {
    lastKey === "," ? (buffer = value / 10) : (buffer = value);
    bufferLoaded = true;

    if (textBuffer !== "0" && textBuffer !== "Not a number") {

      textBuffer += value;
    } else {
      lastKey === "," ? (textBuffer = "0," + value) : (textBuffer = value);
    }
  } else {
    if (lastKey !== ",") {

      if (
        parseFloat(textBuffer.toString().replace(",", ".")) &&
        lastKey !== "=" &&
        lastKey !== ","
      ) {
        
        textBuffer += value;
        buffer += value;
      } else {
        
        if (textBuffer === "0,0") {
          textBuffer += value;
          buffer = "0.0" + value;
        } else {
          textBuffer = value;
          buffer = value;
        }
      }
    } else {
      
      textBuffer += value;
      buffer = parseFloat((buffer + value) / 10).toFixed(1);
    }
  }
}

function handleSymbol(value) {
  switch (value) {
    case "AC": 
      buffer = 0;
      textBuffer = "0";
      bufferLoaded = false;
      runningTotal = 0;
      break;
    case "=":
      if (!previousOperator) {
        return;
      }
      flushOperation(parseFloat(buffer));

      previousOperator = null;

      buffer = +runningTotal;

      if (buffer === Infinity || isNaN(buffer)) {
        textBuffer = "Not a number";
        bufferLoaded = false;
        buffer = 0;
      } else {
        
        buffer = +parseFloat(buffer).toFixed(2);
        textBuffer = buffer.toString().replace(".", ",");
      }

      runningTotal = 0;
      break;
    case ",":
      handleDecimal();
      break;
    case "÷":
    case "x":
    case "+":
    case "–":
      handleMath(value);
      break;
  }
}

function handleDecimal() {

  if (lastKey !== "=") {

    if (!(parseFloat(buffer) - Math.floor(parseFloat(buffer)))) {
      switch (lastKey) {
        case "÷":
        case "x":
        case "+":
        case "–":
          textBuffer += "0,";
          break;
        default:
          textBuffer += ",";
          break;
      }
    }
  } else {

    textBuffer = "0,";
    buffer = 0;
    bufferLoaded = false;
    runningTotal = 0;
  }
}

function handleMath(value) {
  
  if (!bufferLoaded) {
    return;
  }

  const intBuffer = parseFloat(buffer);

  if (parseFloat(runningTotal) === 0) {
    runningTotal = intBuffer;
  } else {
    flushOperation(intBuffer);
  }

  previousOperator = value;
  value === "–" ? (textBuffer += "-") : (textBuffer += value);
  bufferLoaded = false;
}

function flushOperation(intBuffer) {
  if (previousOperator === "+") {
    runningTotal += intBuffer;
  } else if (previousOperator === "–") {
    runningTotal -= intBuffer;
  } else if (previousOperator === "x") {
    runningTotal *= intBuffer;
  } else if (previousOperator === "÷") {
    runningTotal /= intBuffer;
  } else {
    alert("ERREUR OPERATION INVALIDE.");
  }
}

function rerender() {
  screen.innerText = textBuffer;
}

const button = document
  .querySelector(".calculator")
  .addEventListener("click", function (event) {
    if (!event.target.classList.contains("calculator")) {
      lastKey = currentKey;
      currentKey = event.target.innerText;
      handleButtonClick(event.target.innerText);
    }
  });
