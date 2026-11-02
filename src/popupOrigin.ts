// Where a popup comes from and returns to, measured before it opens and handed to styles.css as
// custom properties. Without a measured origin the CSS falls back to a rise or the screen centre.

// A case study grows out of the block behind the project's name, and returns to the one being read.
export function placeProjectOrigin(dialog: HTMLElement, name: string) {
  const trigger = Array.from(document.querySelectorAll<HTMLElement>('.project-open')).find(el => el.getAttribute('aria-label')?.startsWith(`${name}:`));
  const block = trigger?.closest<HTMLElement>('.project-name')?.getBoundingClientRect();
  const text = trigger?.getBoundingClientRect();
  if (!trigger || !block?.width || !text || block.bottom <= 0 || block.top >= innerHeight) {
    dialog.style.removeProperty('--clip-from');
    delete dialog.dataset.ghost;
    return;
  }
  const font = getComputedStyle(trigger);
  const set = (key: string, value: string) => dialog.style.setProperty(key, value);
  set('--clip-from', `inset(${block.top}px ${innerWidth - block.right}px ${innerHeight - block.bottom}px ${block.left}px)`);
  set('--ghost-left', `${text.left}px`);
  set('--ghost-top', `${text.top}px`);
  set('--ghost-width', `${text.width + 1}px`);
  // A one-line name must stay on one line, or the overlay jumps when it replaces the real name.
  set('--ghost-wrap', text.height > parseFloat(getComputedStyle(trigger).fontSize) * 1.6 ? 'normal' : 'nowrap');
  set('--ghost-font', font.fontFamily);
  set('--ghost-axes', font.fontVariationSettings);
  set('--ghost-size', font.fontSize);
  set('--ghost-line', font.lineHeight);
  set('--ghost-track', font.letterSpacing);
  set('--ghost-weight', font.fontWeight);
  dialog.dataset.ghost = '';
}

// A World.exe lab opens from the level on the map, in that level's colour.
export function placeRoomOrigin(dialog: HTMLElement, color?: string) {
  const marker = document.querySelector<HTMLElement>('.level-hit[data-here="true"], .level-hit.nearby');
  const rect = marker?.getBoundingClientRect();
  const onScreen = rect && rect.bottom > 0 && rect.top < innerHeight;
  dialog.style.setProperty('--origin-x', onScreen ? `${rect.left + rect.width / 2}px` : '50vw');
  dialog.style.setProperty('--origin-y', onScreen ? `${rect.top + rect.height / 2}px` : '50vh');
  if (color) dialog.style.setProperty('--portal', color);
  else dialog.style.removeProperty('--portal');
}
