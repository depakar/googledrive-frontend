import axios from "./axios.js";

export const getFoldersApi = async (parent = null) => {
  const res = await axios.get("/folders", {
    params: { parent },
  });
  return res.data;
};

export const createFolderApi = async (name, parent = null) => {
  const res = await axios.post("/folders", {
    name,
    parent,
  });
  return res.data;
};
export const deleteFolderApi = async (id) => {
  const res = await axios.delete(`/folders/${id}`);
  return res.data;
};
