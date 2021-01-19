import { EventEmitter } from '@angular/core';
import { AbstractControlOptions, FormControl, ValidatorFn } from '@angular/forms';

export interface CollectCheckboxOptions extends AbstractControlOptions {
    max: number;
}

/**
 * 從 control value accessor 拋出的單一值格式
 */
export class CollectCheckboxValue {
    /**
     * Creates an instance of checkbox value.
     * @param value value
     * @param checked checked
     */
    constructor(public value: any, public checked: boolean) {}
}

/**
 * 多選 checkbox
 */
export class CollectCheckboxFormControl extends FormControl {
    /** @internal */
    // tslint:disable-next-line: ban-types
    _onChange: Function[] = [];

    /** @internal */
    _pendingValue: any;

    max: number;

    overMax = new EventEmitter<boolean>();

    /**
     * Creates an instance of form checkbox control.
     * @param [formState] formState
     * @param [validatorOrOpts] validatorOrOpts
     * @param [args] args
     */
    constructor(
        formState: any = [],
        validatorOrOpts?: ValidatorFn | ValidatorFn[] | CollectCheckboxOptions | null,
        ...args: any[]
    ) {
        super(formState, validatorOrOpts, ...args);
        this.max = validatorOrOpts && (validatorOrOpts as { max: number }).max;
    }

    /**
     * Sets value
     * @param value value
     * @param [options] options
     * @param "options.onlySelf" onlySelf
     * @param "options.emitEvent" emitEvent
     * @param "options.emitModelToViewChange" emitModelToViewChange
     * @param "options.emitViewToModelChange" emitViewToModelChange
     */
    setValue(
        value: CollectCheckboxValue | any[],
        options: {
            onlySelf?: boolean;
            emitEvent?: boolean;
            emitModelToViewChange?: boolean;
            emitViewToModelChange?: boolean;
        } = {}
    ): void {
        if (value instanceof CollectCheckboxValue) {
            const { value: checkboxValue, checked } = value;
            const isInclude = this.value.includes(checkboxValue);

            if (!checked) {
                (this as { value: any }).value = this.value.filter((el: any) => el !== checkboxValue);
                this.overMax.emit(false);
            } else if (!isInclude) {
                if (this.value.length >= this.max) {
                    this.updateModelToView(this.value, true, options.emitViewToModelChange);
                    this.overMax.emit(true);
                } else {
                    (this as { value: any }).value.push(checkboxValue);
                    this.overMax.emit(false);
                }
            }
        } else if (value instanceof Array) {
            if (value.length > this.max) {
                this.updateModelToView(this.value, true, options.emitViewToModelChange);
                this.overMax.emit(true);
            } else {
                (this as { value: any }).value = value;
                this.overMax.emit(false);
            }
        } else if (!this.value || !value) {
            (this as { value: any }).value = [];
            this.overMax.emit(false);
        }

        this._pendingValue = value;

        this.updateModelToView(this.value, options.emitModelToViewChange, options.emitViewToModelChange);
        this.updateValueAndValidity(options);
    }

    /**
     * Updates model to view
     * @param value value
     * @param [emitModelToViewChange] emitModelToViewChange
     * @param [emitViewToModelChange] emitViewToModelChange
     */
    private updateModelToView(value: any, emitModelToViewChange?: boolean, emitViewToModelChange?: boolean): void {
        if (this._onChange.length && emitModelToViewChange !== false) {
            this._onChange.forEach((changeFn) => changeFn(value, emitViewToModelChange !== false));
        }
    }
}
