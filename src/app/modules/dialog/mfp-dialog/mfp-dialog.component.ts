import {
    Component,
    AfterViewInit,
    OnDestroy,
    Type,
    ViewChild,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef,
    ChangeDetectorRef,
    HostListener,
    ElementRef,
    Inject,
    Renderer2,
    Injector,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FocusTrapFactory, FocusTrap } from '@angular/cdk/a11y';
import { Observable, Subject } from 'rxjs';
import { KEY_CODE } from '@core/enums/key-code.enum';
import { InsertionDirective } from '@shared/base/directives/insertion.directive';
import { DialogConfig } from '../dialog-config';
import { DialogState, MfpConfig } from './mfp-dialog-config';

/**
 * MfpDialogComponent
 * 依賴 magnific Pupup 套件 (mfp)
 */
@Component({
    selector: 'app-mfp-dialog',
    templateUrl: './mfp-dialog.component.html',
    styleUrls: ['./mfp-dialog.component.scss'],
})
export class MfpDialogComponent implements AfterViewInit, OnDestroy {
    // id for mfp
    id: string;

    componentRef: ComponentRef<any>;

    childComponentType: Type<any>;
    childInjector: Injector;

    private _stateChange = new Subject();

    stateChange: Observable<any> = this._stateChange.asObservable();

    // 紀錄當前顯示狀態
    private isShow: boolean = true;

    // el for mfp to binded
    private bindedEl: JQuery = $(this.document.createElement('button'));

    /** The class that traps and manages focus within the dialog. */
    private focusTrap: FocusTrap;

    /**
     * 崁入自訂之 Dialog 元件的 host DOM 元素。
     */
    @ViewChild(InsertionDirective, { static: false })
    private insertionPoint: InsertionDirective;

    @ViewChild('modalContent', { static: false })
    private modalContent: ElementRef;

    /**
     * 在 Dialog 打開之前 UI 上 focused 的 Element，用來在關閉 Dialog 時，將 focus 移回該 Element 上。
     */
    private elementFocusedBeforeDialogWasOpened: HTMLElement;

    /**
     * Removes "keyDownListener".
     */
    // tslint:disable-next-line: ban-types
    private unListenkeyDown: Function;

    /**
     * Creates an instance of mfp dialog component.
     * @param viewContainerRef viewContainerRef
     * @param config config
     * @param componentFactoryResolver componentFactoryResolver
     * @param changeDetectorRef changeDetectorRef
     * @param focusTrapFactory focusTrapFactory
     * @param renderer renderer
     * @param document document
     */
    constructor(
        public viewContainerRef: ViewContainerRef,
        public config: DialogConfig,
        private componentFactoryResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef,
        private focusTrapFactory: FocusTrapFactory,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {}

    /**
     * after view init
     */
    ngAfterViewInit(): void {
        this.loadChildComponent();
        this.changeDetectorRef.detectChanges();
        this._setupFocusTrap();

        const { focus } = this.config;
        // mfp 設定
        this.bindedEl.magnificPopup({
            ...MfpConfig,
            focus,
            items: {
                src: '#' + this.id,
            },
        });

        this._stateChange.next(DialogState.BEFORE_OPEN);

        // 顯示 dialog
        this.show();

        this._stateChange.next(DialogState.OPENED);
    }

    /**
     * on destroy
     */
    ngOnDestroy(): void {
        // Removes "keyDownListener".
        if (this.unListenkeyDown) {
            this.unListenkeyDown();
        }

        if (this.componentRef) {
            this.componentRef.destroy();
            this._restoreFocus();
        }
    }

    /**
     * show mfp dialog component
     */
    show(): void {
        this.bindedEl.magnificPopup('open');
        this.isShow = true;

        const wrap = $.magnificPopup.instance.wrap;
        const container = $.magnificPopup.instance.container;
        const contantContainer = $.magnificPopup.instance.contentContainer;

        // 取消 mfp 原生的 closeOnBgClick 功能，改為自行處理
        $(wrap)
            .off('click')
            .on('click', (e) => {
                if (e.target === wrap[0] || e.target === container[0] || e.target === contantContainer[0]) {
                    this.onOverlayClicked();
                }
            });
    }

    /**
     * hidden mfp dialog component
     */
    hidden(): void {
        this.isShow = false;
        this.bindedEl.magnificPopup('close');
    }

    /**
     * Closes mfp dialog component
     */
    close(): void {
        this._stateChange.next(DialogState.BEFORE_CLOSE);

        this.hidden();

        this._stateChange.next(DialogState.CLOSED);
    }

    /**
     * 當 overlay 背景 click
     */
    onOverlayClicked(): void {
        // close the dialog
        if (this.config.closeDialogWhenClickBackdrop == null || this.config.closeDialogWhenClickBackdrop) {
            this.close();
        }
    }

    /**
     * 在 Dialog Component 本身的區域 click
     * @param event MouseEvent
     */
    onDialogClicked(event: MouseEvent): void {
        // 要加上這行，這樣在 dialog 的區域裡點來點去時才不會觸發 onOverlayClicked 事件
        event.stopPropagation();
    }

    /**
     * 動態載入 Child dialog component,
     * 在這個 DialogComponent 中嵌入自訂的對話窗 Component
     */
    loadChildComponent(): void {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.childComponentType);
        const viewContainerRef = this.insertionPoint.viewContainerRef;
        viewContainerRef.clear();

        // 在指定的 dom 節點下建立並嵌入自訂的 Component.
        this.componentRef = viewContainerRef.createComponent(componentFactory, undefined, this.childInjector);
    }

