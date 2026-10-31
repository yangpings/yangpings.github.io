import { test, expect } from '@playwright/test';
import { openRoom } from './helpers';

test('sketchbook draws with custom colours, undoes, erases, turns pages and saves', async ({ page }) => {
  await page.goto('/');
  await openRoom(page, 'Art studio');
  const dialog = page.getByRole('dialog');
  const canvas = dialog.getByRole('application', { name: 'Drawing canvas' });
  await dialog.getByRole('radio', { name: 'Ink pen' }).click();
  await dialog.getByLabel('Brush color', { exact: true }).fill('#345abc');
  await dialog.getByLabel('Brush size', { exact: true }).fill('20');
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(bounds.x + 50, bounds.y + 60);
  await page.mouse.down();
  await page.mouse.move(bounds.x + 180, bounds.y + 120, { steps: 12 });
  await page.mouse.up();
  const marks = canvas.locator(':scope > path');
  await expect(marks).toHaveCount(1);
  await expect(marks).toHaveAttribute('stroke', '#345abc');
  await dialog.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(marks).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Redo', exact: true }).click();
  await expect(canvas.locator('path[stroke="#345abc"]')).toHaveCount(1);
  // The eraser masks what is under it.
  await dialog.getByRole('radio', { name: 'Eraser' }).click();
  await canvas.focus(); await page.keyboard.press('Space');
  await expect(canvas.locator('mask')).toHaveCount(1);
  await dialog.getByRole('button', { name: 'Clear canvas', exact: true }).click();
  await expect(canvas.locator('path[stroke="#345abc"]')).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(canvas.locator('path[stroke="#345abc"]')).toHaveCount(1);
  // Pages keep their own drawings.
  await dialog.getByRole('button', { name: 'New page' }).click();
  await expect(dialog.locator('.sketchbook [role=status]')).toContainText('Page 2 is blank');
  await dialog.getByRole('button', { name: 'Previous page' }).click();
  await expect(dialog.locator('.sketchbook [role=status]')).toContainText('on page 1');
  const download = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Save my sketch' }).click();
  expect((await download).suggestedFilename()).toBe('sketchbook-page-1.svg');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
});

test('sketchbook accepts touch strokes', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await openRoom(page, 'Art studio');
  const canvas = page.getByRole('application', { name: 'Drawing canvas' });
  await canvas.tap();
  await expect(canvas.locator(':scope > circle')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Save my sketch' })).toBeEnabled();
  await context.close();
});
