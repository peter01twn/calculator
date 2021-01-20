import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Log {
    id: number;
    msg: string;
}

let id = 0;

@Injectable({
    providedIn: 'root',
})
export class LoggerService {
    logs = new BehaviorSubject([]);

    last = this.logs.pipe(map((logs) => logs[logs.length - 1]));

    private _logs = [];

    add(msg: string): void {
        this._logs.push({
            id: id++,
            msg,
        });
        this.logs.next(this._logs);
    }

    clear(): void {
        this._logs = [];
        this.logs.next(this._logs);
    }
}
