"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

type PlateImageProps = Omit<ImageProps, "onError"> & {
  /** Shown in place of the image when the file is missing. */
  fallbackLabel?: string;
};

/**
 * An image that fails quietly.
 *
 * Seven of the ~500 pictures referenced by the article JSON have no file
 * behind them, and next/image answers 400 for those. The browser then paints
 * its own broken-image glyph, which on a dark editorial page is the single
 * ugliest thing on screen. Here the plate simply stays an empty well with a
 * mono dash, which reads as "no plate held" rather than as a bug.
 */
export function PlateImage({ fallbackLabel = "—", alt, ...props }: PlateImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="mono mono--micro">{fallbackLabel}</span>
      </span>
    );
  }

  return <Image {...props} alt={alt} onError={() => setFailed(true)} />;
}
