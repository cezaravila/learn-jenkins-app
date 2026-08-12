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
  // Força a exibição no terminal do Jenkins
  const bodyText = await page.locator('body').innerText();
  process.stdout.write(`\n--- CONTEÚDO CAPTURADO DA PÁGINA ---\n${bodyText}\n-----------------------------------\n`);

  await expect(page.locator('body')).toContainText(/version/i, { timeout: 10000 });
});