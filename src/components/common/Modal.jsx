export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 
          border border-ti-sky w-full max-w-lg
          animate-fadeIn"
          style={{ maxHeight: '90vh', overflow: 'auto' }}>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <button className="absolute top-3 right-4 text-gray-500" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
}

