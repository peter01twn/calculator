import { Directive, HostListener, Input } from '@angular/core';
import { DialogRef } from './dialog-ref';
import { DialogService } from './dialog.service';

/**
 * DialogCloseDirective
 * 讓被綁定的元素可以關閉 dialog
 */
@Directive({
    selector: '[appDialogClose]',
})
export class DialogCloseDirective {
    /**
     * result to return to the dialog opener.
     */
    @Input('appDialogClose') result: any;

    /**
     * 是否關閉全部的 dialog
     */
    @Input() closeAll = false;

    /**
     * onClick
     */
    @HostListener('click')
    onClick(): void {
        if (this.closeAll) {
            this.dialog.closeAll(this.result);
        } else {
            this.dialogRef.close(this.result);
        }
    }

    /**
     * Creates an instance of dialog close directive.
     * @param dialog DialogService
     * @param dialogRef DialogRef
     */
    constructor(private dialog: DialogService, private dialogRef: DialogRef) {}
}
