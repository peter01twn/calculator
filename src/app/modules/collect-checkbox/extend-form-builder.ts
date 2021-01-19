import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, ValidatorFn } from '@angular/forms';
import { CollectCheckboxFormControl, CollectCheckboxOptions } from './collect-checkbox-form-control';

/**
 * 新增 多選 checkbox func
 */
@Injectable()
export class ExtendFormBuilder extends FormBuilder {
    /**
     * 集合
     * @param formState formState
     * @param [validatorOrOpts] validatorOrOpts
     * @param [asyncValidator] asyncValidator
     * @returns checkbox checkbox
     */
    collect(
        formState: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | CollectCheckboxOptions | null,
        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
    ): CollectCheckboxFormControl {
        return new CollectCheckboxFormControl(formState, validatorOrOpts, asyncValidator);
    }
}
