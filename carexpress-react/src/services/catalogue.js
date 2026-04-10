import { apiRequest } from "./api";

export async function fetchCatalogueVehicles(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });

  const query = params.toString();
  const response = await apiRequest(`/catalogue/vehicules${query ? `?${query}` : ""}`);
  return response.data || [];
}

export async function checkVehicleAvailability(vehicleId, pickupDate, returnDate) {
  const params = new URLSearchParams({
    pickup_date: pickupDate,
    return_date: returnDate,
  });

  const response = await apiRequest(`/catalogue/vehicules/${vehicleId}/verifier-disponibilite?${params.toString()}`);
  return response.data;
}

export async function createReservation(payload) {
  const response = await apiRequest("/client/reservations", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function createPurchaseRequest(payload) {
  const response = await apiRequest("/client/demandes-achat", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function fetchClientReservations() {
  const response = await apiRequest("/client/reservations");
  return response.data || [];
}

export async function fetchClientPurchaseRequests() {
  const response = await apiRequest("/client/demandes-achat");
  return response.data || [];
}

export async function fetchAgencyDashboard() {
  const response = await apiRequest("/agence/tableau-de-bord");
  return response.data || {};
}

export async function fetchAgencyAlerts() {
  const response = await apiRequest("/agence/alertes");
  return response.data || [];
}

export async function fetchAgencyVehicles() {
  const response = await apiRequest("/agence/vehicules");
  return response.data || [];
}

export async function createAgencyVehicle(payload) {
  const response = await apiRequest("/agence/vehicules", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateAgencyVehicle(vehicleId, payload) {
  const response = await apiRequest(`/agence/vehicules/${vehicleId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function fetchAdminDashboard() {
  const response = await apiRequest("/administration/tableau-de-bord");
  return response.data || {};
}

export async function fetchAdminUsers() {
  const response = await apiRequest("/administration/utilisateurs");
  return response.data || [];
}

export async function fetchAdminAgencies() {
  const response = await apiRequest("/administration/agences");
  return response.data || [];
}

export async function createAdminAgency(payload) {
  const response = await apiRequest("/administration/agences", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}
