#!/usr/bin/env node
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';

const STOREFRONT_URL = 'http://localhost:3001';
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
    // Step 1: Navigate to storefront
    console.log('Step 1: Navigating to', STOREFRONT_URL);
    await page.goto(STOREFRONT_URL, { waitUntil: 'networkidle' });
    const title = await page.title();
    const hasStarter = await page.locator('text=Starter Plan').isVisible();
    const hasPro = await page.locator('text=Pro Plan').isVisible();
    const hasEnterprise = await page.locator('text=Enterprise').isVisible();
    const hasBuy999 = await page.getByRole('button', { name: 'Buy for $9.99' }).isVisible();
    results.push({ step: 'navigate', url: STOREFRONT_URL, title, hasStarter, hasPro, hasEnterprise, hasBuy999 });
    await takeScreenshot('1-storefront');

    // Step 2: Click "Buy for $9.99" on Starter Plan
    console.log('Step 2: Clicking Buy for $9.99');
    await page.getByRole('button', { name: 'Buy for $9.99' }).click();
    await page.waitForTimeout(3000); // Wait for redirect

    // Step 3: Check we're on checkout page (localhost:3000/pay/[uuid])
    const url = page.url();
    const isCheckout = url.includes('/pay/') && (url.includes('localhost:3000') || url.includes('127.0.0.1:3000'));
    results.push({ step: 'redirect', url, isCheckout });
    await takeScreenshot('2-checkout');

    // Step 4: Navigate to success page
    console.log('Step 4: Navigating to /success');
    await page.goto(`${STOREFRONT_URL}/success`, { waitUntil: 'networkidle' });
    const successVisible = await page.locator('text=Payment successful!').isVisible();
    results.push({ step: 'success', successVisible });
    await takeScreenshot('3-success');

    // Step 5: Navigate to dashboard
    console.log('Step 5: Navigating to /dashboard');
    await page.goto(`${STOREFRONT_URL}/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // Allow data to load
    const dashboardVisible = await page.locator('text=Dashboard').first().isVisible();
    const hasPaymentLinks = await page.locator('text=Payment Links').first().isVisible();
    const hasStarterLink = await page.locator('text=Starter Plan').first().isVisible();
    results.push({ step: 'dashboard', dashboardVisible, hasPaymentLinks, hasStarterLink });
    await takeScreenshot('4-dashboard');

    console.log('\n--- Results ---');
    console.log(JSON.stringify(results, null, 2));
    writeFileSync(join(SCREENSHOT_DIR, 'storefront-results.json'), JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Error:', err);
    try { await takeScreenshot('error-state'); } catch (_) {}
    results.push({ step: 'error', message: err.message });
    writeFileSync(join(SCREENSHOT_DIR, 'storefront-results.json'), JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
  return results;
}

run().then(() => console.log('Done')).catch(console.error);
