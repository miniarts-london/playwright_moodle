const {test, expect} = require('@playwright/test');

// Logged in: these tests use the session saved by auth.setup.js.
test.describe('site home, logged in', () => {
    test.beforeEach(async({page}) => {
        // redirect=0 stops Moodle sending logged-in users to the Dashboard.
        await page.goto('/?redirect=0');
    });

    test('shows the course catalogue with at least one category', async({page}) => {
        await expect(page.getByRole('heading', {name: 'Course catalogue'})).toBeVisible();
        const cards = page.locator('.sl-card');
        await expect(cards.first()).toBeVisible();
        await expect(cards.first().getByRole('link', {name: /View courses/})).toBeVisible();
    });

    test('shows the about section and the video button', async({page}) => {
        await expect(page.getByRole('heading', {name: 'About Nikon Lenswear UK'})).toBeVisible();
        await expect(page.getByRole('button', {name: /Play video/})).toBeVisible();
    });
});

// Logged out: an empty session, so the page looks as a visitor sees it.
test.describe('site home, logged out', () => {
    test.use({storageState: {cookies: [], origins: []}});

    test('shows the welcome title and the log in form', async({page}) => {
        await page.goto('/');
        await expect(page.getByRole('heading', {level: 1})).toContainText('Welcome to');
        await expect(page.getByLabel('Username')).toBeVisible();
        await expect(page.getByLabel('Password', {exact: true})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Log in'})).toBeVisible();
    });
});