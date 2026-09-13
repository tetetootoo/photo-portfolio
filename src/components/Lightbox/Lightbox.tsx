import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Photo } from "../../data/photos";
import "./Lightbox.css";

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
}

/** Keyed by photo.id in the parent so its `errored` state resets per-photo without an effect. */
function LightboxStage({ photo }: { photo: Photo }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="lightbox__placeholder">
        <span>{photo.id}</span>
      </div>
    );
  }

  return (
    <img
      className="lightbox__image"
      src={photo.src}
      alt={photo.alt}
      onError={() => setErrored(true)}
    />
  );
}

export function Lightbox({ photo, onClose }: LightboxProps) {
  useEffect(() => {
    if (!photo) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return createPortal(
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox__close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="lightbox__stage" onClick={(e) => e.stopPropagation()}>
        <LightboxStage key={photo.id} photo={photo} />
      </div>
    </div>,
    document.body,
  );
}
