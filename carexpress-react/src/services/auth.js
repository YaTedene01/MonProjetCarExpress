import { apiRequest, clearSession, readSession, writeSession } from "./api";
import { createAgencyRequest } from "./agencyRequests";

function buildSession(data, roleOverride) {
  const user = data?.utilisateur || data;
  const agency = data?.agence || user?.agency || null;
  const role = roleOverride || user?.role;

  return {
    token: data?.token || readSession()?.token || null,
    role,
    user,
    agency,
  };
}

export async function authenticate(role, formData) {
  const mode = formData.mode || "login";

  if (role === "client") {
    const payload = mode === "signup"
      ? {
          name: formData.name || formData.email?.split("@")[0] || "Client Car Express",
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          device_name: "client-web",
        }
      : {
          identifier: formData.identifier,
          password: formData.password,
          device_name: "client-web",
        };

    const response = await apiRequest(
      mode === "signup" ? "/authentification/client/inscription" : "/authentification/client/connexion",
      { method: "POST", body: JSON.stringify(payload) }
    );

    if (mode === "signup") {
      return {
        success: true,
        requiresLogin: true,
      };
    }

    const session = buildSession(response.data, "client");
    writeSession(session);
    return session;
  }

  if (role === "agency") {
    if (formData.mode === "signup") {
      await createAgencyRequest(formData);

      return {
        success: true,
        requiresLogin: true,
      };
    }

    const response = await apiRequest("/authentification/agence/connexion", {
      method: "POST",
      body: JSON.stringify({
        identifier: formData.email,
        password: formData.password,
        device_name: "agency-web",
      }),
    });

    const session = buildSession(response.data, "agency");
    writeSession(session);
    return session;
  }

  const response = await apiRequest("/authentification/superadmin/connexion", {
    method: "POST",
    body: JSON.stringify({
      identifier: formData.email,
      password: formData.password,
      device_name: "admin-web",
    }),
  });

  const session = buildSession(response.data, "admin");
  writeSession(session);
  return session;
}

export async function getAuthenticatedUser() {
  const response = await apiRequest("/authentification/utilisateur-connecte");
  const current = readSession();
  const session = {
    token: current?.token || null,
    role: response.data?.role || current?.role || null,
    user: response.data,
    agency: response.data?.agency || current?.agency || null,
  };
  writeSession(session);
  return session;
}

export async function logout() {
  try {
    await apiRequest("/authentification/deconnexion", { method: "POST" });
  } finally {
    clearSession();
  }
}
