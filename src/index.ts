import {
    JupyterFrontEnd,
    JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { CommandRegistry } from '@lumino/commands';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { DocumentRegistry, DocumentWidget } from '@jupyterlab/docregistry';

import { PanelLayout, Widget } from '@lumino/widgets';
import { ILabShell } from '@jupyterlab/application';

import { CSVViewer } from '@jupyterlab/csvviewer';

import { WidgetClassChecker } from './widget-class-checker';
import { CSVViewerExtension } from './widgets/csvViewerExtension';
import { DisposableDelegate, IDisposable } from '@lumino/disposable';
import { FileEditor } from '@jupyterlab/fileeditor';
import { HTMLViewerExtension } from './widgets/htmlViewerExtension';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';

interface IMenuCommands {
    _commands: { [index: string]: unknown };
}

// Configure pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

class RestrictedPDFViewer extends Widget {
    private _pdfViewer: pdfjsViewer.PDFViewer;
    private _container: HTMLDivElement;

    constructor(context: IDocumentManager.IContext) {
        super();
        this.addClass('jp-PDFViewer');

        // Create container for PDF viewer
        this._container = document.createElement('div');
        this._container.className = 'pdfViewer';
        this.node.appendChild(this._container);

        // Prevent text selection and copying
        this.node.addEventListener('selectstart', this._preventSelection);
        this.node.addEventListener('copy', this._preventCopy);

        // Disable context menu
        this.node.addEventListener('contextmenu', this._preventContextMenu);

        // Initialize PDF viewer
        const eventBus = new pdfjsViewer.EventBus();
        this._pdfViewer = new pdfjsViewer.PDFViewer({
            container: this._container,
            eventBus,
            enhanceTextSelection: false
        });

        // Load PDF
        this._loadPDF(context);
    }

    private _preventSelection(event: Event): void {
        event.preventDefault();
    }

    private _preventCopy(event: ClipboardEvent): void {
        event.preventDefault();
    }

    private _preventContextMenu(event: MouseEvent): void {
        event.preventDefault();
    }

    private async _loadPDF(context: IDocumentManager.IContext): Promise<void> {
        try {
            const pdfData = await context.model.contentModel.getData();
            const loadingTask = pdfjsLib.getDocument({ data: pdfData });
            const pdfDocument = await loadingTask.promise;

            this._pdfViewer.setDocument(pdfDocument);
        } catch (error) {
            console.error('Error loading PDF:', error);
        }
    }
}

class RestrictedPDFDocumentWidget extends DocumentWidget {
    constructor(
        options: DocumentWidget.IOptions & {
            context: IDocumentManager.IContext;
        }
    ) {
        const viewer = new RestrictedPDFViewer(options.context);
        super({ ...options, content: viewer });
    }
}

/**
 * Initialization data for the jupyterlab-disable-download extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
    id: 'jupyterlab-disable-download:plugin',
    autoStart: true,
    requires: [IDocumentManager],
    activate: (app: JupyterFrontEnd) => {
        // Disable Download button from ui interface
        app.restored.then(() => {
            const itemsToRemove = [
                'notebook:copy-to-clipboard',
                'filebrowser:download',
                'docmanager:download',
                'notebook:export-to-format',
                'filebrowser:copy-download-link',
                'fileeditor:copy',
                'fileeditor:cut'
            ];
            const commands = <IMenuCommands>(
                (<CommandRegistry | IMenuCommands>app.commands)
            );
            app.commands;
            itemsToRemove.forEach(item => {
                delete commands._commands[item];
            });
        });

        // disable keyDown
        const csvViewerExtension = new CSVViewerExtension();
        const htmlViewerExtension = new HTMLViewerExtension();
        const disposables: IDisposable[] = [];
        const shell = app.shell as ILabShell;

        shell.currentChanged.connect((_, args) => {
            const widget: Widget | null = args.newValue;

            if (widget && widget instanceof DocumentWidget) {
                const content = widget.content;
                if (content instanceof CSVViewer) {
                    csvViewerExtension.attachKeyHandler(content);
                } else if (content instanceof FileEditor) {
                    htmlViewerExtension.attachHtmlKeyHandler(
                        content.node,
                        'File Editor'
                    );
                } else if (WidgetClassChecker.isJSONViewer(widget)) {
                    htmlViewerExtension.attachHtmlKeyHandler(
                        content.node,
                        'JSON Viewer'
                    );
                } else if (WidgetClassChecker.isHTMLViewer(widget)) {
                    htmlViewerExtension.attachIFrameKeyHandler(content.node);
                }
            }
        });

        // Add cleanup handlers to disposables
        disposables.push(
            new DisposableDelegate(() => {
                csvViewerExtension.dispose();
                htmlViewerExtension.dispose();
            })
        );

        // Clean up when the app is disposed
        app.shell.disposed.connect(() => {
            disposables.forEach(d => d.dispose());
        });
    }
};

export default plugin;
