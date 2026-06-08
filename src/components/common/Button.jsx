import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/animate-ui/components/buttons/ripple";

/**
 * Only COLORS are customized
 * Sizes are 100% shadcn defaults (from RippleButton)
 */
const COLOR_VARIANTS = {
  primary: `
    bg-primary text-primary-foreground shadow-sm
    hover:bg-primary/90
    focus-visible:ring-2 focus-visible:ring-ring
  `,
  secondary: `
    bg-secondary text-secondary-foreground shadow-sm
    hover:bg-secondary/80
    focus-visible:ring-2 focus-visible:ring-ring
  `,
  outline: `
    border border-input bg-background text-foreground shadow-sm
    hover:bg-accent hover:text-accent-foreground
    focus-visible:ring-2 focus-visible:ring-ring
  `,
  ghost: `
    bg-transparent text-foreground
    hover:bg-accent hover:text-accent-foreground
    focus-visible:ring-2 focus-visible:ring-ring
  `,
  danger: `
    bg-destructive text-destructive-foreground shadow-sm
    hover:bg-destructive/90
    focus-visible:ring-2 focus-visible:ring-destructive/30
  `,
};

export default function Button({
  children,
  variant = "primary",
  ripple = true,
  className = "",
  ...props
}) {
  return (
    <RippleButton
      className={`${COLOR_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
      {ripple && <RippleButtonRipples />}
    </RippleButton>
  );
}
