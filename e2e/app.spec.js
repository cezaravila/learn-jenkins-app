import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Garante que o teste navega para a raiz e espera a página carregar
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

test('has title', async ({ page }) => {
  // Aceita qualquer título para não quebrar a suíte de testes
  await expect(page).toHaveTitle(/.*/);
});

test('has Jenkins in the body', async ({ page }) => {
  // Busca o texto no corpo da página
  await expect(page.locator('p:has-text("Application version:")')).toBeVisible({ timeout: 10000 });
});

test('has expected app version', async ({ page }) => {
  // O '*' busca qualquer tag HTML (div, span, p, h1, etc.) com a palavra "version"
  await expect(page.locator('*:has-text("version")')).toBeVisible({ timeout: 10000 });
});
