import { NgModule, Type } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { CommonModule } from '@angular/common';

import { DialogService, DIALOG_COMPONENT_TYPE } from './dialog.service';
import { MfpDialogComponent } from './mfp-dialog/mfp-dialog.component';
import { DialogCloseDirective } from './dialog-close.directive';
import { SuccessDialogComponent } from './dialogs/success-dialog/success-dialog.component';
import { FailureDialogComponent } from './dialogs/failure-dialog/failure-dialog.component';
import { ListDeleteDialogComponent } from './dialogs/list-delete-dialog/list-delete-dialog.component';
import { WarningDialogComponent } from './dialogs/warning-dialog/warning-dialog.component';

/**
 * dialog module
 */
@NgModule({
    declarations: [
        MfpDialogComponent,
        DialogCloseDirective,
        SuccessDialogComponent,
        FailureDialogComponent,
        ListDeleteDialogComponent,
        WarningDialogComponent,
    ],
    imports: [CommonModule],
    entryComponents: [
        MfpDialogComponent,
        SuccessDialogComponent,
        FailureDialogComponent,
        WarningDialogComponent,
        ListDeleteDialogComponent,
    ],
    providers: [DialogService],
    exports: [
        DialogCloseDirective,
        SuccessDialogComponent,
        FailureDialogComponent,
        ListDeleteDialogComponent,
        WarningDialogComponent,
    ],
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
