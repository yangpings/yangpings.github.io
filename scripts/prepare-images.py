"""Generate web previews. Run with Python and Pillow after updating original images."""
from pathlib import Path
from PIL import Image, ImageOps

source = Path(__file__).resolve().parent.parent / 'images'
destination = source.parent / 'public' / 'images' / 'optimized'
destination.mkdir(parents=True, exist_ok=True)
for path in source.iterdir():
    if path.suffix.lower() not in {'.png', '.jpg', '.jpeg'}:
        continue
    with Image.open(path) as original:
        image = ImageOps.exif_transpose(original)
        image.thumbnail((1400, 1400))
        image.save(destination / f'{path.stem}.webp', 'WEBP', quality=85, method=6)
        print(f'{path.name}: {(destination / (path.stem + ".webp")).stat().st_size:,} bytes')
