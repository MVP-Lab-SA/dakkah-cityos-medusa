import { clsx } from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={clsx(
        "appearance-none shadow-none outline-none focus:outline-none",
        "border border-ds-input",
        "rounded-none",
        "text-base font-medium text-ds-foreground",
        "px-4 py-2 w-full",
        "bg-ds-background",
        "placeholder:text-ds-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
