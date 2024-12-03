import { CSVViewer } from '@jupyterlab/csvviewer';
import { IDisposable } from '@lumino/disposable';
import { CsvCustomKeyHandler } from '../handlers/csvKeyHandler';
import { DataGrid } from '@lumino/datagrid';

export class CSVViewerExtension {
    private handlers: IDisposable[] = [];

    attachKeyHandler(widget: CSVViewer): void {
        // Access the grid through the protected method
        const grid: DataGrid = widget['_grid'];
        if (grid) {
            const handler = new CsvCustomKeyHandler();
            grid.keyHandler = handler;
            this.handlers.push(handler);
            //   console.log('Custom key handler attached to CSV viewer');
        }
    }

    dispose(): void {
        this.handlers.forEach(handler => handler.dispose());
        this.handlers = [];
    }
}
