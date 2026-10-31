import { test, expect } from '@playwright/test';

test('character faces the way it walks along the road, stops at a level, and respects reduced motion', async ({ page }) => {
  await page.goto('/');
  const world = page.getByRole('group', { name: /Interactive world/ });
  const player = page.getByTestId('player');
  await world.focus();
  await page.keyboard.down('d');
  await expect(player).toHaveAttribute('data-moving', 'true');
  await expect(player).toHaveAttribute('data-facing', /right|up|down/);
  await page.keyboard.up('d');
  // It finishes the hop and stops at the next level.
  await expect(player).toHaveAttribute('data-moving', 'false', { timeout: 4000 });
  await page.keyboard.down('a');
  await expect(player).toHaveAttribute('data-facing', /left|up|down/);
  await page.keyboard.up('a');
  await expect(player).toHaveAttribute('data-moving', 'false', { timeout: 4000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await player.locator('.player-body').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});
