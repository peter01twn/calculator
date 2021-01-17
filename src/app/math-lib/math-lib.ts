function isNum(value): boolean {
    return !isNaN(+value);
}

function getNumInParentheses(str: string): string {
    return str.match(/\(([+-]?(?:\d|\.)+)\)/)?.[1] || str;
}

export class MathLib {
    static evaluate(formula: string): number {
        const splitParenth = formula.split(/(\(|\))/);
        let resultAry: (string | number)[] = [];

        let subFmAry: string[] = [];
        const subFmStart: number[] = [];

        splitParenth.forEach((el, i) => {
            if (el === '(') {
                if (subFmStart.length) {
                    subFmAry.push(el);
                } else {
                    resultAry.push(el);
                }

                subFmStart.push(i);
            } else if (el === ')') {
                const startIndex = subFmStart.pop();
                if (subFmStart.length === 0) {
                    const subFm = subFmAry.join('');
                    const subValue = this.evaluate(subFm);
                    resultAry.push(subValue, el);
                    subFmAry = [];
                } else {
                    subFmAry.push(el);
                }
            } else if (subFmStart.length) {
                subFmAry.push(el);
            } else {
                resultAry.push(el);
            }
        });

        resultAry = resultAry
            .join('')
            .split(/((?:\d|\.)+|\((?:[+\-]?(?:\d|\.)+)+\))/)
            .filter((el) => el !== '');

        resultAry = resultAry.reduce((result, el) => {
            el = getNumInParentheses(el.toString());

            if (isNum(el)) {
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
            } else {
                result.push(el);
            }

            return result;
        }, []);

        resultAry = resultAry.reduce((result, el) => {
            el = getNumInParentheses(el.toString());

            if (isNum(el)) {
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
            } else {
                result.push(el);
            }

            return result;
        }, []);

        return +resultAry[0];
    }
}
