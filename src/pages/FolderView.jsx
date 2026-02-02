import { useEffect, useState } from "react";
import {
  getFoldersApi,
  createFolderApi,
  deleteFolderApi,
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
import ConfirmModal from "../components/ConfirmModal";

export default function FolderView() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Breadcrumb state
  const [path, setPath] = useState([
    { id: null, name: "My Drive" },
  ]);

  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [confirmData, setConfirmData] = useState(null);

  const currentFolder =
    path[path.length - 1].id;

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

  /* ======================
     FOLDER ACTIONS
  ====================== */
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

  const handleDeleteFolder = (folder) => {
    setConfirmData({
      title: "Delete Folder",
      message: `Delete "${folder.name}" and all its contents?`,
      onConfirm: async () => {
        await deleteFolderApi(folder._id);
        toast.success("Folder deleted");
        setConfirmData(null);
        fetchData();
      },
    });
  };

  /* ======================
     FILE ACTIONS
  ====================== */
  const handlePreview = (file) => {
    window.open(`/preview/${file._id}`, "_blank");
  };

  const handleDownload = async (file) => {
    const blob = await downloadFileApi(file._id);
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleDeleteFile = (file) => {
    setConfirmData({
      title: "Delete File",
      message: `Delete "${file.name}"?`,
      onConfirm: async () => {
        await deleteFileApi(file._id);
        toast.success("File deleted");
        setConfirmData(null);
        fetchData();
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-xl font-semibold">
            {path[path.length - 1].name}
          </h2>

          {/* BREADCRUMBS */}
          <div className="text-sm text-gray-500 mt-1">
            {path.map((p, i) => (
              <span key={p.id ?? "root"}>
                <button
                  onClick={() =>
                    setPath(path.slice(0, i + 1))
                  }
                  className="hover:underline"
                >
                  {p.name}
                </button>
                {i < path.length - 1 && " / "}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowCreateFolder(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + New Folder
        </button>
      </div>

      {/* BACK BUTTON */}
      {path.length > 1 && (
        <button
          onClick={() =>
            setPath(path.slice(0, -1))
          }
          className="text-sm text-blue-600 mb-2"
        >
          ← Back
        </button>
      )}

      {/* UPLOAD */}
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

      {/* EMPTY */}
      {!loading && folders.length === 0 && files.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          This folder is empty
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
              onClick={() =>
                setPath((prev) => [
                  ...prev,
                  { id: folder._id, name: folder.name },
                ])
              }
            >
              📁 {folder.name}
            </span>

            <span className="text-sm text-gray-500">
              {formatDate(folder.createdAt)}
            </span>

            <span className="text-sm text-gray-400">—</span>

            <span className="text-right">
              <button
                onClick={() =>
                  handleDeleteFolder(folder)
                }
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </span>
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
                className="text-blue-600"
              >
                Preview
              </button>
              <button
                onClick={() => handleDownload(file)}
                className="text-green-600"
              >
                Download
              </button>
              <button
                onClick={() => handleDeleteFile(file)}
                className="text-red-600"
              >
                Delete
              </button>
            </span>
          </div>
        ))}

      {/* MODALS */}
      {showCreateFolder && (
        <CreateFolderModal
          onCreate={handleCreateFolder}
          onClose={() => setShowCreateFolder(false)}
        />
      )}

      {confirmData && (
        <ConfirmModal
          {...confirmData}
          onCancel={() => setConfirmData(null)}
        />
      )}
    </div>
  );
}
