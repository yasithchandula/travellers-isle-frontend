export default function Button({
  children,
  iconLeft,
  iconRight,
  variant = "primary",
  size = "md",
  full = false,
  loading = false,
  ...props
}) {
  const base = `
    inline-flex items-center justify-center gap-2 
    transition-all duration-200 font-medium
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizes = {
    sm: "px-1.5 py-0.5 text-sm rounded-md text-sm",
    md: "px-2.5 py-1.5 text-base rounded-lg",
    lg: "px-3 py-2 text-lg rounded-xl",
  };

  const variants = {
    primary: `
    bg-ti-teal text-white shadow 
    hover:bg-[#31685f] 
    focus:ring-2 focus:ring-ti-mint
  `,

    secondary: `
    border border-ti-teal 
    text-ti-teal 
    bg-white 
    hover:bg-ti-sky 
    hover:text-ti-forest 
    focus:ring-2 focus:ring-ti-teal
  `,

    outline: `
    border border-ti-forest 
    text-ti-forest 
    bg-white 
    hover:bg-ti-sky 
    hover:text-ti-teal
    focus:ring-2 focus:ring-ti-teal
  `,

    ghost: `
    text-ti-forest 
    bg-transparent 
    hover:bg-ti-sky/60 
    hover:text-ti-teal 
    focus:ring-2 focus:ring-ti-mint
  `,

    danger: `
    bg-ti-red text-white shadow 
    hover:bg-[#d05d5d] 
    focus:ring-2 focus:ring-red-300
  `,
  };


  return (
    <button
      {...props}
      className={`${base} ${sizes[size]} ${variants[variant]} ${full ? "w-full" : ""}`}
    >
      {loading ? (
        <span className="loader border-white" />
      ) : (
        <>
          {iconLeft && <span className="text-lg">{iconLeft}</span>}
          {children}
          {iconRight && <span className="text-lg">{iconRight}</span>}
        </>
      )}
    </button>
  );
}
