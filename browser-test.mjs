#!/usr/bin/env node
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = new URL('./test-screenshots', import.meta.url).pathname;

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  const takeScreenshot = async (name) => {
    const path = join(SCREENSHOT_DIR, `${name}.png`);
    await page.screenshot({ path });
    results.push({ step: name, screenshot: path });
    return path;
  };

  try {
    // Step 1: Navigate
    console.log('Step 1: Navigating to', BASE_URL);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const title = await page.title();
    const hasContent = await page.locator('text=Bag SDK Sample').isVisible();
    results.push({ step: 'navigate', url: BASE_URL, title, hasContent: !!hasContent });
    await takeScreenshot('1-initial-page');

    // Step 2: Click "+ Create Link"
    console.log('Step 2: Clicking "+ Create Link"');
    await page.getByRole('button', { name: '+ Create Link' }).click();
    await page.waitForTimeout(500);
    const formVisible = await page.locator('form').isVisible();
    results.push({ step: 'click-create', formVisible: !!formVisible });
    await takeScreenshot('2-create-form');

    // Step 3: Fill form (using placeholders/labels from page structure)
    console.log('Step 3: Filling form');
    await page.getByPlaceholder('Pro Plan').fill('Pro Plan');
    await page.getByPlaceholder('29.99').fill('29.99');
    await page.locator('select').selectOption('base_sepolia');
    await page.getByPlaceholder('Optional description').fill('Monthly subscription');
    await takeScreenshot('3-form-filled');

    // Step 4: Click Create Payment Link
    console.log('Step 4: Clicking Create Payment Link');
    await page.getByRole('button', { name: 'Create Payment Link' }).click();
    await page.waitForTimeout(2000);

    // Step 5: Check if link created
    const hasProPlan = await page.locator('text=Pro Plan').isVisible();
    const hasAmount = await page.locator('text=29.99').isVisible();
    results.push({ step: 'create', success: hasProPlan && hasAmount, hasProPlan, hasAmount });
    await takeScreenshot('4-created-link');

    // Step 6: Click Transactions tab
    console.log('Step 6: Clicking Transactions tab');
    await page.getByRole('button', { name: 'Transactions' }).click();
    await page.waitForTimeout(1000);

    const transactionsVisible = await page.locator('text=Transactions').first().isVisible();
    results.push({ step: 'transactions', visible: !!transactionsVisible });
    await takeScreenshot('5-transactions-view');

    console.log('\n--- Results ---');
    console.log(JSON.stringify(results, null, 2));
    writeFileSync(join(SCREENSHOT_DIR, 'results.json'), JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Error:', err);
    try { await takeScreenshot('error-state'); } catch (_) {}
    results.push({ step: 'error', message: err.message });
    writeFileSync(join(SCREENSHOT_DIR, 'results.json'), JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
  return results;
}

run().then((r) => console.log('Done')).catch(console.error);
