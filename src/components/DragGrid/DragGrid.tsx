import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Photo } from "../../data/photos";
import { Tile } from "./Tile";
import "./DragGrid.css";

interface DragGridProps {
  photos: Photo[];
  onOpenPhoto: (photo: Photo) => void;
}

interface TileConfig {
  tileWidth: number;
  tileHeight: number;
  gap: number;
}

/** Tile frames are a 3:4 (width:height) portrait ratio. */
const TILE_ASPECT_RATIO = 4 / 3;

/** Mirrors the site's breakpoints: a larger tile above 810px, smaller below. */
const BASE_TILE_WIDTH = { desktop: 210, mobile: 170 };
/** Applied to the base tile widths above (30% smaller). */
const TILE_SCALE = 0.7;

function getTileConfig(): TileConfig {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 810;
  const tileWidth = Math.round((isMobile ? BASE_TILE_WIDTH.mobile : BASE_TILE_WIDTH.desktop) * TILE_SCALE);
  return { tileWidth, tileHeight: Math.round(tileWidth * TILE_ASPECT_RATIO), gap: 125 };
}

function useTileConfig(): TileConfig {
  const [config, setConfig] = useState<TileConfig>(getTileConfig);

  useEffect(() => {
    function onResize() {
      setConfig(getTileConfig());
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return config;
}

/** Distance (px) below which a pointer gesture counts as a click, not a drag. */
const CLICK_THRESHOLD = 6;
/** Constant slow drift (px/ms) applied whenever nobody is dragging and no inertia is active. */
const AUTO_DRIFT = { x: -0.01275, y: -0.0068 };
/** Velocity decay applied to drag-release inertia, per 16ms of elapsed time. */
const FRICTION = 0.94;
/** Inertia velocity (px/ms) below which it hands back off to the auto drift. */
const MIN_INERTIA_VELOCITY = 0.01;

export function DragGrid({ photos, onOpenPhoto }: DragGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { tileWidth, tileHeight, gap } = useTileConfig();

  const draggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0, t: 0 });
  const dragVelocityRef = useRef({ x: 0, y: 0 });
  const moveDistanceRef = useRef(0);
  // Drag-release momentum; while inactive, the animation loop applies AUTO_DRIFT instead.
  const inertiaRef = useRef({ active: false, x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Single persistent loop: drives the constant auto-drift, drag-release
  // inertia, and the handoff between them. Dragging itself moves the offset
  // directly in onPointerMove, so this loop no-ops while draggingRef is set.
  useEffect(() => {
    function frame(now: number) {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = now;
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      const dt = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      if (!draggingRef.current) {
        let vx = AUTO_DRIFT.x;
        let vy = AUTO_DRIFT.y;

        if (inertiaRef.current.active) {
          const decay = Math.pow(FRICTION, dt / 16);
          vx = inertiaRef.current.x * decay;
          vy = inertiaRef.current.y * decay;
          if (Math.abs(vx) < MIN_INERTIA_VELOCITY && Math.abs(vy) < MIN_INERTIA_VELOCITY) {
            inertiaRef.current.active = false;
            vx = AUTO_DRIFT.x;
            vy = AUTO_DRIFT.y;
          } else {
            inertiaRef.current.x = vx;
            inertiaRef.current.y = vy;
          }
        }

        setOffset((o) => ({ x: o.x + vx * dt, y: o.y + vy * dt }));
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameTimeRef.current = null;
    };
  }, []);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    inertiaRef.current.active = false;
    containerRef.current?.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    moveDistanceRef.current = 0;
    dragVelocityRef.current = { x: 0, y: 0 };
    lastPointerRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    const dt = Math.max(now - lastPointerRef.current.t, 1);

    dragVelocityRef.current = { x: dx / dt, y: dy / dt };
    moveDistanceRef.current += Math.abs(dx) + Math.abs(dy);
    lastPointerRef.current = { x: e.clientX, y: e.clientY, t: now };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  }, []);

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    containerRef.current?.releasePointerCapture(e.pointerId);

    const { x: vx, y: vy } = dragVelocityRef.current;
    if (Math.abs(vx) > MIN_INERTIA_VELOCITY || Math.abs(vy) > MIN_INERTIA_VELOCITY) {
      inertiaRef.current = { active: true, x: vx, y: vy };
    } else {
      inertiaRef.current.active = false;
    }
  }, []);

  const handleTileClick = useCallback(
    (photo: Photo) => {
      if (moveDistanceRef.current < CLICK_THRESHOLD) {
        onOpenPhoto(photo);
      }
    },
    [onOpenPhoto],
  );

  const tiles = useMemo(() => {
    if (photos.length === 0 || size.width === 0 || size.height === 0) return [];

    const cellWidth = tileWidth + gap;
    const cellHeight = tileHeight + gap;
    const cols = Math.ceil(size.width / cellWidth) + 2;
    const rows = Math.ceil(size.height / cellHeight) + 2;
    const baseCol = Math.floor(-offset.x / cellWidth) - 1;
    const baseRow = Math.floor(-offset.y / cellHeight) - 1;
    // Side length of the repeating block of unique photos (e.g. 3x3 for 9 photos).
    const block = Math.max(1, Math.ceil(Math.sqrt(photos.length)));

    const result: { key: string; photo: Photo; left: number; top: number }[] = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const col = baseCol + c;
        const row = baseRow + r;
        const blockCol = ((col % block) + block) % block;
        const blockRow = ((row % block) + block) % block;
        const index = (blockRow * block + blockCol) % photos.length;
        result.push({
          key: `${col}:${row}`,
          photo: photos[index],
          left: col * cellWidth + offset.x,
          top: row * cellHeight + offset.y,
        });
      }
    }
    return result;
  }, [photos, size, offset, tileWidth, tileHeight, gap]);

  return (
    <div
      ref={containerRef}
      className="drag-grid"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {tiles.map((tile) => (
        <Tile
          key={tile.key}
          photo={tile.photo}
          style={{ left: tile.left, top: tile.top, width: tileWidth, height: tileHeight }}
          onClick={handleTileClick}
        />
      ))}
    </div>
  );
}
