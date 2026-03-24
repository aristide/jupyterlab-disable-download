import { CSVViewer } from '@jupyterlab/csvviewer';
import { IDisposable } from '@lumino/disposable';
import { CsvCustomKeyHandler } from '../handlers/csvKeyHandler';
import { DataGrid } from '@lumino/datagrid';

export class CSVViewerExtension {
    private handlers: IDisposable[] = [];

    attachKeyHandler(widget: CSVViewer): void {
        // Access the grid through the private property
        const grid: DataGrid = widget['_grid'];
        if (grid) {
            const handler = new CsvCustomKeyHandler();
            grid.keyHandler = handler;
            this.handlers.push(handler);
        } else {
            console.warn(
                'jupyterlab-disable-download: CSVViewer._grid not found; key handler not attached'
            );
        }
    }

    dispose(): void {
        this.handlers.forEach(handler => handler.dispose());
        this.handlers = [];
    }
}
