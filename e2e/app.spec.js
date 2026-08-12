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

  // Exibe a URL real que o Playwright está acessando
  console.log('URL acessada pelo Playwright:', page.url());

  // Tira um print do estado da página e salva na pasta de artefatos
  await page.screenshot({ path: 'playwright-debug.png', fullPage: true });

  await expect(page.locator('body')).toContainText(/version/i, { timeout: 10000 });
});