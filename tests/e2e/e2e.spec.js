const { test, expect } = require('@playwright/test');

test('Add vehicle and see it in the list', async ({ page }) => {
  // Go to the app
  await page.goto('http://localhost:5001');

  // Handle alert dialog before clicking
  page.once('dialog', dialog => dialog.accept());

  // Fill Add Vehicle form
  await page.fill('#reg', 'PLAY001');
  await page.fill('#make', 'PlayCar');
  await page.fill('#model', 'E2E');
  await page.fill('#version', 'v1');
  await page.fill('#date', '2021-01-01');
  await page.fill('#mileage', '12345');
  await page.selectOption('#valuation', 'pending');
  await page.fill('#amount', '55555');

  // Click Add Vehicle button
  await page.click('#addBtn');

  // Wait for the new vehicle to appear in the list
  const newVehicle = page.locator('text=PLAY001');
  await newVehicle.waitFor({ state: 'visible', timeout: 5000 });

  // Verify it is visible
  await expect(newVehicle).toBeVisible();
});
