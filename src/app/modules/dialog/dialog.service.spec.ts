import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';

describe('dialog service', () => {
    let service;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DialogService],
        });
    });
});

function setup() {
    const stubValue = 'stub value';
    const masterService = new MasterService(valueServiceSpy);

    return { masterService, stubValue, valueServiceSpy };
}
