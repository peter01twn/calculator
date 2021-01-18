import { Pipe, PipeTransform } from '@angular/core';

const SymbolMap = {
    '*': '×',
    '/': '÷',
};

@Pipe({
    name: 'mathSymbol',
})
export class MathSymbolPipe implements PipeTransform {
    transform(str: string): string {
        if (!str) {
            return str;
        }

        for (const key in SymbolMap) {
            if (Object.prototype.hasOwnProperty.call(SymbolMap, key)) {
                str = str.replace(key, SymbolMap[key]);
            }
        }

        return str;
    }
}
