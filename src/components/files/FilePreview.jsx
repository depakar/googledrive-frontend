import { useEffect, useState } from "react";
import { getFoldersApi } from "../api/folder.api";
import { getFilesApi } from "../api/file.api";
import FolderItem from "../components/folders/FolderItem";
import FileItem from "../components/files/FileItem";

export default function FolderView() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const folderData = await getFoldersApi(currentFolder);
      const fileData = await getFilesApi(currentFolder);

      setFolders(folderData);
      setFiles(fileData);
    };

    fetchData();
  }, [currentFolder]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        {currentFolder ? "Folder Contents" : "My Drive"}
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {folders.map((folder) => (
          <FolderItem
            key={folder._id}
            folder={folder}
            onClick={() => setCurrentFolder(folder._id)}
          />
        ))}

        {files.map((file) => (
          <FileItem key={file._id} file={file} />
        ))}
      </div>
    </div>
  );
}
