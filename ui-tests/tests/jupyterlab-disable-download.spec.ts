import { expect, test } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888/lab';

test('should disable download and copy commands', async ({ page }) => {
    await page.goto(TARGET_URL);

    // Wait for JupyterLab to fully load
    await page.waitForSelector('.jp-Launcher', { timeout: 60000 });

    const disabledCommands = [
        'filebrowser:download',
        'docmanager:download',
        'notebook:copy-to-clipboard',
        'notebook:export-to-format',
        'filebrowser:copy-download-link',
        'fileeditor:copy',
        'fileeditor:cut'
    ];

    for (const cmd of disabledCommands) {
        const result = await page.evaluate(id => {
            const app = (window as any).jupyterapp;
            if (!app || !app.commands.hasCommand(id)) {
                return {
                    hasCommand: false,
                    isEnabled: false,
                    isVisible: false
                };
            }
            return {
                hasCommand: true,
                isEnabled: app.commands.isEnabled(id),
                isVisible: app.commands.isVisible(id)
            };
        }, cmd);

        expect(result.hasCommand, `${cmd} should exist`).toBe(true);
        expect(result.isEnabled, `${cmd} should be disabled`).toBe(false);
        expect(result.isVisible, `${cmd} should be hidden`).toBe(false);
    }
});
