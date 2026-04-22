import { apiRequest } from "./api";

/**
 * Fetch all conversations for the current user.
 * @param {'client'|'agency'} role
 */
export async function fetchConversations(role) {
  const path = role === "agency" ? "/agence/conversations" : "/client/conversations";
  const response = await apiRequest(path);
  return response.data || [];
}

/**
 * Open or retrieve an existing conversation (client only).
 * @returns {Object} conversation from API
 */
export async function openConversation({ vehicleId, type, subject, initialMessage }) {
  const response = await apiRequest("/client/conversations", {
    method: "POST",
    body: JSON.stringify({
      vehicle_id: vehicleId,
      type,
      subject,
      initial_message: initialMessage,
    }),
  });
  return response.data;
}

/**
 * Open or retrieve an existing conversation from the agency side.
 * @returns {Object} conversation from API
 */
export async function openAgencyConversation({ vehicleId, clientId, type, subject, initialMessage }) {
  const response = await apiRequest("/agence/conversations", {
    method: "POST",
    body: JSON.stringify({
      vehicle_id: vehicleId,
      client_id: clientId,
      type,
      subject,
      initial_message: initialMessage,
    }),
  });
  return response.data;
}

/**
 * Send a message in a conversation (client).
 */
export async function sendClientMessage(conversationId, content) {
  const response = await apiRequest(`/client/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  return response.data;
}

/**
 * Send a message in a conversation (agency).
 */
export async function sendAgencyMessage(conversationId, content) {
  const response = await apiRequest(`/agence/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  return response.data;
}

/**
 * Adapt an API conversation object to the shape expected by ChatPanel.
 */
export function adaptConversation(apiConversation) {
  const messages = (apiConversation.messages || []).map((msg) => ({
    id: String(msg.id),
    senderRole: msg.sender_role,
    senderName: msg.sender?.name || (msg.sender_role === "client" ? "Client" : "Agence"),
    text: msg.content,
    sentAt: msg.created_at,
  }));

  return {
    id: String(apiConversation.id),
    _apiId: apiConversation.id,
    subject: apiConversation.subject,
    agencyName: apiConversation.agency?.name || "Agence partenaire",
    clientName: apiConversation.client?.name || "Client",
    vehicleName: apiConversation.vehicle?.name || "Vehicule",
    lastMessageAt: apiConversation.last_message_at || apiConversation.created_at,
    messages,
  };
}
