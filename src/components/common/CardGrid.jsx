export default function CardGrid({ children }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}