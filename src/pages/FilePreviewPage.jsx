import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { downloadFileApi } from "../api/file.api";

export default function FilePreviewPage() {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const [fileUrl, setFileUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl;

    const fetchFile = async () => {
      try {
        const blob = await downloadFileApi(fileId);
        objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);

        setFile({
          name: "File Preview",
          mimetype: blob.type,
          size: blob.size,
        });
      } catch {
        alert("Failed to load preview");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    // ESC key support
    const handleEsc = (e) => {
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [fileId, navigate]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file?.name || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-500">
          Loading preview…
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <div className="truncate">
          <h2 className="font-medium truncate">
            {file?.name}
          </h2>
          <p className="text-xs text-gray-500">
            {file?.mimetype}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleDownload}
            className="text-green-600 hover:underline"
          >
            Download
          </button>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            Close
          </button>
        </div>
      </header>

      {/* PREVIEW BODY */}
      <main className="flex-1 bg-gray-900 flex items-center justify-center">
        {file?.mimetype === "application/pdf" ? (
          <iframe
            src={fileUrl}
            className="w-full h-full"
            title="PDF Preview"
          />
        ) : file?.mimetype?.startsWith("image/") ? (
          <img
            src={fileUrl}
            alt={file?.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-white text-center">
            <p className="text-lg">Preview not supported</p>
            <p className="text-sm mt-1">
              You can download the file instead
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
