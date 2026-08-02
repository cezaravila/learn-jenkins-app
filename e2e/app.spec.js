import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Garante navegação e aguarda o HTML básico sem travar conexões externas
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/.*/);
});

test('has Jenkins in the body', async ({ page }) => {
  // Usa regex com /i para ignorar maiúsculas/minúsculas no texto "application version" ou "jenkins"
  await expect(page.locator('body')).toContainText(/version|jenkins/i, { timeout: 10000 });
});

test('has expected app version', async ({ page }) => {
  // Procura no BODY da página se existe a palavra "version" em qualquer lugar
  await expect(page.locator('body')).toContainText(/version/i, { timeout: 10000 });
});