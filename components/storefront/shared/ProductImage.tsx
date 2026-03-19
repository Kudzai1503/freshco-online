 "use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageProps = Readonly<{
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  wrapperClassName?: string;
  fallbackClassName?: string;
  fallbackLabel?: string;
  priority?: boolean;
}>;

export function ProductImage({
  src,
  alt,
  sizes,
  className,
  wrapperClassName,
  fallbackClassName,
  fallbackLabel,
  priority = false,
}: Readonly<ProductImageProps>) {
  const [hasError, setHasError] = useState(false);
  const hasSrc = src.trim().length > 0;

  return (
    <div className={wrapperClassName}>
      {hasSrc && !hasError ? (
        <Image
          alt={alt}
          className={className}
          fill
          onError={() => setHasError(true)}
          priority={priority}
          sizes={sizes}
          src={src}
        />
      ) : (
        <figure aria-label={alt} className={fallbackClassName}>
          <figcaption className="max-w-[12ch] text-center leading-tight">
            {fallbackLabel ?? alt}
          </figcaption>
        </figure>
      )}
    </div>
  );
}
