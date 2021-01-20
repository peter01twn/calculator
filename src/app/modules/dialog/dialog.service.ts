/* eslint-disable no-dupe-class-members */
import {
    Injectable,
    ComponentFactoryResolver,
    ApplicationRef,
    Injector,
    Type,
    EmbeddedViewRef,
    InjectionToken,
    Optional,
    Inject,
    ComponentRef,
} from '@angular/core';
import { DialogConfig } from './dialog-config';
import { DialogRef } from './dialog-ref';
import { SuccessDialogComponent } from './dialogs/success-dialog/success-dialog.component';
import { MfpDialogComponent } from './mfp-dialog/mfp-dialog.component';

export const DIALOG_DEFAULT_CONFIG = new InjectionToken<DialogConfig>('dialog-default-config');
export const DIALOG_COMPONENT_TYPE = new InjectionToken<DialogConfig>('dialog-component-type');

let uniqueId = 0;

/**
 * Service to open dialogs,
 * 提供針對 Dialog 機制的共用方法。
 *
 * @author Amy
 */
@Injectable()
export class DialogService {
    /**
     * 紀錄開啟的 DialogRefs.
     */
    dialogRefs: DialogRef[] = [];

    /**
     * 取得不重複 id
     * @returns id
     */
    private get id(): string {
        return `dialog-${uniqueId++}`;
    }

    private bodyScrollTop: number;

    /**
     * Creates an instance of dialog service.
     * @param componentFactoryResolver ComponentFactoryResolver
     * @param appRef ApplicationRef
     * @param injector Injector
     * @param dialogComponentType dialogComponentType
     * @param defaultConfig default config
     */
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        @Inject(DIALOG_COMPONENT_TYPE) private dialogComponentType: Type<any>,
        @Optional() @Inject(DIALOG_DEFAULT_CONFIG) private defaultConfig: DialogConfig
    ) {}

    /**
     * 操作成功
     * @returns DialogRef
     */
    success(): DialogRef {
        return this.open(SuccessDialogComponent, { data: { title: '操作成功!' } });
    }

    /**
     * Opens a modal dialog containing the given component.
     * @param componentType 要載入 Dialog 的 Component.
     * @param config Extra configuration options.
     * @returns DialogRef
     */
    open(componentType: Type<any>, config?: DialogConfig): DialogRef {
        const numberOfDialogs = this.dialogRefs.length;

        if (!numberOfDialogs) {
            this.bodyScrollTop = $('html').scrollTop();
            $('html, body').scrollTop(0);
        }

        if (numberOfDialogs > 0) {
            this.dialogRefs[numberOfDialogs - 1].container.instance.hidden();
        }

        const dialogRef = this.createDialog(componentType, config);
        dialogRef.afterClose.subscribe(() => {
            this.afterClosed(dialogRef);

            if (dialogRef.config.closeAll) {
                this.closeAll();
            }
        });

        return dialogRef;
    }

    /**
     * Closes dialog service
     * @param [result] Optional result to return to the dialog opener. 關閉 Dialog 時要回傳的資料。
     */
    close(result?: any): void {
        const closeDialogRef = this.dialogRefs[this.dialogRefs.length - 1];
        if (closeDialogRef.config.closeAll) {
            this.closeAll(result);
        } else {
            closeDialogRef.close(result);
        }
    }

    /**
     * Closes all dialog
     * @param [result] 傳給最後打開的 dialogRef。Optional result to return to the dialog opener. 關閉 Dialog 時要回傳的資料。
     */
    closeAll(result?: any): void {
        this.dialogRefs
            .slice(0)
            .reverse()
            .forEach((dialogRef, i) => {
                if (i === 0) {
                    dialogRef.close(result);
                } else {
                    dialogRef.close();
                }
            });

        this.dialogRefs = [];
    }

    /**
     * after dialog closed
     * @param dialogRef dialogRef
     */
    private afterClosed(dialogRef: DialogRef): void {
        const deleteIndex = this.dialogRefs.indexOf(dialogRef);
        this.dialogRefs.splice(deleteIndex, 1);
        this.removeDialogComponentFromBody(dialogRef);

        if (this.dialogRefs.length > 0) {
            const ref = this.dialogRefs[this.dialogRefs.length - 1];
            ref.container.instance.show();
        } else {
            $('html, body').scrollTop(this.bodyScrollTop);
        }
    }

    /**
     * 將 DialogComponent 加到 DOM 的 Body 中，即讓這個元件在畫面上可以被看到。
     * @param componentType 要載入 Dialog 的 Component.
     * @param customConfig DialogConfig object.
     * @returns DialogRef.
     */
    private createDialog(componentType: Type<any>, customConfig: DialogConfig = {}): DialogRef {
        const config = { ...new DialogConfig(), ...this.defaultConfig, ...customConfig };
        const containerRef = this.appendDialogComponentToBody(componentType, config);

        const dialogRef = new DialogRef(containerRef, config);
        this.dialogRefs.push(dialogRef);

        const childInjector = Injector.create({
            parent: this.injector,
            providers: [
                {
                    provide: DialogRef,
                    useValue: dialogRef,
                },
                {
                    provide: MfpDialogComponent,
                    useValue: containerRef,
                },
                {
                    provide: DialogConfig,
                    useValue: config,
                },
            ],
        });
        containerRef.instance.childInjector = childInjector;

        return dialogRef;
    }

    /**
     * Creates container
     * @param componentType 要載入 Dialog 的 Component.
     * @param config user config
     * @returns  container
     */
    private appendDialogComponentToBody(componentType: Type<any>, config: DialogConfig = {}): ComponentRef<any> {
        const containerInjector = Injector.create({
            parent: this.injector,
            providers: [
                {
                    provide: DialogConfig,
                    useValue: config,
                },
            ],
        });

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MfpDialogComponent);
        const componentRef = componentFactory.create(containerInjector);
        componentRef.instance.id = this.id;
        componentRef.instance.childComponentType = componentType;

        this.appRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        return componentRef;
    }

    /**
     * 從 DOM 的 Body 中將 DialogComponent 移除。
     * @param dialogRef 要刪除的 dialogRef
     */
    private removeDialogComponentFromBody(dialogRef: DialogRef): void {
        this.appRef.detachView(dialogRef.container.hostView);
        dialogRef.container.destroy();
    }
}
