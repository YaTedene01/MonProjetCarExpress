import { useEffect, useState } from "react";
import { authenticate, getAuthenticatedUser, logout } from "../services/auth";
import { readSession } from "../services/api";

const initialChatThreads = [
  {
    id: 'conv-prado-moussa',
    subject: 'Toyota Prado 2021 · Location',
    agencyName: 'Dakar Auto Services',
    clientName: 'Moussa Diallo',
    vehicleName: 'Toyota Prado 2021',
    lastMessageAt: '2026-04-01T09:20:00',
    messages: [
      { id: 'm1', senderRole: 'client', senderName: 'Moussa Diallo', text: 'Bonjour, le Toyota Prado est-il disponible du 2 au 5 avril ?', sentAt: '2026-04-01T08:45:00' },
      { id: 'm2', senderRole: 'agency', senderName: 'Dakar Auto Services', text: 'Bonjour, oui il est disponible. Souhaitez-vous un retrait a l’aeroport DSS ?', sentAt: '2026-04-01T09:00:00' },
      { id: 'm3', senderRole: 'client', senderName: 'Moussa Diallo', text: 'Oui, a l’aeroport si possible vers 10h.', sentAt: '2026-04-01T09:20:00' },
    ],
  },
  {
    id: 'conv-kia-aissatou',
    subject: 'Kia Sportage 2019 · Achat',
    agencyName: 'Dakar Auto Services',
    clientName: 'Aissatou Dieng',
    vehicleName: 'Kia Sportage 2019',
    lastMessageAt: '2026-03-31T16:40:00',
    messages: [
      { id: 'm4', senderRole: 'client', senderName: 'Aissatou Dieng', text: 'Bonjour, puis-je programmer une visite pour la Kia Sportage cette semaine ?', sentAt: '2026-03-31T16:15:00' },
      { id: 'm5', senderRole: 'agency', senderName: 'Dakar Auto Services', text: 'Oui, une visite est possible jeudi apres-midi. Je peux vous confirmer le lieu.', sentAt: '2026-03-31T16:40:00' },
    ],
  },
];

export const useAppState = () => {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'select' | 'auth-client' | 'auth-agency' | 'auth-admin' | 'app-client' | 'app-agency' | 'app-admin'
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [agencyBranding, setAgencyBranding] = useState({
    name: "Dakar Auto Services",
    activity: "Location et vente",
    city: "Dakar Plateau",
    color: "#D40511",
    logoUrl: "",
  });
  const [chatThreads, setChatThreads] = useState(initialChatThreads);

  useEffect(() => {
    const session = readSession();

    if (!session?.token) {
      setAuthReady(true);
      return;
    }

    getAuthenticatedUser()
      .then((currentSession) => {
        setUser(currentSession.user);

        if (currentSession.agency) {
          setAgencyBranding({
            name: currentSession.agency.name || "Agence partenaire",
            activity: currentSession.agency.activity || "Location et vente",
            city: currentSession.agency.city || "Dakar",
            color: currentSession.agency.color || "#D40511",
            logoUrl: currentSession.agency.logo_url || "",
          });
        }

        if (currentSession.role === "client") setScreen("app-client");
        if (currentSession.role === "agency") setScreen("app-agency");
        if (currentSession.role === "admin") setScreen("app-admin");
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setAuthReady(true);
      });
  }, []);


  const handleGetStarted = () => setScreen('select');
  const handleRoleSelect = (role) => setScreen('auth-' + role);
  const handleBack = () => setScreen('landing');
  const handleBackToSelect = () => setScreen('select');
  const handleGoToLanding = () => setScreen('landing');

  const handleClientLogin = async (credentials) => {
    const session = await authenticate("client", credentials);
    setUser(session.user);
    setScreen('app-client');
  };
  const handleAgencyLogin = async (credentials) => {
    const session = await authenticate("agency", credentials);
    setUser(session.user);
    if (session.agency) {
      setAgencyBranding({
        name: session.agency.name || "Nouvelle agence",
        activity: session.agency.activity || "Location et vente",
        city: session.agency.city || "Dakar",
        color: session.agency.color || "#D40511",
        logoUrl: session.agency.logo_url || "",
      });
    }
    setScreen('app-agency');
  };
  const handleAdminLogin = async (credentials) => {
    const session = await authenticate("admin", credentials);
    setUser(session.user);
    setScreen('app-admin');
  };

  const handleRegisterAgency = (agencyData) => {
    setAgencyBranding(agencyData);
  };

  const handleClientLogout = async () => {
    await logout();
    setUser(null);
    setScreen('auth-client');
  };

  const handleAgencyLogout = async () => {
    await logout();
    setUser(null);
    setScreen('auth-agency');
  };

  const handleAdminLogout = async () => {
    await logout();
    setUser(null);
    setScreen('auth-admin');
  };

  const sendChatMessage = ({ threadId, senderRole, senderName, text }) => {
    const cleanText = text?.trim();
    if (!cleanText) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderRole,
      senderName,
      text: cleanText,
      sentAt: new Date().toISOString(),
    };

    setChatThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              lastMessageAt: newMessage.sentAt,
              messages: [...thread.messages, newMessage],
            }
          : thread
      )
    );
  };

  return {
    screen,
    authReady,
    setScreen,
    user,
    setUser,
    agencyBranding,
    setAgencyBranding,
    chatThreads,
    setChatThreads,
    handleGetStarted,
    handleRoleSelect,
    handleBack,
    handleBackToSelect,
    handleGoToLanding,
    handleClientLogin,
    handleAgencyLogin,
    handleAdminLogin,
    handleRegisterAgency,
    handleClientLogout,
    handleAgencyLogout,
    handleAdminLogout,
    sendChatMessage,
  };
};
