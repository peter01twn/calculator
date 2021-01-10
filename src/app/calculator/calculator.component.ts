import { Component } from '@angular/core';
import { CalcPriority, Operators } from './calculator-setting';

const splitRegex = `/([${Operators.join('')}])/`;

@Component({
    selector: 'app-calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {
    formula: string;

    result: string;

    constructor() {}

    clear(): void {
        this.result = '';
    }

    enterNum(): void {}

    calcResult(): void {}

    resolveFormula() {
        const calcPriority: CalcPriority = [];
        this.formula.split(splitRegex).reduce((prev: string, el: string, i) => {
            if (isNaN(+el)) {
            } else {
                if (isNaN(+prev)) {
                } else {
                    return prev + el;
                }
            }
        });
    }
}
