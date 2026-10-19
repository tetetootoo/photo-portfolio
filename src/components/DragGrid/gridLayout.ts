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

  const cellWidth = tileWidth + gap;
  const cellHeight = tileHeight + gap;
  const cols = Math.ceil(size.width / cellWidth) + 2;
  const rows = Math.ceil(size.height / cellHeight) + 2;
  const baseCol = Math.floor(-offset.x / cellWidth) - 1;
  const baseRow = Math.floor(-offset.y / cellHeight) - 1;

  // Repeats are farther apart than the viewport plus a tile, so even
  // partially visible copies can never appear together on screen.
  const repeatCols = Math.max(Math.ceil(size.width / cellWidth) + 1, Math.ceil(Math.sqrt(uniquePhotos.length)));
  const repeatRows = Math.max(Math.ceil(size.height / cellHeight) + 1, Math.ceil(uniquePhotos.length / repeatCols));
  const result: { key: string; photo: Photo; left: number; top: number }[] = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const col = baseCol + c;
      const row = baseRow + r;
      const blockCol = ((col % repeatCols) + repeatCols) % repeatCols;
      const blockRow = ((row % repeatRows) + repeatRows) % repeatRows;
      const index = blockRow * repeatCols + blockCol;
      // Leave unfilled slots empty instead of wrapping to a duplicate photo.
      if (index >= uniquePhotos.length) continue;
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
