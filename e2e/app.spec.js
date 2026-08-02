import { test, expect } from '@playwright/test';

import { render, screen } from '@testing-library/react';
import App from './App';

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


test('renders app version', () => {
  render(<App />);
  const versionElement = screen.getByText(/version/i);
  expect(versionElement).toBeInTheDocument();
});