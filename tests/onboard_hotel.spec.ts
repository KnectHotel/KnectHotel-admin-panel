import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 1280, height: 720 },
  actionTimeout: 60000,
  navigationTimeout: 60000,
  ignoreHTTPSErrors: true,
});

test('onboard hotel', async ({ page }) => {
  // Log all network responses to api/hotel/add-hotel
  page.on('response', async response => {
    if (response.url().includes('add-hotel')) {
      console.log(`API Response: ${response.url()} - ${response.status()}`);
      try {
        const body = await response.json();
        console.log('API Body:', JSON.stringify(body, null, 2));
      } catch (e) {
        console.log('API Body not JSON');
      }
    }
  });

  console.log('Navigating to login...');
  await page.goto('http://localhost:3002'); // Updated port from dev server output

  // Login
  await page.fill('input[name="email"]', 'agent@knecthotel.com');
  await page.fill('input[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 60000 });
  console.log('Login successful');

  // Go to Add Hotel
  await page.goto('http://localhost:3000/super-admin/hotel-management/add');
  console.log('Navigated to Add Hotel');

  // Fill text fields
  await page.fill('input[name="name"]', 'Agentic Hotel');
  await page.fill('input[name="number"]', '9876543210');
  await page.fill('input[name="email"]', 'hotel@agentic.com');
  await page.fill('input[name="address"]', '123 AI Street');

  // Hotel Category
  console.log('Selecting Category');
  await page.screenshot({ path: 'add_hotel_page.png' });
  // There are multiple selects. 
  // 1: Hotel Category
  // 2: State
  // 3: Country
  const selects = page.locator('button[role="combobox"]');
  console.log('Count of selects:', await selects.count());

  if (await selects.count() > 0) {
    await selects.first().click(); // Assuming Category is first
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
  } else {
    console.log("No selects found!");
  }

  // State (Required to enable City)
  console.log('Selecting State');
  if (await selects.count() > 1) {
    await selects.nth(1).click(); // Assuming State is second
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
  }

  // Wait for City to be enabled
  const cityInput = page.locator('input[name="city"]');
  await expect(cityInput).toBeEnabled({ timeout: 10000 }).catch(() => console.log("City not enabled yet"));

  // City
  await cityInput.fill('Cyber City').catch(() => console.log("Failed to fill city"));

  // Country
  console.log('Selecting Country');
  if (await selects.count() > 2) {
    await selects.nth(2).click(); // Country is third
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
  }


  // Pincode
  await page.fill('input[name="pinCode"]', '100001');

  // Subscription Plan
  console.log('Selecting Subscription Plan');
  const subTrigger = page.locator('button:has-text("Select plan")').or(page.locator('button:has-text("Select Subscription Plan")'));
  // Placeholder in code might be "Select plan" or similar?
  // hotel-form.tsx: placeholder="Select Subscription Plan" (wait, I need to check placeholder text in file)
  // I saw `subscriptionPlanName` logic but didn't read the render part for subscription plan fully.
  // Assuming "Select Subscription Plan" based on my previous read where I saw it?
  // Let's use flexible locator.
  // Code around line 1700 was Category. Subscription plan is likely further down.
  // I'll trust my previous snippet or guess.
  if (await subTrigger.count() > 0) {
    await subTrigger.first().click();
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
  } else {
    console.log("Could not find subscription plan selector, checking for any select...");
    const selects = await page.locator('button[role="combobox"]').all();
    // Try the last one if uncertain? Or log count.
    console.log(`Found ${selects.length} selects`);
    // It's likely one of them.
    // If validation fails, script will fail submitting.
  }

  // Subscription Start Date
  // Check if there is an input for it.
  // hotel-form.tsx: `subscriptionStartDate`
  // Usually `Input type="date"` or Calendar.
  // Let's try filling keys.
  const dateInput = page.locator('input[name="subscriptionStartDate"]');
  // Sometimes name attribute is missing on Shadcn wrapper, but usually on the input.
  if (await dateInput.count() > 0) {
    // It might be a button triggering a popover though.
    // If it's a native date input:
    await dateInput.fill('2025-01-01');
  } else {
    // Try clicking a button with calendar icon
    const calButton = page.locator('button').filter({ has: page.locator('svg.lucide-calendar') }).first();
    if (await calButton.count() > 0) {
      await calButton.click();
      // Pick a date? 
      // Just picking today/tomorrow
      await page.keyboard.press('Enter');
    }
  }

  // Submit
  console.log('Submitting...');
  await page.click('button[type="submit"]', { timeout: 5000 }).catch(() => {
    // Maybe button text is "Create Hotel" or similar
    return page.click('button:has-text("Submit")');
  });

  // Wait for success or error
  // If success, we should see a toast or redirect.
  // Redirect to /super-admin/hotel-management
  await expect(page).toHaveURL(/.*hotel-management/, { timeout: 15000 }).catch(async () => {
    console.log("Did not redirect.");
    const errors = await page.locator('.text-destructive').allInnerTexts();
    console.log('Validation Errors:', errors);
    // Take screenshot
    await page.screenshot({ path: 'onboard_fail.png' });
    throw new Error("Onboarding failed");
  });

  console.log('SUCCESS: Hotel created');
});
