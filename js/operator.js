export default class Operator {
    #k1 = String.fromCharCode(195);
    #k2 = String.fromCharCode(196);
    #k3 = String.fromCharCode(197);
    #k4 = String.fromCharCode(198);
    #k5 = String.fromCharCode(199);
    #memory = [];

    constructor(exp) {
        let value = this.#substitute(exp);
        this.#memory = value.split('+');
        if (exp[0] === '-') {
            this.#memory[0] = '-' + this.#memory[0];
        }
    }

    #substitute(va) {
        let val = (va[0] === '-') ? va.substring(1) : va;
        return val
            .replaceAll('/-', this.#k1)
            .replaceAll('*-', this.#k2)
            .replaceAll('^-', this.#k3)
            .replaceAll('E+', this.#k4)
            .replaceAll('E-', this.#k5)
            .replaceAll('-', '+-');
    }

    #resubstitute(va) {
        return va.replaceAll(this.#k1, '/-')
            .replaceAll(this.#k2, '*-')
            .replaceAll(this.#k3, '^-')
            .replaceAll(this.#k4, 'E+')
            .replaceAll(this.#k5, 'E-');
    }

    #f(n) {
        return (n > 1n) ? (n * this.#f(n - 1n)) : n;
    }

    #fac(n) {
        return this.#f(n).toString();
    }

    #factorial(x) {
        while (x.includes('!')) {
            x = x.replace(
                x.substring(0, x.indexOf('!') + 1),
                this.#fac(BigInt(x.substring(0, x.indexOf('!'))))
            );
        }
        return x;
    }

    #power(split) {
        let finalValue = split[0].includes('!')
            ? parseInt(this.#factorial(split[0]))
            : parseInt(split[0]);

        for (let i = 1; i < split.length; i++) {
            let x = split[i];
            x = (x.includes('!')) ? this.#factorial(x) : x;
            finalValue = Math.pow(finalValue, parseFloat(x));
        }
        return finalValue.toString();
    }

    #divide(split) {
        let finalValue = 1.0;
        for (let i = 0; i < split.length; i++) {
            let x = split[i];
            if (x.includes('^')) x = this.#power(x.split('^'));
            x = (x.includes('!')) ? this.#factorial(x) : x;
            finalValue = (i === 0) ? parseFloat(x) : finalValue / parseFloat(x);
        }
        return finalValue.toString();
    }

    #multiply(split) {
        let finalValue = 1.0;
        for (let x of split) {
            if (x.includes('/')) x = this.#divide(x.split('/'));
            else if (x.includes('^')) x = this.#power(x.split('^'));
            x = (x.includes('!')) ? this.#factorial(x) : x;
            finalValue *= parseFloat(x);
        }
        return finalValue.toString();
    }

    solve() {
        let finalValue = 0.0;
        for (let x of this.#memory) {
            x = this.#resubstitute(x);

            if (x.includes('*')) x = this.#multiply(x.split('*'));
            else if (x.includes('/')) x = this.#divide(x.split('/'));
            else if (x.includes('^')) x = this.#power(x.split('^'));

            x = (x.includes('!')) ? this.#factorial(x) : x;
            finalValue += parseFloat(x);
        }
        return finalValue;
    }
}