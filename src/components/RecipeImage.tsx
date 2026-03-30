"use client";

import { useState } from "react";

interface RecipeImageProps {
  src: string;
  alt: string;
  className: string;
}

export function RecipeImage({ src, alt, className }: RecipeImageProps) {
  const [imageLoaded, setImageLoaded] = useState(true);

  return imageLoaded ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageLoaded(false)}
    />
  ) : null;
}
