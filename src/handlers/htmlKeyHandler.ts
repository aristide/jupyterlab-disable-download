import { IDisposable } from '@lumino/disposable';

/**
 * Custom key handler for FileEditor content
 */
export class HTMLElementKeyHandler implements IDisposable {
    private name: String = '';
    private _disposed = false;
    private _iframe: HTMLIFrameElement | null = null;
    private _html: HTMLElement | null = null;
    private _boundHandleKeyEvent: (event: KeyboardEvent) => void;

    constructor(
        name: String = 'HTML Element',
        html: HTMLElement | null = null,
        iframe: HTMLIFrameElement | null = null
    ) {
        this._boundHandleKeyEvent = this._handleKeyEvent.bind(this);
        this.name = name;
        this._html = html;
        this._iframe = iframe;

        if (this._iframe) {
            this.attachToIframe(this._iframe);
        }
        if (this._html) {
            this.attachHTmlHandler(this._html);
        }
    }
    /**
     * Attach key event handler to file editor's content node
     *
     * @param editor - The FileEditor instance
     */
    attachHTmlHandler(node: HTMLElement): void {
        // Ensure content.node exists
        if (!node) {
            console.warn('FileEditor content node not available');
            return;
        }
        // Remove existing event listener if any to prevent multiple attachments
        node.removeEventListener('keydown', this._boundHandleKeyEvent);
        // Attach new event listener
        node.addEventListener('keydown', this._boundHandleKeyEvent);
    }

    /**
     * Attach key event handlers to the PDF viewer iframe
     * @param iframe - The PDF viewer iframe element
     */
    attachToIframe(iframe: HTMLIFrameElement): void {
        if (this._disposed) {
            return;
        }

        this._iframe = iframe;

        // Wait for iframe to loads
        this._iframe.addEventListener('load', () => {
            const iframeDocument =
                this._iframe?.contentDocument ||
                this._iframe?.contentWindow?.document;

            if (iframeDocument) {
                console.log('add keydown event to iframe');
                iframeDocument.addEventListener(
                    'keydown',
                    this._boundHandleKeyEvent
                );
                iframeDocument.body.style.userSelect = 'none';
            }
        });
    }

    /**
     * Handle key events in the PDF viewer
     * @param event - The keyboard event
     */
    _handleKeyEvent(event: KeyboardEvent): void {
        // Check if it's MacOS (⌘ key is pressed)
        const isMac = event.metaKey || event.key === 'Meta';

        // Prevent Ctrl+C
        if ((event.ctrlKey || isMac) && event.key.toLowerCase() === 'c') {
            event.preventDefault();
            event.stopPropagation();
            console.log('Ctrl+C prevented in ' + this.name + ' viewer');
            return;
        }

        // console.log(this.name + ' key down event:', {
        //     key: event.key,
        //     code: event.code,
        //     ctrlKey: event.ctrlKey,
        //     altKey: event.altKey,
        //     shiftKey: event.shiftKey
        //   });
    }

    /**
     * Dispose of the key handler
     */
    dispose(): void {
        if (this._disposed) {
            return;
        }

        const iframeDocument =
            this._iframe?.contentDocument ||
            this._iframe?.contentWindow?.document;
        if (iframeDocument) {
            iframeDocument.removeEventListener(
                'keydown',
                this._boundHandleKeyEvent
            );
        }

        if (this._html) {
            this._html.removeEventListener(
                'keydown',
                this._boundHandleKeyEvent
            );
        }

        this._iframe = null;
        this._html = null;
        this._disposed = true;
    }

    /**
     * Whether the handler is disposed
     */
    get isDisposed(): boolean {
        return this._disposed;
    }
}
