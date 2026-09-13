import { useState, type CSSProperties } from "react";
import type { Photo } from "../../data/photos";

interface TileProps {
  photo: Photo;
  style: CSSProperties;
  onClick: (photo: Photo) => void;
}

export function Tile({ photo, style, onClick }: TileProps) {
  const [errored, setErrored] = useState(false);

  return (
    <a
      className="tile"
      style={style}
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick(photo);
      }}
      draggable={false}
    >
      {!errored ? (
        <img
          className="tile__image"
          src={photo.src}
          alt={photo.alt}
          draggable={false}
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="tile__placeholder">
          <span className="tile__placeholder-corner tile__placeholder-corner--tl" />
          <span className="tile__placeholder-corner tile__placeholder-corner--tr" />
          <span className="tile__placeholder-corner tile__placeholder-corner--bl" />
          <span className="tile__placeholder-corner tile__placeholder-corner--br" />
          <span className="tile__placeholder-index">{photo.id}</span>
        </div>
      )}
    </a>
  );
}
