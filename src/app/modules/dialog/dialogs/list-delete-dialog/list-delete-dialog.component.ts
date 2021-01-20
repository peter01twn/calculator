import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DialogConfig } from '@shared/packages/dialog/dialog-config';

/**
 * 刪除通知 (公司公告、保單通知) dialog
 */
@Component({
    selector: 'app-list-delete-dialog',
    templateUrl: './list-delete-dialog.component.html',
    styleUrls: ['./list-delete-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDeleteDialogComponent {

    deleteAmount: number;

    /**
     * Creates an instance of delete dialog component.
     * @param config DialogConfig
     */
    constructor (private config: DialogConfig) {
        this.deleteAmount = this.config.data && this.config.data.amount;
    }

}
