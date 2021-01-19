import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectCheckboxControlAccessorDirective } from './collect-checkbox-control-accessor.directive';
import { ExtendFormBuilder } from './extend-form-builder';

/**
 * CollectCheckboxModule
 */
@NgModule({
    declarations: [
        CollectCheckboxControlAccessorDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CollectCheckboxControlAccessorDirective
    ],
    providers: [ExtendFormBuilder]
})
export class CollectCheckboxModule { }
