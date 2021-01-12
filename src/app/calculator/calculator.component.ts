import { Component } from '@angular/core';

const Operators = ['+', '-', '*', '/'];

const parenthesesRe = /\([^()]+\)/g;

@Component({
    selector: 'app-calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {
    formula: string;

    constructor() {
        console.log(this.seperateFormula('2*((1-3)/3*(2+4))+5(5/2)'));
    }

    clear(): void {
        this.formula = '';
    }

    enterNum(): void {}

    calcResult(): void {
        const formated = this.seperateFormula(this.formula);
    }

    private arithmeticCompute(formula: string): number {
        const result: (string | number)[] = formula.split(/[\+\-\*\/]/);

        result.slice(0).forEach((el) => {
            if (isNaN(+el)) {
                result.push(el);
            } else {
                if (result[result.length - 1] === '*' || '/') {
                    const ope = result.pop();
                    const firstNum = result.pop();

                    if (ope === '*') {
                        result.push(+firstNum * +el);
                    } else if (ope === '/') {
                        result.push(+firstNum / +el);
                    }
                }
            }
        });

        result.slice(0).forEach((el) => {
            if (isNaN(+el)) {
                result.push(el);
            } else {
                if (result[result.length - 1] === '+' || '-') {
                    const ope = result.pop();
                    const firstNum = result.pop() || 0;

                    if (ope === '+') {
                        result.push(+firstNum + +el);
                    } else if (ope === '-') {
                        result.push(+firstNum - +el);
                    }
                }
            }
        });

        return +result[0];
    }

    private seperateFormula(formula: string): string[][] {
        const matchResult = formula.matchAll(parenthesesRe);
        const result = [];
        let hasMatch: boolean;

        for (const match of matchResult) {
            hasMatch = true;
            formula = formula.replace(match[0], '$');
            result.push(match[0]);
        }

        if (hasMatch) {
            const outerPart = this.seperateFormula(formula);
            return [result, ...outerPart];
        } else {
            return [[formula]];
        }
    }
}
