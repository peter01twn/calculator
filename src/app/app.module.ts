import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalculatorComponent } from './calculator/calculator.component';
import { MathSymbolPipe } from './calculator/math-symbol.pipe';
import { CollapseDirective } from './directives/collapse.directive';

@NgModule({
    declarations: [AppComponent, CalculatorComponent, MathSymbolPipe, CollapseDirective],
    imports: [BrowserModule, BrowserAnimationsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
