import { Component } from '@angular/core';
import { calcFormula, isNum } from './calculate-utils';

const endWithNumOrRightParenth = /(\d|\))$/;

@Component({
    selector: 'app-calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {
    history: string;

    formula = '';

    constructor() {}

    enter(numOrOpe: string | number): void {
        if (isNum(numOrOpe) || numOrOpe === '(') {
            this.formula += numOrOpe;
        } else {
            if (this.formula.match(endWithNumOrRightParenth)) {
                this.formula += numOrOpe;
            } else {
                if (this.formula) {
                    this.formula = this.formula.slice(0, -1) + (numOrOpe as string);
                } else if (numOrOpe === '-') {
                    this.formula += numOrOpe;
                }
            }
        }
    }

    backspace(): void {
        this.formula = this.formula.slice(0, -1);
    }

    clear(): void {
        this.formula = this.history = '';
    }

    calcResult(): void {
        this.history = this.formula;
        this.formula = calcFormula(this.formula).toString();
    }
}
