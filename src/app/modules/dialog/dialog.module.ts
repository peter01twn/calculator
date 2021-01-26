import { NgModule, Type } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { CommonModule } from '@angular/common';

import { DialogService, DIALOG_COMPONENT_TYPE } from './dialog.service';
import { DialogCloseDirective } from './dialog-close.directive';

/**
 * dialog module
 */
@NgModule({
    declarations: [DialogCloseDirective],
    imports: [CommonModule],
    providers: [DialogService],
    exports: [DialogCloseDirective],
})
export class DialogModule {
    /**
     * For root
     * @param dialogComponentType dialogComponentType
     * @returns root
     */
    static forRoot(dialogComponentType: Type<any>): ModuleWithProviders {
        return {
            ngModule: DialogModule,
            providers: [
                {
                    provide: DIALOG_COMPONENT_TYPE,
                    useValue: dialogComponentType,
                },
            ],
        };
    }
}
