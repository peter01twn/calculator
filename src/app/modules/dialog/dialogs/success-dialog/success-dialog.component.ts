import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DialogConfig } from '../../dialog-config';

/**
 * 成功訊息共用 dialog
 */
@Component({
    selector: 'app-success-dialog',
    templateUrl: './success-dialog.component.html',
    styleUrls: ['./success-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessDialogComponent {
    data: any;

    /**
     * Creates an instance of success dialog component.
     * @param config DialogConfig
     */
    constructor(private config: DialogConfig) {
        this.data = this.config.data;
    }
}
