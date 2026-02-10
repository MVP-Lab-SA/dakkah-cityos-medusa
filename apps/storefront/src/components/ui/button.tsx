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
          "bg-ds-primary text-ds-primary-foreground hover:opacity-90 active:opacity-80 border-transparent":
            variant === "primary",
          "bg-ds-secondary text-ds-secondary-foreground hover:bg-ds-muted border-ds-border":
            variant === "secondary",
          "bg-ds-destructive text-ds-destructive-foreground hover:opacity-90 active:opacity-80 border-transparent":
            variant === "danger",
          "bg-transparent text-ds-foreground hover:bg-transparent active:bg-transparent border-transparent":
            variant === "transparent",
          "bg-transparent text-ds-foreground hover:bg-ds-muted active:bg-ds-accent border-ds-border":
            variant === "outline",
          "bg-transparent text-ds-muted-foreground hover:bg-ds-muted hover:text-ds-foreground border-transparent":
            variant === "ghost",
        },
        className
      )}
    />
  );
};
