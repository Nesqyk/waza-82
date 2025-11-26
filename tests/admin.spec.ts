import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/#/login');
    
    // Should show login form
    await expect(page.locator('h2')).toContainText('Dojo Access');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/#/login');
    
    // Fill in invalid credentials
    await page.locator('input[type="email"]').fill('invalid@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    
    // Submit
    await page.locator('button[type="submit"]').click();
    
    // Should show error (after Firebase responds)
    await expect(page.locator('text=/Invalid|failed/i')).toBeVisible({ timeout: 10000 });
  });

  test('unauthenticated user is redirected from admin page', async ({ page }) => {
    // Try to access admin directly
    await page.goto('/#/admin');
    
    // Should redirect to login
    await expect(page).toHaveURL(/#\/login/);
  });
});

test.describe('Referee Mode', () => {
  test('start screen displays correctly', async ({ page }) => {
    await page.goto('/#/referee');
    
    // Should show Gyoji Mode title
    await expect(page.locator('h1')).toContainText('Gyōji Mode', { timeout: 10000 });
    
    // Should have start button
    await expect(page.locator('button', { hasText: 'Begin Bout' })).toBeVisible();
  });

  test('game starts when clicking begin', async ({ page }) => {
    await page.goto('/#/referee');
    
    // Wait for load
    await expect(page.locator('h1')).toContainText('Gyōji Mode', { timeout: 10000 });
    
    // Click start
    await page.locator('button', { hasText: 'Begin Bout' }).click();
    
    // Game UI should appear (score, lives, options)
    await expect(page.locator('text=Score')).toBeVisible({ timeout: 5000 });
  });
});

