import { useEffect, useState } from "react";
import {
  getFoldersApi,
  createFolderApi,
} from "../api/folder.api";
import {
  getFilesApi,
  downloadFileApi,
  deleteFileApi,
} from "../api/file.api";
import toast from "react-hot-toast";
import { formatDate } from "../utils/formatDate";
import { getFileIcon } from "../utils/getFileIcon";

import CreateFolderModal from "../components/CreateFolderModal";
import UploadDropzone from "../components/UploadDropzone";

export default function FolderView() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showCreateFolder, setShowCreateFolder] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [folderData, fileData] = await Promise.all([
        getFoldersApi(currentFolder),
        getFilesApi(currentFolder),
      ]);
      setFolders(folderData);
      setFiles(fileData);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentFolder]);

  // 🔹 Preview in new page
  const handlePreview = (file) => {
    window.open(`/preview/${file._id}`, "_blank");
  };

  const handleDownload = async (file) => {
    try {
      const blob = await downloadFileApi(file._id);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  const handleDelete = async (file) => {
    try {
      await deleteFileApi(file._id);
      toast.success("File deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  // 🔹 Create folder
  const handleCreateFolder = async (name) => {
    try {
      await createFolderApi(name, currentFolder);
      toast.success("Folder created");
      setShowCreateFolder(false);
      fetchData();
    } catch {
      toast.error("Failed to create folder");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {currentFolder ? "Folder Contents" : "My Drive"}
        </h2>

        <button
          onClick={() => setShowCreateFolder(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + New Folder
        </button>
      </div>

      {/* DRAG & DROP UPLOAD */}
      <UploadDropzone
        currentFolder={currentFolder}
        onUploadSuccess={fetchData}
      />

      {/* TABLE HEADER */}
      <div className="grid grid-cols-4 text-sm text-gray-500 border-b pb-2 mt-4">
        <span>Name</span>
        <span>Created</span>
        <span>Size</span>
        <span className="text-right">Actions</span>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="animate-pulse mt-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && folders.length === 0 && files.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">This folder is empty</p>
          <p className="text-sm mt-1">
            Upload files or create a new folder
          </p>
        </div>
      )}

      {/* FOLDERS */}
      {!loading &&
        folders.map((folder) => (
          <div
            key={folder._id}
            className="grid grid-cols-4 py-3 hover:bg-gray-50"
          >
            <span
              className="font-medium cursor-pointer"
              onClick={() => setCurrentFolder(folder._id)}
            >
              📁 {folder.name}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(folder.createdAt)}
            </span>
            <span className="text-sm text-gray-400">—</span>
            <span />
          </div>
        ))}

      {/* FILES */}
      {!loading &&
        files.map((file) => (
          <div
            key={file._id}
            className="grid grid-cols-4 py-3 hover:bg-gray-50"
          >
            <span className="font-medium truncate">
              {getFileIcon(file.mimetype)} {file.name}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(file.createdAt)}
            </span>
            <span className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </span>
            <span className="text-right space-x-3">
              <button
                onClick={() => handlePreview(file)}
                className="text-blue-600 hover:underline"
              >
                Preview
              </button>
              <button
                onClick={() => handleDownload(file)}
                className="text-green-600 hover:underline"
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(file)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </span>
          </div>
        ))}

      {/* CREATE FOLDER MODAL */}
      {showCreateFolder && (
        <CreateFolderModal
          onCreate={handleCreateFolder}
          onClose={() => setShowCreateFolder(false)}
        />
      )}
    </div>
  );
}
