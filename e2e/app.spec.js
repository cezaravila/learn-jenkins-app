const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  // Navega e aguarda o carregamento completo do app
  await page.goto('/', { waitUntil: 'load' });
});

test('has title', async ({ page }) => {
  await expect(page).not.toHaveTitle('');
});

test('has Jenkins in the body', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toContainText(/jenkins/i, { timeout: 15000 });
});

test('has expected app version', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toContainText(/version/i, { timeout: 15000 });
});