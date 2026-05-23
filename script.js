const expressionDiv = document.getElementById('expression');
const previewDiv = document.getElementById('preview');
let currentExpression = '';
let isResultShown = false;

// Percentage logic: 200+10% = 220
function evaluateExpression(expr) {
  // 200+10% → 200 + (200*10/100) = 220
  expr = expr.replace(/(\d+\.?\d*)\s*\+\s*(\d+\.?\d*)%/g, (match, num1, perc) => {
    return `${num1} + (${num1} * ${perc} / 100)`;
  });
  // 200-10% → 200 - (200*10/100) = 180
  expr = expr.replace(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)%/g, (match, num1, perc) => {
    return `${num1} - (${num1} * ${perc} / 100)`;
  });
  // 200×10% → 200 * 0.1 = 20
  expr = expr.replace(/(\d+\.?\d*)%/g, '($1/100)');
  
  expr = expr.replace(/×/g, '*').replace(/÷/g, '/');
  return Function('"use strict";return (' + expr + ')')();
}

function updateDisplay() {
  // Chung: Expression reng
  expressionDiv.textContent = currentExpression || '0';
  
  // Hnuai: Preview, = hmeh hma chuan grey
  if (currentExpression && !isResultShown) {
    try {
      let result = evaluateExpression(currentExpression);
      if (isFinite(result)) {
        previewDiv.textContent = result;
        previewDiv.classList.remove('result'); // Grey
      } else {
        previewDiv.textContent = '';
      }
    } catch {
      previewDiv.textContent = '';
    }
  } else if (!currentExpression) {
    previewDiv.textContent = '';
  }
}

function appendNumber(num) {
  if (isResultShown) {
    currentExpression = '';
    isResultShown = false;
    previewDiv.classList.remove('result');
  }
  if (currentExpression === '0' && num !== '.') {
    currentExpression = num;
  } else {
    currentExpression += num;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (isResultShown) {
    isResultShown = false;
    previewDiv.classList.remove('result');
  }
  if (currentExpression === '' && op !== '-') return;
  const lastChar = currentExpression.slice(-1);
  if ('+−×÷-*/%'.includes(lastChar)) {
    currentExpression = currentExpression.slice(0, -1) + op;
  } else {
    currentExpression += op;
  }
  updateDisplay();
}

function calculate() {
  if (!currentExpression) return;
  try {
    let result = evaluateExpression(currentExpression);
    
    if (!isFinite(result)) {
      previewDiv.textContent = 'Error';
      return;
    }
    
    // Chung: 5+5 A LA AWM RENG
    expressionDiv.textContent = currentExpression;
    
    // Hnuai: 10, TUNAH CHUAN VAR VE TA, TE RENG
    previewDiv.textContent = result;
    previewDiv.classList.add('result'); // White
    
    currentExpression = result.toString();
    isResultShown = true;
  } catch {
    previewDiv.textContent = 'Error';
  }
}

function clearAll() {
  currentExpression = '';
  isResultShown = false;
  expressionDiv.textContent = '0';
  previewDiv.textContent = '';
  previewDiv.classList.remove('result');
}

function deleteLast() {
  if (isResultShown) {
    clearAll();
    return;
  }
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

clearAll();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}