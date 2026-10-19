const {defineConfig, devices} = require('@playwright/test');

module.exports = defineConfig({
    testDir: 'tests',
    use: {
        baseURL: 'http://localhost:8080',   
        trace: 'retain-on-failure',
    },
    projects: [
        // Runs first: logs in and saves the session.
        {name: 'setup', testMatch: /auth\.setup\.js/},
        // The real tests: start already logged in.
        {
            name: 'desktop',
            use: {...devices['Desktop Chrome'], storageState: '.auth/user.json'},
            dependencies: ['setup'],
        },
    ],
});