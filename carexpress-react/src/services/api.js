const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API_PREFIX = "/api/v1";
const SESSION_STORAGE_KEY = "carexpress_session";
let workingApiBaseUrl = null;

function normalizeBaseUrl(url) {
  return (url || "").trim().replace(/\/$/, "");
}

function isLocalHostName(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function isLikelyNetworkError(error) {
  return error instanceof TypeError;
}

function buildApiCandidates() {
  const candidates = [];
  const configured = normalizeBaseUrl(API_BASE_URL);

  if (workingApiBaseUrl !== null) {
    candidates.push(workingApiBaseUrl);
  }

  if (configured !== "") {
    try {
      const configuredUrl = new URL(configured);
      const browser = typeof window !== "undefined" ? window.location : null;
      const browserIsHttps = browser?.protocol === "https:";
      const configuredIsHttp = configuredUrl.protocol === "http:";
      const configuredIsLocal = isLocalHostName(configuredUrl.hostname);

      // In production HTTPS contexts, avoid forcing an insecure/non-local API origin.
      if (!(browserIsHttps && configuredIsHttp && !configuredIsLocal)) {
        candidates.push(configured);
      }
    } catch {
      candidates.push(configured);
    }
  }

  const browser = typeof window !== "undefined" ? window.location : null;
  if (browser && browser.origin) {
    candidates.push(browser.origin);
  }

  // Local development fallbacks when env vars are missing or incorrect.
  candidates.push("http://127.0.0.1:8000", "http://localhost:8000", "");

  return Array.from(new Set(candidates.map(normalizeBaseUrl)));
}

async function fetchWithApiFallback(path, options) {
  const candidates = buildApiCandidates();
  let lastNetworkError = null;
  let lastResponse = null;

  for (const baseUrl of candidates) {
    try {
      const response = await fetch(`${baseUrl}${API_PREFIX}${path}`, options);

      if (response.ok && isUnexpectedHtmlResponse(`${API_PREFIX}${path}`, response)) {
        lastResponse = response;
        continue;
      }

      workingApiBaseUrl = baseUrl;
      return response;
    } catch (error) {
      if (!isLikelyNetworkError(error)) {
        throw error;
      }
      lastNetworkError = error;
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastNetworkError || new Error("Connexion API impossible.");
}

async function fetchAbsoluteWithApiFallback(url, options) {
  if (/^https?:\/\//i.test(url)) {
    return fetch(url, options);
  }

  const candidates = buildApiCandidates();
  let lastNetworkError = null;
  let lastResponse = null;

  for (const baseUrl of candidates) {
    try {
      const response = await fetch(`${baseUrl}${url}`, options);

      if (response.ok && isUnexpectedHtmlResponse(url, response)) {
        lastResponse = response;
        continue;
      }

      if (response.ok) {
        workingApiBaseUrl = baseUrl;
        return response;
      }

      lastResponse = response;
    } catch (error) {
      if (!isLikelyNetworkError(error)) {
        throw error;
      }

      lastNetworkError = error;
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastNetworkError || new Error("Connexion API impossible.");
}

function isUnexpectedHtmlResponse(url, response) {
  if (!url.startsWith("/api/")) {
    return false;
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();

  return contentType.includes("text/html");
}

export function getApiBaseUrl() {
  return workingApiBaseUrl ?? API_BASE_URL;
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

  let response;
  try {
    response = await fetchWithApiFallback(path, {
      ...options,
      headers,
    });
  } catch {
    const error = new Error("Impossible de contacter le serveur. Verifiez que l API backend est demarree et que l URL API est correcte.");
    error.status = 0;
    error.payload = null;
    error.fieldErrors = {};
    throw error;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (response.ok && payload === null) {
    const error = new Error("Le serveur a renvoye une reponse invalide. Verifiez que l API backend repond bien en JSON.");
    error.status = response.status;
    error.payload = null;
    error.fieldErrors = {};
    throw error;
  }

  if (!response.ok) {
    const firstFieldError = payload?.errors
      ? Object.values(payload.errors).flat().find(Boolean)
      : null;
    const error = new Error(firstFieldError || payload?.message || "Une erreur est survenue lors de l'appel API.");
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

  let response;
  try {
    response = await fetchWithApiFallback(path, {
      method: "GET",
      headers,
    });
  } catch {
    throw new Error("Impossible de contacter le serveur pour telecharger le fichier.");
  }

  if (!response.ok) {
    throw await buildDownloadError(response, "Impossible de recuperer le fichier.");
  }

  const blob = await response.blob();
  const filename = resolveFilenameFromHeaders(response.headers);

  return {
    blob,
    filename,
    url: URL.createObjectURL(blob),
    mimeType: blob.type,
  };
}

export async function apiDownloadUrl(url) {
  const session = readSession();
  const headers = {};

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  let response;
  try {
    response = await fetchAbsoluteWithApiFallback(url, {
      method: "GET",
      headers,
    });
  } catch {
    throw new Error("Impossible de contacter le serveur pour recuperer le fichier.");
  }

  if (!response.ok) {
    throw await buildDownloadError(response, "Impossible de recuperer le fichier.");
  }

  const blob = await response.blob();
  const filename = resolveFilenameFromHeaders(response.headers);

  return {
    blob,
    filename,
    url: URL.createObjectURL(blob),
    mimeType: blob.type,
  };
}

function resolveFilenameFromHeaders(headers) {
  const contentDisposition = headers.get("content-disposition") || "";
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const asciiMatch = contentDisposition.match(/filename="?([^"]+)"?/i);

  return asciiMatch?.[1] || "document";
}

async function buildDownloadError(response, fallbackMessage) {
  let payload = null;

  try {
    payload = await response.clone().json();
  } catch {
    payload = null;
  }

  const error = new Error(payload?.message || fallbackMessage);
  error.status = response.status;
  error.payload = payload;

  return error;
}
