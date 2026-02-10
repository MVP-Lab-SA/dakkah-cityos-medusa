import { clsx } from "clsx";

type ThumbnailProps = {
  thumbnail?: string | null;
  alt: string;
  className?: string;
};

export const Thumbnail = ({ thumbnail, alt, className }: ThumbnailProps) => {
  return (
    <>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={alt}
          className={clsx("w-20 h-20 object-cover bg-ds-muted", className)}
        />
      ) : (
        <div
          className={clsx(
            "w-20 h-20 bg-ds-muted flex items-center justify-center",
            className
          )}
        >
          <span className="text-xs text-ds-muted-foreground">No image</span>
        </div>
      )}
    </>
  );
};
