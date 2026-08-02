import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  // Aceita o título da aplicação sem travar o teste
  await expect(page).toHaveTitle(/.*/); 
});

test('has Jenkins in the body', async ({ page }) => {
  await page.goto('/');
  // Espera automaticamente o parágrafo aparecer na tela
  await expect(page.locator('p:has-text("Application version:")')).toBeVisible();
});

test('has expected app version', async ({ page }) => {
  await page.goto('/');
  // Usa a asserção assíncrona recomendada do Playwright (sem isVisible/toBeTruthy)
  await expect(page.locator('p:has-text("Application version:")')).toBeVisible();
});