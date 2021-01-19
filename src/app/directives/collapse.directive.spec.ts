import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CollapseDirective } from './collapse.directive';

describe('collapse directive', () => {
    let fixture: ComponentFixture<TestComponent>;
    let collapseDebug: DebugElement;
    let collapseDir: CollapseDirective;
    let collapseEl: HTMLElement;
    let defaultEl: HTMLElement;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [CollapseDirective, TestComponent],
        }).createComponent(TestComponent);

        fixture.detectChanges();

        collapseDebug = fixture.debugElement.query(By.directive(CollapseDirective));
        collapseDir = collapseDebug.injector.get(CollapseDirective);
        collapseEl = collapseDebug.nativeElement;
        defaultEl = fixture.debugElement.query(By.css('#default')).nativeElement;
    });

    test('does element exist', () => {
        expect(collapseEl).toBeTruthy();
        expect(defaultEl).toBeTruthy();
    });

    test('does two el height is equal', () => {
        const cHeight = collapseEl.getBoundingClientRect().height;
        const dHeight = defaultEl.getBoundingClientRect().height;
        expect(cHeight === dHeight).toBeTruthy();
    });

    test('check collapse style during close', () => {
        collapseDir.appCollapse = true;

        expect(collapseEl.style.overflow).toBe('hidden');
        expect(collapseEl.style.transition).toBeTruthy();
        expect(collapseEl.style.height).toBe('0px');

        fixture.detectChanges();

        collapseDebug.triggerEventHandler('transitionend', null);

        expect(collapseEl.style.overflow).toBe('');
        expect(collapseEl.style.height).toBe('');
    });

    test('reset height when open', () => {
        collapseDir.appCollapse = false;

        fixture.detectChanges();

        collapseDebug.triggerEventHandler('transitionend', null);

        const cHeight = collapseEl.getBoundingClientRect().height;
        const dHeight = defaultEl.getBoundingClientRect().height;
        expect(cHeight === dHeight).toBeTruthy();
    });
});

@Component({
    template: `
        <div id="default">
            <div style="width: 200px; height: 400px; background-color: #123456"></div>
        </div>
        <div appCollapse>
            <div style="width: 200px; height: 400px; background-color: #123456"></div>
        </div>
    `,
})
class TestComponent {}
