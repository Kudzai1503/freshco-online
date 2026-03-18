import Image from "next/image";

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
  const hasSrc = src.trim().length > 0;

  return (
    <div className={wrapperClassName}>
      {hasSrc ? (
        <Image
          alt={alt}
          className={className}
          fill
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
