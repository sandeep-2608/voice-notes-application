import axios from "axios";

// API URL points
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL ||
      "https://voice-notes-api-5cf9.onrender.com/api"
    : process.env.REACT_APP_API_URL || "http://localhost:5000/api";

console.log("🔗 API Base URL:", API_BASE_URL);
console.log("🌍 Environment:", process.env.NODE_ENV);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // 2 minutes for Render free tier
  withCredentials: false, // Set to false for CORS
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `📡 Making ${config.method?.toUpperCase()} request to:`,
      config.url
    );
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response received:", response.status);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

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
