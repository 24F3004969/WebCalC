import Operator from './operator.js';

let functionList = new Map();
let charCount = 200;
const isDigit = ch => ch >= '0' && ch <= '9';
let getNextCharKey = () => {
    charCount++;
    return !isDigit(String.fromCharCode(charCount)) ? String.fromCharCode(charCount) : getNextCharKey();
}
let calculationType = (y) => {
    return y * (180 / Math.PI);
}

function loadFunctionTreeMap() {
// --- Trigonometric
    functionList.set(getNextCharKey(), {name: "sin", fun: (x) => Math.sin(calculationType(x))});
    functionList.set(getNextCharKey(), {name: "cos", fun: (x) => Math.cos(calculationType(x))});
    functionList.set(getNextCharKey(), {name: "tan", fun: (x) => Math.tan(calculationType(x))});

// Reciprocal trig (also angle input)
    functionList.set(getNextCharKey(), {name: "cosec", fun: (x) => 1 / Math.sin(calculationType(x))}); // csc
    functionList.set(getNextCharKey(), {name: "sec", fun: (x) => 1 / Math.cos(calculationType(x))});
    functionList.set(getNextCharKey(), {name: "cot", fun: (x) => 1 / Math.tan(calculationType(x))});

// Inverse trig (ratio -> angle; do NOT convert input)
    functionList.set(getNextCharKey(), {name: "asin", fun: (x) => Math.asin(x)});
    functionList.set(getNextCharKey(), {name: "acos", fun: (x) => Math.acos(x)});
    functionList.set(getNextCharKey(), {name: "atan", fun: (x) => Math.atan(x)});

// Inverse of reciprocal trig (ratio -> angle; no input conversion)
    functionList.set(getNextCharKey(), {name: "acosec", fun: (x) => Math.asin(1 / x)}); // arccsc
    functionList.set(getNextCharKey(), {name: "asec", fun: (x) => Math.acos(1 / x)}); // arcsec
    functionList.set(getNextCharKey(), {name: "acot", fun: (x) => Math.atan(1 / x)}); // simple branch

// --- Hyperbolic (Java version didn’t use getType; keep raw input) ---
    functionList.set(getNextCharKey(), {name: "sinh", fun: (x) => Math.sinh(x)});
    functionList.set(getNextCharKey(), {name: "cosh", fun: (x) => Math.cosh(x)});
    functionList.set(getNextCharKey(), {name: "tanh", fun: (x) => Math.tanh(x)});

// Reciprocal hyperbolic
    functionList.set(getNextCharKey(), {name: "cosech", fun: (x) => 1 / Math.sinh(x)}); // csch
    functionList.set(getNextCharKey(), {name: "sech", fun: (x) => 1 / Math.cosh(x)});
    functionList.set(getNextCharKey(), {name: "coth", fun: (x) => 1 / Math.tanh(x)});

// Inverse hyperbolic
    functionList.set(getNextCharKey(), {name: "asinh", fun: (x) => Math.asinh(x)});
    functionList.set(getNextCharKey(), {name: "acosh", fun: (x) => Math.acosh(x)});
    functionList.set(getNextCharKey(), {name: "atanh", fun: (x) => Math.atanh(x)});

// Inverse of reciprocal hyperbolic (no input conversion)
    functionList.set(getNextCharKey(), {name: "acosech", fun: (x) => Math.asinh(1 / x)}); // arccsch
    functionList.set(getNextCharKey(), {name: "asech", fun: (x) => Math.acosh(1 / x)}); // arcsech
    functionList.set(getNextCharKey(), {name: "acoth", fun: (x) => Math.atanh(1 / x)}); // arccoth (simple branch)

// --- Logs and roots ---
    functionList.set(getNextCharKey(), {name: "ln", fun: (x) => Math.log(x)});     // natural log
    functionList.set(getNextCharKey(), {name: "log", fun: (x) => Math.log10(x)});   // base-10
    functionList.set(getNextCharKey(), {name: "root", fun: (x) => Math.sqrt(x)});    // square root
    functionList.set(getNextCharKey(), {name: "Croot", fun: (x) => Math.cbrt(x)});    // cube root

// --- Absolute value ---
    functionList.set(getNextCharKey(), {name: "mod", fun: (x) => Math.abs(x)});
}

loadFunctionTreeMap();

export function add_or_remove_parenthesis(exp) {
    let start = 0, end = 0;
    if (exp.includes("(") || exp.includes(")")) {
        for (let i = 0; i < exp.length; i++) {
            switch (exp.charAt(i)) {
                case '(':
                    start++;
                    break;
                case ')':
                    end++;
                    break;
            }
        }
        if ((start - end) > 0) {
            exp = exp + ")".repeat(Math.max(0, (start - end)));
        } else if ((start - end) < 0) {
            exp = exp.substring(0, (exp.length() - (end - start)));
        }
    }
    return exp;
}

export function makeConsumableFunction(exp) {
    for (const [k, v] of functionList) {
        exp = exp.replace(v.name, k)
    }
    return exp;
}

function containsOperator(exp) {
    return (exp.includes("+") ||
        exp.includes("-") ||
        exp.includes("*") ||
        exp.includes("/") ||
        exp.includes("^"));
}

export function solve_parenthesis(exp) {
    let start, end;
    let ans = "";
    while (exp.includes("(") || exp.includes(")")) {
        start = exp.lastIndexOf('(');
        end = exp.indexOf(')', exp.lastIndexOf('('));
        let x = exp.substring(start, end + 1);
        let val = exp.substring(start + 1, end);
        if (!val.includes(",")) {
            val = val.replace("--", "+").replace("+-", "-").replace("-+", "-");
            ans = containsOperator(val) ? new Operator(val).solve() : val;
        }
        if (start !== 0) {
            let at = exp.charAt(start - 1);
            if (functionList.has(at)) {
                exp = !val.includes(",") ?
                    exp.replace(at + x, "(" +
                        functionList.get(at).fun(ans) + ")") :
                    exp.replace(at + x, "(" +
                        functionList.get(at).fun(at, val.split(",")) + ")");
                continue;
            }
        }
        exp = exp.replace(x, ans);
    }
    return exp;
}