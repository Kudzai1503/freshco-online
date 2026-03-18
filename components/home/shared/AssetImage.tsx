"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type AssetImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
  fallbackLabel: string;
  className?: string;
  wrapperClassName?: string;
  fallbackClassName?: string;
};

export function AssetImage({
  alt,
  fallbackLabel,
  className,
  wrapperClassName,
  fallbackClassName,
  ...props
}: AssetImageProps) {
  const [hasError, setHasError] = useState(false);
  const hasSrc = typeof props.src === "string" ? props.src.trim().length > 0 : Boolean(props.src);

  return (
    <div className={wrapperClassName}>
      {!hasSrc || hasError ? (
        <div aria-label={alt} className={fallbackClassName} role="img">
          <span className="max-w-[10ch] text-center leading-tight">{fallbackLabel}</span>
        </div>
      ) : (
        <Image
          {...props}
          alt={alt}
          className={className}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
