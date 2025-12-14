export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white p-6 rounded-xl border border-ti-sky 
        shadow-sm hover-soft
        ${className}
      `}
    >
      {children}
    </div>
  );
}
