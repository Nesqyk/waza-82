import { test, expect } from '@playwright/test';

test.describe('Technique Detail Page', () => {
  test('displays technique information', async ({ page }) => {
    // Navigate directly to a known technique
    await page.goto('/#/technique/yorikiri');
    
    // Should show technique name
    await expect(page.locator('h1')).toContainText('Yorikiri', { timeout: 10000 });
    
    // Should show translation
    await expect(page.locator('text=Frontal Force Out')).toBeVisible();
    
    // Should have physics visualizer
    const visualizer = page.locator('svg');
    await expect(visualizer.first()).toBeVisible();
  });

  test('play/pause animation controls work', async ({ page }) => {
    await page.goto('/#/technique/yorikiri');
    
    // Wait for page load
    await expect(page.locator('h1')).toContainText('Yorikiri', { timeout: 10000 });
    
    // Find play/pause button
    const playPauseBtn = page.locator('button', { hasText: /Pause|Play/ });
    await expect(playPauseBtn).toBeVisible();
    
    // Click to toggle
    const initialText = await playPauseBtn.textContent();
    await playPauseBtn.click();
    
    // Text should change
    const newText = await playPauseBtn.textContent();
    expect(newText).not.toBe(initialText);
  });

  test('back button returns to deck', async ({ page }) => {
    await page.goto('/#/technique/yorikiri');
    
    // Wait for load
    await expect(page.locator('h1')).toContainText('Yorikiri', { timeout: 10000 });
    
    // Click back/index button
    const backBtn = page.locator('button', { hasText: 'Index' });
    await backBtn.click();
    
    // Should be back on deck
    await expect(page).toHaveURL('http://localhost:3000/#/');
  });

  test('compare modal opens', async ({ page }) => {
    await page.goto('/#/technique/yorikiri');
    
    // Wait for load
    await expect(page.locator('h1')).toContainText('Yorikiri', { timeout: 10000 });
    
    // Click compare button
    const compareBtn = page.locator('button', { hasText: 'Compare' });
    await compareBtn.click();
    
    // Modal should appear
    await expect(page.locator('text=Compare Technique')).toBeVisible();
  });
});

