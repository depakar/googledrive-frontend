import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import FolderView from "./FolderView";

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <FolderView />
          </div>
        </main>
      </div>
    </div>
  );
}
