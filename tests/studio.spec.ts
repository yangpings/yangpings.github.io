import { test, expect } from '@playwright/test';

test('studio draws custom colors, restores edits and exports the artwork', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore Art studio', exact: true }).click();
  const dialog = page.getByRole('dialog');
  const canvas = dialog.getByRole('application', { name: 'Drawing canvas' });
  await dialog.getByLabel('Brush color', { exact: true }).fill('#345abc');
  await dialog.getByLabel('Brush size', { exact: true }).fill('28');
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(bounds.x + 50, bounds.y + 50);
  await page.mouse.down();
  await page.mouse.move(bounds.x + 180, bounds.y + 110, { steps: 12 });
  await page.mouse.up();
  await expect(canvas.locator('path')).toHaveCount(1);
  await expect(canvas.locator('path')).toHaveAttribute('stroke', '#345abc');
  await expect(canvas.locator('path')).toHaveAttribute('stroke-width', '28');
  await dialog.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(canvas.locator('path')).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Redo', exact: true }).click();
  await expect(canvas.locator('path')).toHaveCount(1);
  await dialog.getByRole('button', { name: 'Eraser', exact: true }).click();
  await canvas.focus(); await page.keyboard.press('Space');
  await expect(canvas.locator('circle')).toHaveAttribute('fill', '#fff8eb');
  await dialog.getByRole('button', { name: 'Clear canvas', exact: true }).click();
  await expect(canvas.locator('path')).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(canvas.locator('path')).toHaveCount(1);
  const download = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Save my sketch' }).click();
  expect((await download).suggestedFilename()).toBe('my-eric-world-sketch.svg');
  await page.screenshot({ path: 'studio-canvas-check.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
});

test('studio accepts touch strokes', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore Art studio', exact: true }).click();
  const canvas = page.getByRole('application', { name: 'Drawing canvas' });
  await canvas.tap();
  await expect(canvas.locator('circle')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Save my sketch' })).toBeEnabled();
  await context.close();
});
