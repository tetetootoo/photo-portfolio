import type { Photo } from "../../data/photos";

export function getGridTiles(
  photos: Photo[],
  size: { width: number; height: number },
  offset: { x: number; y: number },
  tileWidth: number,
  tileHeight: number,
  gap: number,
) {
  const uniquePhotos = [...new Map(photos.map((photo) => [photo.src, photo])).values()];
  if (uniquePhotos.length === 0 || size.width === 0 || size.height === 0) return [];

  let cellWidth = tileWidth + gap;
  let cellHeight = tileHeight + gap;
  const visibleColumns = () => Math.ceil((size.width + tileWidth) / cellWidth);
  const visibleRows = () => Math.ceil((size.height + tileHeight) / cellHeight);

  // On unusually large screens, spread the available photos out enough
  // that the viewport can still contain only unique images.
  while (visibleColumns() * visibleRows() > uniquePhotos.length) {
    cellWidth *= 1.1;
    cellHeight *= 1.1;
  }
  const rowStride = visibleColumns();
  const cols = Math.ceil(size.width / cellWidth) + 2;
  const rows = Math.ceil(size.height / cellHeight) + 2;
  const baseCol = Math.floor(-offset.x / cellWidth) - 1;
  const baseRow = Math.floor(-offset.y / cellHeight) - 1;

  // Consecutive rows advance by the maximum number of visible columns.
  // Every visible rectangle therefore contains distinct indices, while
  // modulo wrapping fills every cell even when the photo count is prime.
  const result: { key: string; photo: Photo; left: number; top: number }[] = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const col = baseCol + c;
      const row = baseRow + r;
      const photoIndex = row * rowStride + col;
      const index = ((photoIndex % uniquePhotos.length) + uniquePhotos.length) % uniquePhotos.length;
      result.push({
        key: `${col}:${row}`,
        photo: uniquePhotos[index],
        left: col * cellWidth + offset.x,
        top: row * cellHeight + offset.y,
      });
    }
  }
  return result;
}
