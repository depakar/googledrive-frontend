export default function FolderItem({ folder, onClick, onDelete }) {
  return (
    <div
      className="group flex items-center justify-between p-3 rounded hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      {/* Folder Name */}
      <div className="flex items-center gap-2 truncate">
        <span className="text-lg">📁</span>
        <span className="truncate font-medium">
          {folder.name}
        </span>
      </div>

      {/* Delete Button (shows on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
        title="Delete folder"
      >
        🗑️
      </button>
    </div>
  );
}
