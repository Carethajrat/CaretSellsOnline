import { useState } from "react";

// Thumbnails are real <button>s, so Tab / Enter / Space work with no extra code.
// The parent passes key={product.id} so the selected image resets per product.
export default function ProductGallery({ images, name }) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  if (total === 0) {
    return (
      <div className="cs-gallery">
        <div className="cs-gallery__stage ratio ratio-1x1 bg-light">
          <span className="cs-gallery__placeholder" role="img" aria-label="No image available"></span>
        </div>
      </div>
    );
  }

  const safeIndex = Math.min(index, total - 1);
  const alt = total > 1 ? `${name}, image ${safeIndex + 1} of ${total}` : name;

  return (
    <div className="cs-gallery" role="group" aria-label="Product images">
      <div className="cs-gallery__stage ratio ratio-1x1 bg-light">
        <img
          className="cs-gallery__image object-fit-contain"
          src={images[safeIndex]}
          alt={alt}
          width="600"
          height="600"
        />
      </div>

      {total > 1 && (
        <>
          <ul className="cs-gallery__thumbs list-unstyled d-flex flex-wrap gap-2 mt-3 mb-0">
            {images.map((src, i) => (
              <li className="cs-gallery__thumb-item" key={`${src}-${i}`}>
                <button
                  className={`cs-gallery__thumb${i === safeIndex ? " cs-gallery__thumb--active" : ""}`}
                  type="button"
                  aria-label={`Show image ${i + 1} of ${total}`}
                  aria-pressed={i === safeIndex}
                  onClick={() => setIndex(i)}
                >
                  <img className="cs-gallery__thumb-image" src={src} alt="" width="64" height="64" loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
          <p className="cs-gallery__status visually-hidden" role="status">
            Showing image {safeIndex + 1} of {total}
          </p>
        </>
      )}
    </div>
  );
}
