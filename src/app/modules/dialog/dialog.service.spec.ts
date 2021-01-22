import { DOCUMENT } from '@angular/common';
import { Component, ComponentRef, NgModule, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { DialogConfig } from './dialog-config';
import { DialogContainerBase, DialogState } from './dialog-container';
import { DialogService, DIALOG_COMPONENT_TYPE, DIALOG_DEFAULT_CONFIG } from './dialog.service';

describe('dialog service', () => {
    let document: Document;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [TestModule] });
        document = TestBed.inject(DOCUMENT);
    });

    test('should create service', () => {
        const service = TestBed.inject(DialogService);
        expect(service).toBeInstanceOf(DialogService);
    });

    test('should open a dialog with a component', () => {
        const service = TestBed.inject(DialogService);
        const ref = service.open(TestDialogContentComponent);
        const dialogContainer = (ref.container as ComponentRef<DialogContainerBase>).instance;

        expect(dialogContainer.id).toBe(ref.dialogId);
        expect(dialogContainer.childComponentType).toBe(TestDialogContentComponent);
        expect(document.querySelector('p').textContent).toBe('testDialogContainer');
    });
});

@Component({
    template: `<p>testDialogContainer</p>`,
})
class TestDialogContainerComponent extends DialogContainerBase {
    id: string;
    childComponentType: Type<any>;
    stateChange = new Subject();
    close = jest.fn(() => {
        this.stateChange.next(DialogState.BEFORE_CLOSE);
        this.stateChange.next(DialogState.CLOSED);
    });
    hidden(): void {}
    show(): void {}
}

@Component({
    template: ``,
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
