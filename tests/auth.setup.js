const {test: setup, expect} = require('@playwright/test');

setup('log in', async({page}) => {
    await page.goto('login/index.php');
    await page.getByLabel('Username').fill(process.env.MOODLE_USER);
    await page.getByLabel('Password').fill(process.env.MOODLE_PASS);
    await page.getByRole('button', {name: 'Log in'}).click();

    // If Moodle shows a login error, fail with its message instead of a timeout.
    const loginError = page.locator('.loginerrors, .alert-danger').first();
    if (await loginError.isVisible()) {
        throw new Error('Moodle login error: ' + (await loginError.innerText()));
    }

    // Logged in = we've left the login page, wherever Moodle sends us next.
    await expect(page).not.toHaveURL(/login\/index\.php/);

    await page.context().storageState({path: '.auth/user.json'});
});