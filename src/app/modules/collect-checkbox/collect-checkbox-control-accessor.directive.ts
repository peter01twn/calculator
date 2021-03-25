import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CollectCheckboxValue } from './collect-checkbox-form-control';

const CUST_CHECKBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line: no-use-before-declare
    useExisting: forwardRef(() => CollectCheckboxControlAccessorDirective),
    multi: true,
};

/**
 * 多選 checkbox ControlAccessorDirective
 */
@Directive({
    selector: 'input[type=checkbox][appCollectCheckbox]',
    providers: [CUST_CHECKBOX_VALUE_ACCESSOR],
})
export class CollectCheckboxControlAccessorDirective implements ControlValueAccessor {
    @Input() value: any;

    onChange: (value) => {};
    onTouched: () => {};

    /**
     * Creates an instance of cust checkbox control accessor directive.
     * @param renderer renderer
     * @param elementRef elementRef
     */
    constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

    /**
     * Writes value
     * @param valueAry value
     */
    writeValue(valueAry: any[]): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', valueAry.includes(this.value));
    }

    setDisabledState(isDisabled: boolean): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Hosts listener
     * @param checked checked
     */
    @HostListener('change', ['$event.target.checked'])
    viewChange(checked: boolean): void {
        this.onChange(new CollectCheckboxValue(this.value, checked));
    }
}
