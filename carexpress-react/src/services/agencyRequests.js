import { apiDownload, apiDownloadUrl, apiRequest } from "./api";

function isDirectUrl(url) {
  return typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/api/"));
}

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

export async function createAgency(data) {
  const response = await apiRequest("/administration/agences", {
    method: "POST",
    body: JSON.stringify(data),
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

  try {
    const file = isDirectUrl(downloadUrl)
      ? await apiDownloadUrl(downloadUrl)
      : await apiDownload(downloadUrl);

    if (previewWindow) {
      previewWindow.document.open();
      previewWindow.document.write(buildPreviewDocument(file));
      previewWindow.document.close();
      previewWindow.focus();
    } else {
      const fallbackWindow = window.open("", "_blank");
      if (fallbackWindow) {
        fallbackWindow.document.open();
        fallbackWindow.document.write(buildPreviewDocument(file));
        fallbackWindow.document.close();
      }
    }

    return file;
  } catch (error) {
    if (previewWindow) {
      previewWindow.close();
    }
    throw error;
  }
}

export async function downloadAgencyRequestDocument(requestId, documentId) {
  return downloadAgencyRequestDocumentAtUrl(`/administration/messages-demandes-agence/${requestId}/documents/${documentId}/telecharger`);
}

export async function downloadAgencyRequestDocumentAtUrl(downloadUrl) {
  const file = isDirectUrl(downloadUrl)
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
  if (!logoUrl) {
    throw new Error("Logo URL manquante.");
  }

  return isDirectUrl(logoUrl) ? apiDownloadUrl(logoUrl) : apiDownload(logoUrl);
}

function buildPreviewDocument(file) {
  const safeTitle = escapeHtml(file.filename || "Document");
  const url = file.url;
  const mimeType = String(file.mimeType || "").toLowerCase();
  const isImage = mimeType.startsWith("image/");
  const isPdf = mimeType === "application/pdf";
  const isText = mimeType.startsWith("text/");

  let body = `
    <div style="padding:24px;color:#17130f;font:16px/1.5 system-ui,sans-serif;">
      <p>Apercu non disponible pour ce fichier.</p>
      <p><a href="${url}" download="${safeTitle}">Telecharger le fichier</a></p>
    </div>
  `;

  if (isImage) {
    body = `
      <div style="min-height:100vh;display:grid;place-items:center;background:#111;padding:24px;box-sizing:border-box;">
        <img src="${url}" alt="${safeTitle}" style="max-width:100%;max-height:100vh;object-fit:contain;" />
      </div>
    `;
  } else if (isPdf) {
    body = `
      <iframe
        src="${url}"
        title="${safeTitle}"
        style="width:100vw;height:100vh;border:none;background:#2b2b2b;"
      ></iframe>
    `;
  } else if (isText) {
    body = `
      <iframe
        src="${url}"
        title="${safeTitle}"
        style="width:100vw;height:100vh;border:none;background:#fff;"
      ></iframe>
    `;
  }

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <style>
      html, body { margin: 0; padding: 0; background: #111; }
      * { box-sizing: border-box; }
    </style>
  </head>
  <body>${body}</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
