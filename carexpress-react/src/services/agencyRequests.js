import { apiDownload, apiDownloadUrl, apiRequest } from "./api";

export async function createAgencyRequest(formData) {
  const payload = new FormData();

  payload.append("company", formData.company || "");
  payload.append("email", formData.email || "");
  payload.append("phone", formData.phone || "");
  payload.append("city", formData.city || "");
  payload.append("activity", formData.activity || "Location et vente");
  payload.append("manager_name", formData.managerName || "");
  payload.append("district", formData.district || "");
  payload.append("address", formData.address || "");
  payload.append("ninea", formData.ninea || "");
  payload.append("color", formData.color || "#D40511");
  if (formData.logo) {
    payload.append("logo", formData.logo);
  }
  payload.append("password", formData.password || "");
  payload.append("password_confirmation", formData.confirmPassword || "");

  (formData.documents || []).forEach((file) => {
    payload.append("documents[]", file);
  });

  const response = await apiRequest("/demandes-enregistrement-agence", {
    method: "POST",
    body: payload,
  });

  return response.data;
}

export async function getAgencyRequests() {
  const response = await apiRequest("/administration/messages-demandes-agence");
  return response.data || [];
}

export async function getAgencyRequest(requestId) {
  const response = await apiRequest(`/administration/messages-demandes-agence/${requestId}`);
  return response.data;
}

export async function approveAgencyRequest(requestId) {
  const response = await apiRequest(`/administration/messages-demandes-agence/${requestId}/enregistrer`, {
    method: "POST",
  });
  return response.data;
}

export async function markAgencyRequestAsRead(requestId) {
  return getAgencyRequest(requestId);
}

export async function openAgencyRequestDocument(requestId, documentId) {
  return openAgencyRequestDocumentAtUrl(`/administration/messages-demandes-agence/${requestId}/documents/${documentId}/telecharger`);
}

export async function openAgencyRequestDocumentAtUrl(downloadUrl) {
  const previewWindow = window.open("", "_blank", "noopener,noreferrer");
  const file = downloadUrl.startsWith("http")
    ? await apiDownloadUrl(downloadUrl)
    : await apiDownload(downloadUrl);
  const url = file.url;

  if (previewWindow) {
    previewWindow.location.href = url;
    previewWindow.focus();
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return file;
}

export async function downloadAgencyRequestDocument(requestId, documentId) {
  return downloadAgencyRequestDocumentAtUrl(`/administration/messages-demandes-agence/${requestId}/documents/${documentId}/telecharger`);
}

export async function downloadAgencyRequestDocumentAtUrl(downloadUrl) {
  const file = downloadUrl.startsWith("http")
    ? await apiDownloadUrl(downloadUrl)
    : await apiDownload(downloadUrl);
  const link = document.createElement("a");
  link.href = file.url;
  link.download = file.filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(file.url), 1000);
  return file;
}

export async function loadAgencyRequestLogo(logoUrl) {
  return apiDownloadUrl(logoUrl);
}