    /**
     * 建立 FocusTrap, 並且將 focus 焦點移到開啟的 dialog 裡。
     */
    private _setupFocusTrap(): void {
        if (!this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.modalContent.nativeElement);
        }

        this._capturePreviouslyFocusedElement();

        // 試著將 focus 移到 Dialog，如果失敗的話加入 keydown 事件鎖住 Space 及 Enter 不能打以預防用戶誤敲鍵盤。
        this.focusTrap.focusInitialElementWhenReady().then((isSucceed) => {
            if (!isSucceed) {
                this.addKeyDownListenerWhenFocusFail();
            }
        });
    }

    /**
     * Captures the element that was focused before the dialog was opened.
     */
    private _capturePreviouslyFocusedElement(): void {
        if (this.document) {
            this.elementFocusedBeforeDialogWasOpened = this.document.activeElement as HTMLElement;
        }
    }

    /**
     * Restores focus to the element that was focused before the dialog opened.
     */
    protected _restoreFocus(): void {
        //  Need the extra check, because IE can set the `activeElement` to null in some cases.
        if (
            this.elementFocusedBeforeDialogWasOpened &&
            typeof this.elementFocusedBeforeDialogWasOpened.focus === 'function'
        ) {
            this.elementFocusedBeforeDialogWasOpened.focus();
        }

        if (this.focusTrap) {
            this.focusTrap.destroy();
        }
    }

    /**
     * 當 Dialog 試著要將 focus 移到內部 focusable 的 element 失敗時加入 keydown 事件，
     * 以預防用戶在開啟 dialog 時，不小心按到了鍵盤上的 Space or Enter 鍵時，又再次的觸發其它的事件，造成 Dialog 機制出問題。
     *
     * 例如: 在母視窗上有 button, click 後開啟 dialog.oepn()，此時因為 focus 還在 button 上，因此會造成若用戶按了 enter, space 時
     * click 事件再次被觸發，因而又做了一次 dialog.open()，在 dialog 還沒有 close 的情況正又開啟它會有問題。
     *
     * @remark
     * 會失敗通常是因為 Dialog 上沒有任何可以 focus 的 element
     * focusable element means: input, select, button, a, textarea..
     */
    private addKeyDownListenerWhenFocusFail(): void {
        this.unListenkeyDown = this.renderer.listen('document', 'keydown', (event) => {
            if (event.keyCode === KEY_CODE.SPACE || event.keyCode === KEY_CODE.ENTER) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    }

    /**
     * 按了 ESC
     */
    @HostListener('document:keydown.escape')
    onEsc(): void {
        // close the dialog
        if (this.config.closeDialogWhenTriggerESC && this.isShow) {
            this.close();
        }
    }
}
