import Operator from './operator.js';
import * as math from './math_function.js';

let expression = ''
let x = document.getElementsByClassName("btn")
let textBox = document.getElementById("inputExpression")
let finalAas = document.getElementById("finalAnswer")
let operatorWasUsed = false;
const operatorList = ['÷', '*', '+', '-'];
for (const bt of x) {
    bt.addEventListener("click", evalTheExpression);
}

function specialButton(at) {
    let btText = filter(at)
    switch (btText.trim()) {
        case 'back':
            expression = expression.substring(0, expression.length - 1);
            break;
        default:
            expression += btText.trim();
    }
}

function normalButton(bt) {

    let btText = filter(bt.innerHTML.trim())
    switch (btText.trim()) {
        case 'CE':
            expression = '';
            break;
        default:
            expression += btText.trim()
    }
}

function evalTheExpression(e) {
    const bt = e.currentTarget;
    let at = bt.id
    if (at === '') {
        normalButton(bt);
    } else {
        specialButton(at);
    }

    textBox.value = expression
    finalAas.innerText = new Operator(expression.replace("÷", "/")).solve() + "";
}

function filter(input) {
    if (operatorList.includes(input) && operatorWasUsed === false) {
        operatorWasUsed = true;
        return input;
    } else if (!Number.isNaN(Number(input))) {
        operatorWasUsed = false;
        return input;
    } else if (operatorList.includes(input)) {
        return '';
    }
    return input;
}

