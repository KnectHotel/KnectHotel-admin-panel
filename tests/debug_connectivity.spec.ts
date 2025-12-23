import { test, expect } from '@playwright/test';

test('debug connectivity', async ({ page }) => {
  console.log('Navigating to login on 3002...');
  try {
    const response = await page.goto('http://localhost:3002', { timeout: 10000 });
    console.log(`Response Status: ${response?.status()}`);
    await page.fill('input[name="email"]', 'agent@knecthotel.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('Login successful to 3002');
  } catch (e) {
    console.log('Error:', e.message);
  }
});
