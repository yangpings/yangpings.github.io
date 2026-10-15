import { test, expect } from '@playwright/test';

test('character faces movement, walks only while moving, and respects reduced motion', async ({ page }) => {
  await page.goto('/');
  const world = page.getByRole('group', { name: /Interactive world/ });
  const player = page.getByTestId('player');
  await world.focus();
  await page.keyboard.down('d');
  await expect(player).toHaveAttribute('data-facing', 'right');
  await expect(player).toHaveAttribute('data-moving', 'true');
  await page.keyboard.up('d');
  await expect(player).toHaveAttribute('data-moving', 'false');
  await page.keyboard.down('a');
  await expect(player).toHaveAttribute('data-facing', 'left');
  await page.keyboard.up('a');
  await page.keyboard.down('w');
  await expect(player).toHaveAttribute('data-facing', 'up');
  await expect(player).toHaveAttribute('data-moving', 'false');
  await page.keyboard.up('w');
  await page.keyboard.down('s');
  await expect(player).toHaveAttribute('data-facing', 'down');
  await page.keyboard.up('s');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await player.locator('.player-body').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});
