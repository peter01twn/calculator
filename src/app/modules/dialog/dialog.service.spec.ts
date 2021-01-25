import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ComponentRef, NgModule, Type, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { DialogConfig } from './dialog-config';
import { DialogContainerBase, DialogState } from './dialog-container';
import { DialogService, DIALOG_COMPONENT_TYPE, DIALOG_DEFAULT_CONFIG } from './dialog.service';

describe('dialog service', () => {
    let service: DialogService;
    let document: Document;
    let fixture: ComponentFixture<TestDialogContentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [TestModule] });

        service = TestBed.inject(DialogService);
        document = TestBed.inject(DOCUMENT);
        fixture = TestBed.createComponent(TestDialogContentComponent);

        fixture.detectChanges();
    });

    test('should create service', () => {
        expect(service).toBeInstanceOf(DialogService);
    });

    test('should open a dialog with a component', () => {
        const dialogConfig = { data: 'abc' };
        const ref = service.open(TestDialogContentComponent, dialogConfig);

        expect(ref.container.instance instanceof TestDialogContainerComponent).toBeTruthy();
        expect(ref.container.instance.config).toHaveProperty('data', 'abc');

        const dialogContainer = (ref.container as ComponentRef<DialogContainerBase>).instance;

        expect(dialogContainer.id).toBe(ref.dialogId);
        expect(dialogContainer.childComponentType).toBe(TestDialogContentComponent);
        service.closeAll();
    });

    test('should emit before and after dialog opening animation', () => {
        const ref = service.open(TestDialogContainerComponent);
        const beforeOpenSpy = jest.fn();
        const openedSpy = jest.fn();
        ref.beforeOpen.subscribe(beforeOpenSpy);
        ref.afterOpen.subscribe(openedSpy);

        expect(beforeOpenSpy).not.toHaveBeenCalled();
        expect(openedSpy).not.toHaveBeenCalled();

        fixture.detectChanges();

        expect(beforeOpenSpy).toHaveBeenCalledTimes(1);
        expect(openedSpy).toHaveBeenCalledTimes(1);
    });

    test('should emit before and after dialog closing animation', () => {
        const ref = service.open(TestDialogContainerComponent);
        const beforeCloseSpy = jest.fn();
        const closedSpy = jest.fn();
        ref.beforeClose.subscribe(beforeCloseSpy);
        ref.afterClose.subscribe(closedSpy);

        fixture.detectChanges();

        expect(beforeCloseSpy).not.toHaveBeenCalled();
        expect(closedSpy).not.toHaveBeenCalled();

        ref.close();
        fixture.detectChanges();

        expect(beforeCloseSpy).toHaveBeenCalledTimes(1);
        expect(closedSpy).toHaveBeenCalledTimes(1);
    });

    test('should open multiple dialog', () => {
        const firstRef = service.open(TestDialogContentComponent);
        const secondRef = service.open(TestDialogContentComponent);

        expect(firstRef.dialogId).not.toBe(secondRef.dialogId);
    });
});

@Component({
    template: `<p>testDialogContainer</p>`,
})
class TestDialogContainerComponent extends DialogContainerBase implements AfterViewInit {
    id: string;
    childComponentType: Type<any>;
    stateChange = new Subject();
    close = jest.fn(() => {
        this.stateChange.next(DialogState.BEFORE_CLOSE);
        this.stateChange.next(DialogState.CLOSED);
    });

    constructor(config: DialogConfig) {
        super(config);
    }

    ngAfterViewInit(): void {
        this.show();
    }

    hidden(): void {}
    show(): void {
        this.stateChange.next(DialogState.BEFORE_OPEN);
        this.stateChange.next(DialogState.OPENED);
    }
}

@Component({
    template: '<h2>TestDialogContent</h2>',
})
class TestDialogContentComponent {}

@NgModule({
    declarations: [TestDialogContainerComponent, TestDialogContentComponent],
    entryComponents: [TestDialogContainerComponent, TestDialogContentComponent],
    providers: [
        DialogService,
        {
            provide: DIALOG_DEFAULT_CONFIG,
            useValue: new DialogConfig(),
        },
        {
            provide: DIALOG_COMPONENT_TYPE,
            useValue: TestDialogContainerComponent,
        },
    ],
})
class TestModule {}
