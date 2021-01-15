const Operators = ['+', '-', '*', '/'];

export const priorRe = /\((?:[+\-*\/=\^]*(?:\d|\.)+)+\)/g;

export const equalNumRe = /(=[+\-]?(?:\d|\.)+)/g;

export const opeRe = /([+\-*\/\^])/;

export function splitFm(fm: string): string[] {
    return fm
        .split(equalNumRe)
        .map((subFm) => (subFm[0] === '=' ? subFm.replace('=', '') : subFm.split(opeRe)))
        .flat(1)
        .filter((el) => el !== '');
}

export function isNum(v: any): boolean {
    return !isNaN(+v);
}

export function calcBaseFm(formula: string): number {
    let splitedFm: (string | number)[] = splitFm(formula);

    splitedFm = splitedFm.reduce((result, el) => {
        if (isNaN(+el)) {
            result.push(el);
        } else {
            if (result[result.length - 1] === '*' || result[result.length - 1] === '/') {
                const ope = result.pop();
                const firstNum = result.pop();

                if (ope === '*') {
                    result.push(+firstNum * +el);
                } else if (ope === '/') {
                    result.push(+firstNum / +el);
                }
            } else {
                result.push(el);
            }
        }
        return result;
    }, []);

    splitedFm = splitedFm.reduce((result, el) => {
        if (isNaN(+el)) {
            result.push(el);
        } else {
            if (result[result.length - 1] === '+' || result[result.length - 1] === '-') {
                const ope = result.pop();
                const firstNum = result.pop() || 0;

                if (ope === '+') {
                    result.push(+firstNum + +el);
                } else if (ope === '-') {
                    result.push(+firstNum - +el);
                }
            } else {
                result.push(el);
            }
        }
        return result;
    }, []);

    return +splitedFm[0];
}

export function calcFormula(formula: string): number {
    const matchResult = formula.matchAll(priorRe);
    let hasMatch: boolean;

    for (const match of matchResult) {
        hasMatch = true;
        const matchFm = match[0].slice(1, -1);
        formula = formula.replace(match[0], `=${calcBaseFm(matchFm)}`);
    }

    if (hasMatch) {
        return calcFormula(formula);
    } else {
        return calcBaseFm(formula);
    }
}
