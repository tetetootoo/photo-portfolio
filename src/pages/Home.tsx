import { useState } from "react";
import { DragGrid } from "../components/DragGrid/DragGrid";
import { Lightbox } from "../components/Lightbox/Lightbox";
import { photos, type Photo } from "../data/photos";

export function Home() {
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  return (
    <div className="home">
      <DragGrid photos={photos} onOpenPhoto={setActivePhoto} />
      <Lightbox photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </div>
  );
}
