import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { MathSymbolPipe } from './calculator/math-symbol.pipe';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent, CalculatorComponent, MathSymbolPipe],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
