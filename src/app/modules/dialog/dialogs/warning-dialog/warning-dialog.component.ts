import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DialogConfig } from '../../dialog-config';

/**
 * 警告 icon dialog
 */
@Component({
    selector: 'app-warning-dialog',
    templateUrl: './warning-dialog.component.html',
    styleUrls: ['./warning-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarningDialogComponent {

    title: string;
    description: string;

    /**
     * Creates an instance of warning dialog component.
     * @param config DialogConfig
     */
    constructor (config: DialogConfig) {
        this.title = config.data.title;
        this.description = config.data.description;

    }
}
