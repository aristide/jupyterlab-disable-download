import { IDisposable } from '@lumino/disposable';
import { HTMLElementKeyHandler } from '../handlers/htmlKeyHandler';

export class HTMLViewerExtension {
    private handlers: IDisposable[] = [];

    /**
     * Initialize the PDF viewer extension
     * @param pdfContainer - The container element for the PDF viewer
     */
    attachIFrameKeyHandler(iframeContainer: HTMLElement): void {
        // Find the iframe within the PDF viewer container
        const iframe = iframeContainer.querySelector('iframe');
        if (iframe instanceof HTMLIFrameElement) {
            const handler = new HTMLElementKeyHandler(
                'IFrame Container',
                null,
                iframe
            );
            this.handlers.push(handler);
        }
    }

    attachHtmlKeyHandler(container: HTMLElement, name = 'Html viewer'): void {
        const handler = new HTMLElementKeyHandler(name, container);
        this.handlers.push(handler);
    }

    dispose(): void {
        this.handlers.forEach(handler => handler.dispose());
        this.handlers = [];
    }
}
