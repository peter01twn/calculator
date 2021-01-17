import { MathLib } from './math-lib';

describe('MathLib', () => {
    it('evaluate method', () => {
        const formula = '-1+2*(5-2/(1-2)+3)';
        expect(MathLib.evaluate(formula)).toBe(19);
    });
});
