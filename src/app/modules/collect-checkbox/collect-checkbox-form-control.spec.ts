import { CollectCheckboxFormControl, CollectCheckboxValue } from './collect-checkbox-form-control';

describe('CollectCheckboxFormControl', () => {
    test('does default value equal to empty array', () => {
        const control = new CollectCheckboxFormControl();
        expect(control.value).toBeInstanceOf(Array);
    });

    test('does default max option equal to unefine', () => {
        const control = new CollectCheckboxFormControl();
        expect(control.max).toBeUndefined();
    });

    test('init value by constructor', () => {
        const value = ['01'];
        const control = new CollectCheckboxFormControl(value, { max: 1 });

        expect(control.value).toBe(value);
        expect(control.max).toBe(1);
    });

    describe('setValue', () => {
        test('setValue by array', () => {
            const control = new CollectCheckboxFormControl();
            const newValue = ['1', '2'];
            control.setValue(newValue);
            expect(control.value).toBe(newValue);
        });

        test('setValue by valueAccessor', () => {
            const control = new CollectCheckboxFormControl();
            const checkedValue = new CollectCheckboxValue('01', true);
            control.setValue(checkedValue);
            expect(control.value.includes(checkedValue.value)).toBeTruthy();

            const unChecked = new CollectCheckboxValue('01', false);
            control.setValue(unChecked);
            expect(control.value.includes(unChecked.value)).toBeFalsy();
        });

        test('should not add new value more than max', () => {
            const control = new CollectCheckboxFormControl(['56'], { max: 1 });

            control.setValue(['01', '2']);
            expect(control.value.length).toBe(1);

            control.setValue(new CollectCheckboxValue('3', true));
            expect(control.value.length).toBe(1);
        });
    });

    test('recive overmax event when setValue more than max', () => {
        const control = new CollectCheckboxFormControl([], { max: 1 });
        control.overMax.subscribe((isOverMax: boolean) => (overMax = isOverMax));

        let overMax;

        control.setValue(['1']);

        expect(overMax).toBeFalsy();

        control.setValue(['1', '2']);

        expect(overMax).toBeTruthy();
    });
});
