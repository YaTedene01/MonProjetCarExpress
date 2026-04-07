const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API_PREFIX = "/api/v1";
const SESSION_STORAGE_KEY = "carexpress_session";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getSessionStorageKey() {
  return SESSION_STORAGE_KEY;
}

export function readSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export async function apiRequest(path, options = {}) {
  const session = readSession();
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = {
    Accept: "application/json",
    ...(!isFormData && options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    ...options,
    headers,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || "Une erreur est survenue lors de l'appel API.");
    error.status = response.status;
    error.payload = payload;
    error.fieldErrors = payload?.errors || {};
    throw error;
  }

  return payload;
}

export async function apiDownload(path) {
  const session = readSession();
  const headers = {};

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Impossible de recuperer le fichier.");
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get("content-disposition") || "";
  const match = contentDisposition.match(/filename="?([^"]+)"?/i);

  return {
    blob,
    filename: match?.[1] || "document",
    url: URL.createObjectURL(blob),
    mimeType: blob.type,
  };
}
