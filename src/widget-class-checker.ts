import { Widget } from '@lumino/widgets';
import { WIDGET_CLASSES } from './constants';

export class WidgetClassChecker {
    static hasClass(widget: Widget, className: string): boolean {
        // Check the widget node itself
        if (widget.node.classList.contains(className)) {
            return true;
        }

        // Check all child elements
        return !!widget.node.querySelector(`.${className}`);
    }

    static findClassElement(widget: Widget, className: string): Element | null {
        // Check the widget node first
        if (widget.node.classList.contains(className)) {
            return widget.node;
        }

        // Then check children
        return widget.node.querySelector(`.${className}`);
    }

    static isCSVViewer(widget: Widget): boolean {
        return this.hasClass(widget, WIDGET_CLASSES.CSV_VIEWER);
    }

    static isJSONViewer(widget: Widget): boolean {
        return this.hasClass(widget, WIDGET_CLASSES.JSON_VIEWER);
    }

    static isPDFViewer(widget: Widget): boolean {
        return this.hasClass(widget, WIDGET_CLASSES.PDF_VIEWER);
    }

    static isNotebook(widget: Widget): boolean {
        return this.hasClass(widget, WIDGET_CLASSES.NOTEBOOK);
    }

    static isFileEditor(widget: Widget): boolean {
        return this.hasClass(widget, WIDGET_CLASSES.FILE_EDITOR);
    }

    static isHTMLViewer(widget: Widget | null): boolean {
        if (!widget) {
            return false;
        }
        return this.hasClass(widget, WIDGET_CLASSES.HTML_VIEWER);
    }
}
