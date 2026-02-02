import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { uploadFileApi } from "../api/file.api";

export default function UploadDropzone({
  currentFolder,
  onUploadSuccess,
}) {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles?.[0];
      if (!file) {
        toast.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      // ✅ Only send folderId when inside a folder
      if (currentFolder) {
        formData.append("folderId", currentFolder);
      }

      const toastId = toast.loading("Uploading...");

      try {
        await uploadFileApi(formData);
        toast.success("File uploaded", { id: toastId });
        onUploadSuccess?.();
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(
          error?.response?.data?.message || "Upload failed",
          { id: toastId }
        );
      }
    },
    [currentFolder, onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      multiple: false,
    });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-6 rounded mb-4 text-center cursor-pointer transition ${
        isDragActive
          ? "bg-blue-50 border-blue-400"
          : "bg-white border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-gray-600">
        Drag & drop a file here, or click to upload
      </p>
    </div>
  );
}
