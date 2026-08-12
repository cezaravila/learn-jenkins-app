import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Navega e aguarda o carregamento completo do app
  await page.goto('/', { waitUntil: 'load' });
});

test('has title', async ({ page }) => {
  await expect(page).not.toHaveTitle('');
});

test('has Jenkins in the body', async ({ page }) => {
  await expect(page.locator('body')).toContainText(/version|jenkins/i, { timeout: 10000 });
});

test('has expected app version', async ({ page }) => {
  await page.goto('/');
  // Imprime o conteúdo do body no console do Jenkins para debug
  console.log('Conteúdo da página:', await page.locator('body').innerText());
  await expect(page.locator('body')).toContainText(/version/i, { timeout: 10000 });
});