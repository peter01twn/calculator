import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DialogConfig } from '../../dialog-config';

/**
 * 失敗訊息共用 dialog
 */
@Component({
    selector: 'app-failure-dialog',
    templateUrl: './failure-dialog.component.html',
    styleUrls: ['./failure-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FailureDialogComponent {

    data: any;

    /**
     * Creates an instance of failure dialog component.
     * @param config DialogConfig
     */
    constructor (private config: DialogConfig) {
        this.data = this.config.data;
    }

}
