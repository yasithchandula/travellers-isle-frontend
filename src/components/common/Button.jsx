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
    bg-ti-teal text-white shadow
    hover:bg-[#31685f]
    focus-visible:ring-2 focus-visible:ring-ti-mint
  `,
  secondary: `
    border border-ti-teal
    text-ti-teal bg-white
    hover:bg-ti-sky hover:text-ti-forest
    focus-visible:ring-2 focus-visible:ring-ti-teal
  `,
  outline: `
    border border-ti-forest
    text-ti-forest bg-white
    hover:bg-ti-sky hover:text-ti-teal
    focus-visible:ring-2 focus-visible:ring-ti-teal
  `,
  ghost: `
    text-ti-forest bg-transparent
    hover:bg-ti-sky/60 hover:text-ti-teal
    focus-visible:ring-2 focus-visible:ring-ti-mint
  `,
  danger: `
    bg-ti-red text-white shadow
    hover:bg-[#d05d5d]
    focus-visible:ring-2 focus-visible:ring-red-300
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
