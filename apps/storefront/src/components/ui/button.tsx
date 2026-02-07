import { clsx } from "clsx";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: "primary" | "secondary" | "danger" | "transparent" | "outline" | "ghost";
  size?: "full" | "fit" | "sm" | "lg";
};

export const Button = ({
  variant = "primary",
  className,
  size = "full",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(
        "cursor-pointer disabled:cursor-default",
        "inline-flex items-center justify-center gap-2 px-4 py-2",
        "rounded-none shadow-none appearance-none border",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "text-base font-medium",
        size === "full" && "w-full",
        size === "fit" && "w-fit",
        size === "sm" && "h-9 px-3 text-sm",
        size === "lg" && "h-12 px-6 text-lg",
        {
          "bg-zinc-800 text-white hover:bg-zinc-700 active:bg-zinc-600 border-transparent":
            variant === "primary",
          "bg-white text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 border-zinc-900":
            variant === "secondary",
          "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-900 border-transparent":
            variant === "danger",
          "bg-transparent text-zinc-900 hover:bg-transparent active:bg-transparent border-transparent":
            variant === "transparent",
          "bg-transparent text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 border-zinc-200":
            variant === "outline",
          "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border-transparent":
            variant === "ghost",
        },
        className
      )}
    />
  );
};
