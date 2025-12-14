import { useRef, useState } from "react";
import { Upload, ImageIcon, X } from "lucide-react";

export default function ImageUploader({ value, onChange, width = "100%", height = 180 }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value || null);

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file);
  };

  return (
    <div
      className="border border-gray-300 rounded-lg p-3 bg-gray-50 relative cursor-pointer"
      style={{ width }}
      onClick={() => inputRef.current.click()}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleSelect}
      />

      {!preview ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Upload size={40} className="text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">Click to upload an image</p>
        </div>
      ) : (
        <div className="relative w-full">
          <img
            src={preview}
            alt="preview"
            className="rounded-lg object-cover"
            style={{ height }}
          />

          {/* remove button */}
          <button
            className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
              onChange(null);
            }}
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
