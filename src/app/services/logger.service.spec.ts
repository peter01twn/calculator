import { take } from 'rxjs/operators';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
    test('should be created', () => {
        const service = new LoggerService();
        expect(service).toBeTruthy();
    });

    test('should add new log', () => {
        const service = new LoggerService();
        service.add('new log 01');

        service.logs.subscribe((logs) => {
            expect(logs).toHaveLength(1);
            expect(logs[0]).toHaveProperty('id', 0);
            expect(logs[0]).toHaveProperty('msg', 'new log 01');
        });
    });

    test('should log id be unique', () => {
        const service = new LoggerService();
        const idSet = new Set();

        for (let i = 0; i < 10; i++) {
            service.add(`log ${i}`);
        }
        service.logs.subscribe((logs) => logs.forEach(({ id }) => idSet.add(id)));

        expect(idSet).toHaveProperty('size', 10);
    });

    test('should clear', () => {
        const service = new LoggerService();

        for (let i = 0; i < 10; i++) {
            service.add(`log ${i}`);
        }

        service.logs.pipe(take(1)).subscribe((logs) => {
            expect(logs).toHaveLength(10);
        });

        service.clear();

        service.logs.pipe(take(1)).subscribe((logs) => {
            expect(logs).toHaveLength(0);
        });
    });
});
