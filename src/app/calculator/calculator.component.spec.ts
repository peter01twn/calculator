import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorComponent } from './calculator.component';
import { MathSymbolPipe } from './math-symbol.pipe';

jest.mock('../math-lib/math-lib');

describe('CalculatorComponent', () => {
    let fixure: ComponentFixture<CalculatorComponent>;
    let component: CalculatorComponent;
    let hostEl: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [CalculatorComponent, MathSymbolPipe] });
        fixure = TestBed.createComponent(CalculatorComponent);
        component = fixure.componentInstance;
        hostEl = fixure.nativeElement;
    });

    test('should create', () => {
        expect(component).toBeTruthy();
    });

    test('enter operator', () => {
        component.enter('-');
        expect(component.formula).toBe('-');

        component.formula = '';
        component.enter('+');
        expect(component.formula).toBe('');

        component.formula = '-';
        component.enter('+');
        expect(component.formula).toBe('+');

        component.formula = '12';
        component.enter('+');
        expect(component.formula).toBe('12+');
    });

    test('enter number', () => {
        component.formula = '';
        component.enter(23);
        expect(component.formula).toBe('23');

        component.formula = '23';
        component.enter(23);
        expect(component.formula).toBe('2323');

        component.formula = '-';
        component.enter('23');
        expect(component.formula).toBe('-23');
    });

    test('backspace', () => {
        component.formula = '1-3';
        component.backspace();
        expect(component.formula).toBe('1-');
    });

    test('clear', () => {
        component.formula = '1-3';
        component.clear();
        expect(component.formula).toBe('');
    });

    test('calcResult', () => {
        const fm = '1-3/(2+5)*2/3+4';
        component.formula = fm;
        component.calcResult();
        expect(component.formula).toBeTruthy();
        expect(component.history).toBe(fm);
    });

    test('display formula', () => {
        component.formula = '1+2*3/(4-5)';
        fixure.detectChanges();
        const displayText = hostEl.querySelector('.screen').textContent;
        expect(displayText).toBe('1+2×3÷(4-5)');
    });

    test('display history', () => {
        component.history = '1+2*3/(4-5)';
        fixure.detectChanges();
        const displayText = hostEl.querySelector('.prev-result').textContent;
        expect(displayText).toBe('1+2×3÷(4-5)');
    });
});
