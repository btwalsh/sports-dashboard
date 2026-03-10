interface TeamLogoProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function TeamLogo({ src, alt, size = 40, className = '' }: TeamLogoProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%23334155" width="40" height="40" rx="20"/></svg>';
      }}
    />
  );
}
