import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "icon";
};

export function Button({ children, variant = "secondary" }: ButtonProps) {
  const className = variant === "primary" ? "button primary" : variant === "icon" ? "button icon" : "button";

  return (
    <button className={className} type="button">
      {children}
    </button>
  );
}
