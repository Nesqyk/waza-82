import { test, expect } from '@playwright/test';

test.describe('Technique Deck Page', () => {
  test('loads the homepage and displays techniques', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load (hero title)
    await expect(page.locator('h1')).toContainText('Kimarite');
    
    // Should display technique cards
    const cards = page.locator('[class*="TechniqueCard"], .grid > div');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test('search filters techniques', async ({ page }) => {
    await page.goto('/');
    
    // Wait for cards to load
    await page.waitForSelector('.grid > div', { timeout: 10000 });
    
    // Type in search
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('Yorikiri');
    
    // Should filter results
    await page.waitForTimeout(500); // debounce
    const cards = page.locator('.grid > div');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('rarity filter buttons work', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page load
    await page.waitForSelector('.grid > div', { timeout: 10000 });
    
    // Click Legendary filter
    const legendaryBtn = page.locator('button', { hasText: 'Legendary' });
    await legendaryBtn.click();
    
    // Should update view (button should be active)
    await expect(legendaryBtn).toHaveClass(/bg-sumi/);
  });

  test('clicking a technique card navigates to detail', async ({ page }) => {
    await page.goto('/');
    
    // Wait for cards
    await page.waitForSelector('.grid > div', { timeout: 10000 });
    
    // Click first card
    const firstCard = page.locator('.grid > div').first();
    await firstCard.click();
    
    // Should navigate to detail page
    await expect(page).toHaveURL(/#\/technique\//);
  });
});

