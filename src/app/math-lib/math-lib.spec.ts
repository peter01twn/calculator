import { MathLib } from './math-lib';

describe('MathLib', () => {
    test('evaluate regelar method', () => {
        const formula = '-1+2*(5-2/(1-2)+3)';
        expect(MathLib.evaluate(formula)).toBe(19);
    });

    test('evaluate wrong method', () => {
        const formula = '*123--45';
        expect(MathLib.evaluate(formula)).toBeNaN();
    });
});
