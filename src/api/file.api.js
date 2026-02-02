import axios from "./axios.js";

export const getFilesApi = async (folderId = null) => {
  const res = await axios.get("/files", {
    params: { folder: folderId },
  });
  return res.data;
};
export const uploadFileApi = async (formData) => {
  const res = await axios.post("/files/upload", formData);
  return res.data;
};
export const deleteFileApi = async (id) => {
  const res = await axios.delete(`/files/${id}`);
  return res.data;
};

export const downloadFileApi = async (id) => {
  const res = await axios.get(`/files/download/${id}`, {
    responseType: "blob",
  });
  return res.data;
};
