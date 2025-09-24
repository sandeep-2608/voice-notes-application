import axios from "axios";

// Simple API URL detection
const API_BASE_URL = window.location.hostname.includes("vercel.app")
  ? "/api"
  : "http://localhost:5000/api";

console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout for Vercel
});

export const getAllNotes = async () => {
  try {
    const response = await api.get("/notes");
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(`Failed to load notes: ${error.message}`);
  }
};

export const createNote = async (noteData) => {
  try {
    const response = await api.post("/notes", noteData);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(`Failed to save note: ${error.message}`);
  }
};

export const updateNote = async (id, noteData) => {
  try {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(`Failed to update note: ${error.message}`);
  }
};

export const deleteNote = async (id) => {
  try {
    await api.delete(`/notes/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete note: ${error.message}`);
  }
};

export const generateSummary = async (id) => {
  try {
    const response = await api.post(`/notes/${id}/summary`);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
};
