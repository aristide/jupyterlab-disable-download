import { DataGrid } from '@lumino/datagrid';
import { IDisposable } from '@lumino/disposable';

type KeyHandlerMethod = (grid: DataGrid, event: KeyboardEvent) => boolean;

export class CsvCustomKeyHandler implements DataGrid.IKeyHandler, IDisposable {
    private _isDisposed = false;
    private _methods: Map<string, KeyHandlerMethod>;

    constructor() {
        this._methods = new Map();
        this.initializeMethods();
    }

    get isDisposed(): boolean {
        return this._isDisposed;
    }

    dispose(): void {
        if (this._isDisposed) {
            return;
        }
        this._methods.clear();
        this._isDisposed = true;
    }

    private initializeMethods(): void {
        this._methods.set('default', (grid: DataGrid, event: KeyboardEvent) => {
            // Check if it's MacOS (⌘ key is pressed)
            const isMac = event.metaKey || event.key === 'Meta';

            // Prevent Ctrl+C
            if ((event.ctrlKey || isMac) && event.key.toLowerCase() === 'c') {
                event.preventDefault();
                event.stopPropagation();
                console.log('Ctrl+C prevented in CSV/TSV viewer');
                return false;
            }
            // console.log('CSV Viewer Key Event:', {
            //   key: event.key,
            //   code: event.code,
            //   ctrlKey: event.ctrlKey,
            //   altKey: event.altKey,
            //   shiftKey: event.shiftKey
            // });
            return true;
        });
    }

    onKeyDown(grid: DataGrid, event: KeyboardEvent): boolean {
        if (this._isDisposed) {
            return false;
        }

        const method = this._methods.get('default');
        if (method) {
            return method(grid, event);
        }

        return false;
    }

    addMethod(name: string, method: KeyHandlerMethod): void {
        if (!this._isDisposed) {
            this._methods.set(name, method);
        }
    }

    removeMethod(name: string): void {
        if (!this._isDisposed) {
            this._methods.delete(name);
        }
    }
}
