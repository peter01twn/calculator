import { Type } from '@angular/core';
import { Observable } from 'rxjs';

export const enum DialogState {
    BEFORE_OPEN,
    OPENED,
    BEFORE_CLOSE,
    CLOSED,
}

export const enum DialogSize {
    XS = 'xs',
    SM = 'sm',
    MD = 'md',
    LG = 'lg',
    XL = 'xl',
    STATE = 'state',
}

export abstract class DialogContainerBase {
    id: string;

    childComponentType: Type<any>;

    abstract stateChange: Observable<any>;

    abstract close(result: any): void;
    abstract hidden(): void;
    abstract show(): void;
}
