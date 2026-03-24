import {
    JupyterFrontEnd,
    JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { DocumentWidget } from '@jupyterlab/docregistry';

import { Widget } from '@lumino/widgets';
import { ILabShell } from '@jupyterlab/application';

import { CSVViewer } from '@jupyterlab/csvviewer';

import { WidgetClassChecker } from './widget-class-checker';
import { CSVViewerExtension } from './widgets/csvViewerExtension';
import { DisposableDelegate, IDisposable } from '@lumino/disposable';
import { FileEditor } from '@jupyterlab/fileeditor';
import { HTMLViewerExtension } from './widgets/htmlViewerExtension';

/**
 * Initialization data for the jupyterlab-disable-download extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
    id: 'jupyterlab-disable-download:plugin',
    autoStart: true,
    requires: [IDocumentManager],
    activate: (app: JupyterFrontEnd) => {
        // Disable download/copy/export commands
        app.restored.then(() => {
            const commandsToDisable = [
                'notebook:copy-to-clipboard',
                'filebrowser:download',
                'docmanager:download',
                'notebook:export-to-format',
                'filebrowser:copy-download-link',
                'fileeditor:copy',
                'fileeditor:cut'
            ];

            // In Lumino 2, _commands is a private Map<string, ICommand>.
            // We must remove the existing command before re-adding as a
            // disabled/hidden no-op, since addCommand throws on duplicates.
            const registry = app.commands as any;
            const commandsMap: Map<string, unknown> | undefined =
                registry._commands;

            commandsToDisable.forEach(id => {
                if (!app.commands.hasCommand(id)) {
                    return;
                }
                if (commandsMap) {
                    commandsMap.delete(id);
                }
                app.commands.addCommand(id, {
                    execute: () => {
                        /* no-op */
                    },
                    isEnabled: () => false,
                    isVisible: () => false,
                    label: id
                });
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
