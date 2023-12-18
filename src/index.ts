import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab-disable-download extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-disable-download:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log(
      'JupyterLab extension jupyterlab-disable-download is activated!'
    );
  }
};

export default plugin;
