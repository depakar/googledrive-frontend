export default function FileItem({
  file,
  onDelete,
  onDownload,
  onPreview,
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded hover:bg-gray-200">
      <div className="flex items-center gap-2 truncate">
        📄 <span className="truncate">{file.name}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPreview}
          title="Preview"
          className="text-gray-600 hover:text-black"
        >
          👁️
        </button>

        <button
          onClick={onDownload}
          title="Download"
          className="text-blue-600"
        >
          ⬇️
        </button>

        <button
          onClick={onDelete}
          title="Delete"
          className="text-red-500"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
