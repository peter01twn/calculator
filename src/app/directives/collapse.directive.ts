import { Directive, ElementRef, Input, HostListener, AfterViewChecked } from '@angular/core';

@Directive({
    selector: '[appCollapse]',
})
export class CollapseDirective implements AfterViewChecked {
    isOpen: boolean;

    @HostListener('transitionend')
    onCollapseEnd(): void {
        const elStyle = this.el.nativeElement.style;

        elStyle.transition = '';
        elStyle.overflow = '';
        if (this.isOpen) elStyle.height = '';
    }

    @Input() set appCollapse(isOpen: boolean) {
        this.isOpen = isOpen;

        this.collapse(isOpen);
    }

    constructor(private el: ElementRef) {}

    ngAfterViewChecked(): void {
        this.collapse(this.isOpen);
    }

    collapse(isOpen: boolean): void {
        const el = this.el.nativeElement;
        const elStyle = el.style;

        elStyle.overflow = 'hidden';
        elStyle.transition = 'all .2s';

        if (isOpen) {
            elStyle.height = el.scrollHeight + 'px';
        } else {
            elStyle.height = el.scrollHeight + 'px';

            // cause reflow
            const reflow = el.scrollHeight;

            elStyle.height = 0;
        }
    }
}
