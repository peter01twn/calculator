import { ComponentRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DialogConfig } from './dialog-config';
import { DialogState } from './mfp-dialog/mfp-dialog-config';

/**
 * Dialog reference which refers to the current dialog.
 */
export class DialogRef {
    // dialog container id
    dialogId: any;

    result: any;

    private readonly _beforeOpen = new Subject<any>();
    private readonly _afterOpen = new Subject<any>();
    private readonly _beforeClose = new Subject<any>();
    private readonly _afterClose = new Subject<any>();

    /**
     * Before open
     * dialog 在第一次顯示前觸發 (在多層 dialog 的情況下，底層 dialog 可能會多次切換顯示或隱藏)
     */
    readonly beforeOpen: Observable<any> = this._beforeOpen.asObservable();

    /**
     * after open
     * dialog 在第一次顯示後觸發
     */
    readonly afterOpen: Observable<any> = this._afterOpen.asObservable();

    /**
     * before close
     */
    readonly beforeClose: Observable<any> = this._beforeClose.asObservable();

    /**
     * after close
     */
    readonly afterClose: Observable<any> = this._afterClose.asObservable();

    /**
     * Creates an instance of dialog ref.
     * @param container dialog container ComponentRef
     * @param config DialogConfig
     */
    constructor(public container: ComponentRef<any>, public config: DialogConfig) {
        this.dialogId = this.container.instance.id;

        this.container.instance.stateChange
            .pipe(
                filter((event) => event === DialogState.BEFORE_OPEN),
                take(1)
            )
            .subscribe(() => {
                this._beforeOpen.next();
                this._beforeOpen.complete();
            });

        this.container.instance.stateChange
            .pipe(
                filter((event) => event === DialogState.OPENED),
                take(1)
            )
            .subscribe(() => {
                this._afterOpen.next();
                this._afterOpen.complete();
            });

        this.container.instance.stateChange
            .pipe(
                filter((event) => event === DialogState.BEFORE_CLOSE),
                take(1)
            )
            .subscribe(() => {
                this._beforeClose.next(this.result);
                this._beforeClose.complete();
            });

        this.container.instance.stateChange
            .pipe(
                filter((event) => event === DialogState.CLOSED),
                take(1)
            )
            .subscribe(() => {
                this._afterClose.next(this.result);
                this._afterClose.complete();
            });
    }

    /**
     * Closes dialog
     * @param result Optional result to return to the dialog opener. 關閉 Dialog 時要回傳的資料。
     */
    close(result?: any): void {
        this.result = result;
        this.container.instance.close();
    }
}
