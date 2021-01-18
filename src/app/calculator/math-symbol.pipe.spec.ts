import { MathSymbolPipe } from './math-symbol.pipe';

describe('MathSymbolPipe', () => {
    let pipe: MathSymbolPipe;

    beforeEach(() => {
        pipe = new MathSymbolPipe();
    });

    test('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    test('transform symbol', () => {
        const testStr = '*/';

        expect(pipe.transform(testStr)).toBe('×÷');

        expect(pipe.transform('')).toBe('');

        expect(pipe.transform(undefined)).toBe(undefined);
    });
});
