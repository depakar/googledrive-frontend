import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function CreateFolderModal({ onCreate, onClose }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Folder name is required");
      return;
    }

    if (typeof onCreate !== "function") {
      console.error("onCreate is not a function");
      return;
    }

    onCreate(name.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg w-96 shadow-xl p-6"
      >
        <h2 className="text-lg font-semibold mb-1">New Folder</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter a name for your folder
        </p>

        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Untitled folder"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
