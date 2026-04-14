import * as React from "react"

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ""}`}
    {...props}
  />
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, alt, ...props }, ref) => {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { setFailed(false); }, [src]);
  if (!src || failed) return null;
  return (
    <img
      ref={ref}
      src={src as string}
      alt={alt}
      referrerPolicy="no-referrer"
      className={`aspect-square h-full w-full object-cover ${className || ""}`}
      onError={() => setFailed(true)}
      {...props}
    />
  );
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className || ""}`}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
