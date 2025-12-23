import { test, expect } from '@playwright/test';

test('onboard hotel', async ({ page }) => {
  // Needs credentials to be useful
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'screenshot_landing.png' });
});
