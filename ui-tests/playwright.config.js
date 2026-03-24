/**
 * Configuration for Playwright
 */
module.exports = {
    timeout: 120 * 1000,
    use: {
        headless: true,
        video: 'retain-on-failure'
    },
    webServer: {
        command: 'jlpm start',
        url: 'http://localhost:8888/lab',
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI
    },
    retries: 0,
    expect: {
        timeout: 5 * 1000
    }
};
