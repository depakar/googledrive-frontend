export default function Sidebar() {
  return (
    <div className="w-60 bg-gray-50 border-r p-4">
      <div className="font-semibold text-gray-700 mb-4">
        My Drive
      </div>

      <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-200">
        📁 My Files
      </button>
    </div>
  );
}
