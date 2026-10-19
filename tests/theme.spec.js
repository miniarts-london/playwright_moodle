const {test, expect} = require('@playwright/test');

test('the footer shows the Contact button and address', async({page}) => {
    await page.goto('/?redirect=0');
    const footer = page.locator('.sl-footer');
    await expect(footer.getByRole('link', {name: /Contact us/})).toBeVisible();
    await expect(footer.locator('address')).toContainText('Nikon Optical Ltd');
});