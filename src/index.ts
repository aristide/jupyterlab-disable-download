import {
    JupyterFrontEnd,
    JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { CommandRegistry } from '@lumino/commands';

namespace CommandIDs {
    export const copyToClipboard = 'notebook:copy-to-clipboard';
    export const downloadFile = 'filebrowser:download';
    export const downloadDoc = 'docmanager:download';
    export const exportNotebook = 'notebook:export-to-format';
}

interface IMenuCommands {
    _commands: { [index: string]: unknown };
}
/**
 * Initialization data for the jupyterlab-disable-download extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
    id: 'jupyterlab-disable-download:plugin',
    autoStart: true,
    activate: (app: JupyterFrontEnd) => {
        app.restored.then(() => {
            const itemsToRemove = [
                CommandIDs.copyToClipboard,
                CommandIDs.downloadFile,
                CommandIDs.downloadDoc,
                CommandIDs.exportNotebook
            ];
            const commands = <IMenuCommands>(
                (<CommandRegistry | IMenuCommands>app.commands)
            );
            app.commands;
            itemsToRemove.forEach(item => {
                delete commands._commands[item];
            });
        });
    }
};

export default plugin;
