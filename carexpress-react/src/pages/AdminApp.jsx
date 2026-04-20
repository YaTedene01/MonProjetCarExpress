import { useEffect, useMemo, useRef, useState } from "react";
import { Topbar, BottomNav, ProfileMenuItem, Input, FormField, Select, Btn, Notification } from "../components/UI";
import { AgencyProfilePage } from "../components/VehicleDetail";
import ChatPanel from "../components/ChatPanel";
import { adaptAdminAgency, adaptAdminUser } from "../services/adapters";
import { fetchAdminAgencies, fetchAdminDashboard, fetchAdminUsers } from "../services/catalogue";
import { approveAgencyRequest, downloadAgencyRequestDocument, downloadAgencyRequestDocumentAtUrl, getAgencyRequests, loadAgencyRequestLogo, openAgencyRequestDocument, openAgencyRequestDocumentAtUrl } from "../services/agencyRequests";

const S = {
  red: "#D40511",
  redSoft: "rgba(212,5,17,0.08)",
  black: "#131313",
  text: "#17130f",
  text2: "#5f5750",
  text3: "#8f877f",
  border: "rgba(24,21,18,0.1)",
  borderStrong: "rgba(24,21,18,0.16)",
  bg: "#f5efe8",
  panel: "rgba(255,255,255,0.88)",
  panelStrong: "rgba(255,255,255,0.96)",
  success: "#1a7a2e",
  successSoft: "#e6f4ea",
  amber: "#ffcc00",
  amberSoft: "rgba(255,204,0,0.18)",
  blue: "#3b82f6",
  blueSoft: "rgba(59,130,246,0.12)",
};

const agencies = [
  { name: "AutoSud SN", city: "Thies", type: "Location", status: "En attente", docs: "NINEA recu, verification KYC", revenue: "320 000 F" },
  { name: "MobileCar", city: "Dakar", type: "Vente", status: "Active", docs: "Conforme", revenue: "1,4 M F" },
  { name: "TransPlus", city: "Saint-Louis", type: "Les deux", status: "Active", docs: "Conforme", revenue: "890 000 F" },
  { name: "Dakar Auto Services", city: "Dakar", type: "Les deux", status: "Active", docs: "Conforme", revenue: "1,2 M F" },
];

const users = [
  { name: "Moussa Diallo", tel: "+221 77 123 45 67", role: "Client", status: "Actif" },
  { name: "Fatou Sow", tel: "+221 76 987 65 43", role: "Agence", status: "Actif" },
  { name: "Ibrahima Ba", tel: "+221 70 456 78 90", role: "Client", status: "Inactif" },
  { name: "Aissatou Dieng", tel: "+221 77 456 12 34", role: "Client", status: "Actif" },
  { name: "Cheikh Ndiaye", tel: "+221 76 321 54 78", role: "Agence", status: "Actif" },
];

const txTrend = [
  { label: "Jan", amount: 28 },
  { label: "Fev", amount: 34 },
  { label: "Mar", amount: 46 },
  { label: "Avr", amount: 42 },
  { label: "Mai", amount: 54 },
  { label: "Juin", amount: 62 },
];

const moderationAlerts = [
  { label: "Agences a valider", value: 3, tone: "amber" },
  { label: "Annonces a revoir", value: 5, tone: "red" },
  { label: "Paiements a verifier", value: 2, tone: "blue" },
];

const adminAlerts = [
  { type: "Signalement client", title: "Moussa Diallo a signale un retard de restitution", detail: "Toyota Prado 2021 · Ticket prioritaire a traiter avant 18:00", tone: "red" },
  { type: "Action a venir", title: "3 agences attendent une validation KYC", detail: "Verifier les dossiers AutoSud SN, Ndiaye Cars et Saloum Auto", tone: "amber" },
  { type: "Echeance", title: "Maintenance de supervision prevue demain", detail: "Fenetre de controle plateforme · 03 avril 2026 a 02:00", tone: "blue" },
];

export default function AdminApp({ onLogout, onRegisterAgency, agencyBranding, chatThreads, sendChatMessage, onGoToLanding }) {
  const [page, setPage] = useState("home");
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [adminSearch, setAdminSearch] = useState("");
  const [apiAgencies, setApiAgencies] = useState(agencies);
  const [apiUsers, setApiUsers] = useState(users);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [dashboardAlerts, setDashboardAlerts] = useState(adminAlerts);
  const [agencyRequests, setAgencyRequests] = useState([]);
  const [agencyRequestsLoading, setAgencyRequestsLoading] = useState(true);
  const [agencyRequestsError, setAgencyRequestsError] = useState("");
  const [approvingRequestId, setApprovingRequestId] = useState(null);
  const [requestActionError, setRequestActionError] = useState("");
  const [requestActionSuccess, setRequestActionSuccess] = useState("");
  const [liveNotif, setLiveNotif] = useState(null);
  const hasLoadedRequestsRef = useRef(false);
  const knownRequestIdsRef = useRef(new Set());

  const loadAdminData = async ({ silent = false } = {}) => {
    if (!silent) {
      setAgencyRequestsLoading(true);
    }

    const [agencyRows, userRows, dashboard] = await Promise.all([
      fetchAdminAgencies().catch(() => []),
      fetchAdminUsers().catch(() => []),
      fetchAdminDashboard().catch(() => null),
    ]);

    if (agencyRows.length) {
      setApiAgencies(agencyRows.map((agency) => adaptAdminAgency(agency)));
    } else if (!silent) {
      setApiAgencies(agencies);
    }

    if (userRows.length) {
      setApiUsers(userRows.map((user) => adaptAdminUser(user)));
    } else if (!silent) {
      setApiUsers(users);
    }

    if (dashboard?.metrics) {
      setDashboardMetrics(dashboard.metrics);
    } else if (!silent) {
      setDashboardMetrics(null);
    }

    if (dashboard?.alerts?.length) {
      setDashboardAlerts(dashboard.alerts.map((alert) => ({
        type: getAdminAlertType(alert),
        title: alert.title,
        detail: alert.message,
        tone: getAdminAlertTone(alert),
      })));
    } else if (!silent) {
      setDashboardAlerts(adminAlerts);
    }

    try {
      const requests = await getAgencyRequests();
      setAgencyRequests(requests);
      setAgencyRequestsError("");

      const nextKnownIds = new Set(requests.map((request) => request.id));

      if (hasLoadedRequestsRef.current) {
        const newPendingRequests = requests.filter((request) => (
          request.status === "pending"
          && !knownRequestIdsRef.current.has(request.id)
        ));

        if (newPendingRequests.length) {
          const latestRequest = newPendingRequests[0];
          setLiveNotif({
            icon: "🔔",
            title: "Nouvelle demande agence",
            msg: `${latestRequest.company || "Une agence"} a envoye une demande d'enregistrement. Rendez-vous sur l'accueil pour la traiter.`,
          });
        }
      }

      knownRequestIdsRef.current = nextKnownIds;
      hasLoadedRequestsRef.current = true;
    } catch (error) {
      setAgencyRequestsError(error?.message || "Impossible de recuperer les demandes agence pour le moment.");
    } finally {
      setAgencyRequestsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadAdminData({ silent: true });
    }, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadAdminData({ silent: true });
      }
    };

    window.addEventListener("focus", handleVisibilityChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleVisibilityChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const unreadAgencyRequests = useMemo(() => agencyRequests.filter((request) => !request.is_read).length, [agencyRequests]);

  const handleApproveAgencyRequest = async (requestId) => {
    setRequestActionError("");
    setRequestActionSuccess("");
    setApprovingRequestId(requestId);

    try {
      const approvedRequest = await approveAgencyRequest(requestId);
      setAgencyRequests((current) => current.map((item) => item.id === approvedRequest.id ? approvedRequest : item));
      setRequestActionSuccess("L'agence a ete enregistree avec succes.");

      await loadAdminData({ silent: true });
    } catch (error) {
      setRequestActionError(error?.message || "Impossible d'enregistrer cette agence pour le moment.");
      throw error;
    } finally {
      setApprovingRequestId(null);
    }
  };

  const handleOpenRequestDocument = async (requestId, documentId, downloadUrl) => {
    setRequestActionError("");
    setRequestActionSuccess("");

    try {
      if (downloadUrl) {
        await openAgencyRequestDocumentAtUrl(downloadUrl);
      } else {
        await openAgencyRequestDocument(requestId, documentId);
      }
    } catch (error) {
      setRequestActionError(error?.message || "Impossible d'ouvrir ce document.");
    }
  };

  const handleDownloadRequestDocument = async (requestId, documentId, downloadUrl) => {
    setRequestActionError("");
    setRequestActionSuccess("");

    try {
      if (downloadUrl) {
        await downloadAgencyRequestDocumentAtUrl(downloadUrl);
      } else {
        await downloadAgencyRequestDocument(requestId, documentId);
      }
    } catch (error) {
      setRequestActionError(error?.message || "Impossible de telecharger ce document.");
    }
  };

  const navItems = [
    { key: "home", icon: "home", label: "Accueil", badge: unreadAgencyRequests > 0 },
    { key: "users", icon: "users", label: "Utilisateurs" },
    { key: "agences", icon: "grid", label: "Agences" },
    { key: "messages", icon: "bell", label: "Messages" },
    { key: "systeme", icon: "settings", label: "Systeme" },
    { key: "profil", icon: "user", label: "Profil" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f7f2eb 0%, #faf7f3 46%, #f4eee7 100%)", paddingBottom: 92 }}>
      {selectedAgency && <AgencyProfilePage vehicle={{ agency: selectedAgency.name }} onClose={() => setSelectedAgency(null)} />}
      {liveNotif && <Notification notif={liveNotif} onClose={() => setLiveNotif(null)} />}
      <Topbar
        badge={{ label: "Super admin", bg: "rgba(17,17,17,0.08)", color: "#17130f" }}
        right="Supervision plateforme"
        onLogout={onLogout}
        onLogoClick={onGoToLanding}
        profile={{
          name: "Admin Car Express",
          email: "admin@carexpress.sn",
          subtitle: "Supervision plateforme",
        }}
      />
      <section className="container-responsive" style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 20px 0" }}>
        {page === "home" && <AdminHome agencyBranding={agencyBranding} adminSearch={adminSearch} setAdminSearch={setAdminSearch} agencies={apiAgencies} users={apiUsers} dashboardMetrics={dashboardMetrics} dashboardAlerts={dashboardAlerts} onAgencyCreated={(agency) => setApiAgencies((current) => [adaptAdminAgency(agency), ...current])} agencyRequests={agencyRequests} agencyRequestsLoading={agencyRequestsLoading} agencyRequestsError={agencyRequestsError} onRetryAgencyRequests={() => loadAdminData()} onApproveRequest={handleApproveAgencyRequest} approvingRequestId={approvingRequestId} onOpenDocument={handleOpenRequestDocument} onDownloadDocument={handleDownloadRequestDocument} requestActionError={requestActionError} requestActionSuccess={requestActionSuccess} />}
        {page === "users" && <AdminUsers adminSearch={adminSearch} setAdminSearch={setAdminSearch} users={apiUsers} agencies={apiAgencies} />}
        {page === "agences" && <AdminAgences onViewAgency={setSelectedAgency} adminSearch={adminSearch} setAdminSearch={setAdminSearch} agencies={apiAgencies} />}
        {page === "messages" && <AdminMessages chatThreads={chatThreads} sendChatMessage={sendChatMessage} />}
        {page === "systeme" && <AdminSysteme />}
        {page === "profil" && <AdminProfil onLogout={onLogout} />}
      </section>
      <BottomNav items={navItems} active={page} onChange={setPage} />
    </div>
  );
}

function AdminHome({ agencyBranding, adminSearch, setAdminSearch, agencies, users, dashboardMetrics, dashboardAlerts, onAgencyCreated, agencyRequests, agencyRequestsLoading, agencyRequestsError, onRetryAgencyRequests, onApproveRequest, approvingRequestId, onOpenDocument, onDownloadDocument, requestActionError, requestActionSuccess }) {
  const [adminTab, setAdminTab] = useState("dashboard");
  const pendingAgencyRequests = agencyRequests.filter((request) => request.status === "pending");

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <HeroPanel
        title="Supervisez les utilisateurs, les agences, les annonces et l'etat general de la plateforme."
        subtitle="Le tableau de bord central met en avant les chiffres globaux, les validations en attente, la sante du systeme et les actions de moderation."
      />

      <Panel title="Recherche super admin" subtitle="Retrouvez rapidement un utilisateur, une agence ou une action a suivre">
        <Input
          placeholder="Nom, telephone, ville, statut ou mot-cle..."
          value={adminSearch}
          onChange={(e) => setAdminSearch(e.target.value)}
        />
      </Panel>

      {agencyRequestsError ? (
        <Panel title="Notifications" subtitle="Demandes agence recues">
          <div style={{ padding: "14px 16px", borderRadius: 18, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.78)", display: "grid", gap: 10 }}>
            <div style={{ color: S.red, fontSize: 14, lineHeight: 1.6 }}>
              {agencyRequestsError}
            </div>
            <div>
              <button type="button" onClick={onRetryAgencyRequests} style={ghostButtonStyle()}>
                Reessayer
              </button>
            </div>
          </div>
        </Panel>
      ) : null}

      {!agencyRequestsError && !!pendingAgencyRequests.length && (
        <Panel title="Notifications" subtitle="Demandes agence recues">
          <div style={{ display: "grid", gap: 10 }}>
            {pendingAgencyRequests.slice(0, 2).map((request) => (
              <div key={request.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", padding: "14px 16px", borderRadius: 18, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.78)" }}>
                <div>
                  <div style={{ fontWeight: 700, color: S.text }}>
                    L'agence {request.company} vous a envoye une demande.
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13, color: S.text3 }}>
                    Verifiez-la dans <strong>Enregistrer agence</strong> depuis cette page d'accueil.
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <Chip tone="gold">{request.is_read ? "Consultee" : "Nouvelle"}</Chip>
                  <button type="button" onClick={() => setAdminTab("register")} style={ghostButtonStyle()}>
                    Voir la demande
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel noPadding>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: 16 }}>
          {[
            { key: "dashboard", label: "Tableau de bord" },
            { key: "register", label: "Enregistrer agence" },
            { key: "manage", label: "Gestion" },
          ].map((tab) => (
            <FilterChip key={tab.key} active={adminTab === tab.key} onClick={() => setAdminTab(tab.key)}>
              {tab.label}
            </FilterChip>
          ))}
        </div>
      </Panel>

      {adminTab === "dashboard" && <AdminDashboard adminSearch={adminSearch} agencies={agencies} users={users} dashboardMetrics={dashboardMetrics} dashboardAlerts={dashboardAlerts} />}
      {adminTab === "register" && <RegisterAgency agencyRequests={agencyRequests} agencyRequestsLoading={agencyRequestsLoading} agencyRequestsError={agencyRequestsError} onRetryAgencyRequests={onRetryAgencyRequests} onApproveRequest={onApproveRequest} approvingRequestId={approvingRequestId} onOpenDocument={onOpenDocument} onDownloadDocument={onDownloadDocument} requestActionError={requestActionError} requestActionSuccess={requestActionSuccess} />}
      {adminTab === "manage" && <ManageAgencies />}
    </div>
  );
}

function AdminDashboard({ adminSearch, agencies, users, dashboardMetrics, dashboardAlerts }) {
  const quickResults = useMemo(() => {
    const q = adminSearch.trim().toLowerCase();
    if (!q) return [];
    const agencyResults = agencies
      .filter((agency) => `${agency.name} ${agency.city} ${agency.status} ${agency.type}`.toLowerCase().includes(q))
      .map((agency) => ({ label: agency.name, sub: `${agency.city} · ${agency.status}`, tone: "agency" }));
    const userResults = users
      .filter((user) => `${user.name} ${user.tel} ${user.role} ${user.status}`.toLowerCase().includes(q))
      .map((user) => ({ label: user.name, sub: `${user.role} · ${user.tel}`, tone: "user" }));
    return [...agencyResults, ...userResults].slice(0, 6);
  }, [adminSearch]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={autoGrid(220)}>
        <MetricCard label="Utilisateurs" value={String(dashboardMetrics?.users_count ?? users.length)} sub="+18 aujourd'hui" accent={S.red} />
        <MetricCard label="Agences actives" value={String(dashboardMetrics?.active_agencies_count ?? agencies.filter((agency) => agency.status === "Active").length)} sub="structures actives" accent={S.black} />
        <MetricCard label="Annonces en ligne" value={String(dashboardMetrics?.vehicles_count ?? 0)} sub="location et vente" accent={S.amber} />
        <MetricCard label="Volume transactions" value={String((dashboardMetrics?.reservations_count || 0) + (dashboardMetrics?.purchase_requests_count || 0))} sub="operations enregistrees" accent={S.success} />
      </div>

      <div style={dashboardGrid()}>
        <Panel title="Evolution des transactions" subtitle="Volume mensuel des flux traites sur la plateforme">
          <TrendChart data={txTrend} />
        </Panel>

        <Panel title="Vision globale" subtitle="Lecture par pole metier">
          <SplitStats
            items={[
              { label: "Clients actifs", value: "1 018", pct: 82, color: S.red },
              { label: "Agences operationnelles", value: "34", pct: 74, color: S.black },
              { label: "Annonces conformes", value: "92%", pct: 92, color: S.success },
            ]}
          />
        </Panel>
      </div>

      <div style={dashboardGrid()}>
        <Panel title="Statuts a surveiller" subtitle="Moderation, validation et paiements">
          <div style={{ display: "grid", gap: 10 }}>
            {moderationAlerts.map((item) => (
              <StatusHighlight key={item.label} item={item} />
            ))}
          </div>
        </Panel>

        <Panel title="Centre d'alertes" subtitle="Signalements clients, actions a venir et echeances">
          <div style={{ display: "grid", gap: 10 }}>
            {dashboardAlerts.map((alert) => (
              <AdminAlertCard key={alert.title} alert={alert} />
            ))}
          </div>
        </Panel>
      </div>

      {adminSearch.trim() && (
        <Panel title="Resultats de recherche" subtitle="Synthese rapide pour le super admin">
          <div style={{ display: "grid", gap: 10 }}>
            {quickResults.length ? quickResults.map((result) => (
              <SearchResultRow key={`${result.label}-${result.sub}`} result={result} />
            )) : <EmptyText>Aucun resultat pour cette recherche.</EmptyText>}
          </div>
        </Panel>
      )}

      <div style={dashboardGrid()}>
        <Panel title="Agences recentes" subtitle="Dernieres structures ajoutees ou modifiees">
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: "min(640px, 100%)", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Agence", "Ville", "Type", "Statut"].map((head) => <th key={head} style={tableHeadStyle()}>{head}</th>)}
                </tr>
              </thead>
              <tbody>
                {agencies.slice(0, 4).map((agency) => (
                  <tr key={agency.name}>
                    <td style={tableCellStyle()}>
                      <div style={{ fontWeight: 600, color: S.text }}>{agency.name}</div>
                      <div style={{ fontSize: 12, color: S.text3, marginTop: 3 }}>{agency.docs}</div>
                    </td>
                    <td style={tableCellStyle()}>{agency.city}</td>
                    <td style={tableCellStyle()}><Chip tone={agency.type === "Les deux" ? "dark" : "gold"}>{agency.type}</Chip></td>
                    <td style={tableCellStyle()}><StatusPill value={agency.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function getAdminAlertTone(alert) {
  const type = alert?.context?.type;
  if (type === "purchase_service_fee_paid") return "blue";
  if (type === "purchase_request_created") return "amber";
  return "red";
}

function getAdminAlertType(alert) {
  const type = alert?.context?.type;
  if (type === "purchase_service_fee_paid") return "Frais de service";
  if (type === "purchase_request_created") return "Demande d'achat";
  return "Notification";
}

function formatFileSize(size) {
  const value = Number(size || 0);

  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} Mo`;
  }

  return `${Math.max(1, Math.round(value / 1024))} Ko`;
}

function getDocumentLabel(document) {
  const extension = (document?.extension || "").toUpperCase();

  if (document?.mime_type === "application/pdf" || extension === "PDF") {
    return "PDF";
  }

  if ((document?.mime_type || "").startsWith("image/")) {
    return extension || "IMAGE";
  }

  return extension || "FICHIER";
}

function RegisterAgency({ agencyRequests, agencyRequestsLoading, agencyRequestsError, onRetryAgencyRequests, onApproveRequest, approvingRequestId, onOpenDocument, onDownloadDocument, requestActionError, requestActionSuccess }) {
  const sortedRequests = useMemo(() => {
    const requests = [...(agencyRequests || [])];
    const priority = { pending: 0, approved: 1, rejected: 2 };

    return requests.sort((left, right) => {
      const leftPriority = priority[left.status] ?? 9;
      const rightPriority = priority[right.status] ?? 9;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      return new Date(right.created_at || 0).getTime() - new Date(left.created_at || 0).getTime();
    });
  }, [agencyRequests]);

  return (
    <Panel title="Enregistrer une agence" subtitle="Demandes recues et statut d'enregistrement">
      <div style={{ display: "grid", gap: 14 }}>
        <SectionCard title="Demandes en attente">
          {requestActionError ? (
            <div style={{ marginBottom: 12, padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(212,5,17,0.22)", background: "rgba(212,5,17,0.08)", color: S.red, fontSize: 13, lineHeight: 1.6 }}>
              {requestActionError}
            </div>
          ) : null}
          {requestActionSuccess ? (
            <div style={{ marginBottom: 12, padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(26,122,46,0.22)", background: "rgba(26,122,46,0.1)", color: S.success, fontSize: 13, lineHeight: 1.6 }}>
              {requestActionSuccess}
            </div>
          ) : null}
          {agencyRequestsLoading ? (
            <EmptyText>Chargement des demandes agence...</EmptyText>
          ) : agencyRequestsError ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ color: S.red, fontSize: 14, lineHeight: 1.6 }}>{agencyRequestsError}</div>
              <div>
                <button type="button" onClick={onRetryAgencyRequests} style={ghostButtonStyle()}>
                  Recharger les demandes
                </button>
              </div>
            </div>
          ) : sortedRequests?.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {sortedRequests.map((request) => {
                const isApproved = request.status === "approved";
                const isPending = request.status === "pending";

                return (
                <div key={request.id} style={{ padding: "12px 14px", borderRadius: 16, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.76)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ fontWeight: 700, color: S.text }}>{request.company}</div>
                    <Chip tone={isApproved ? "green" : "gold"}>{isApproved ? "Agence enregistree" : "En attente"}</Chip>
                  </div>

                  <div style={{ marginTop: 10, display: "grid", gap: 5, fontSize: 13, color: S.text3, lineHeight: 1.6 }}>
                    <div><strong style={{ color: S.text2 }}>Nom agence:</strong> {request.company || "Non renseigne"}</div>
                    <div><strong style={{ color: S.text2 }}>Ville:</strong> {request.city || "Non renseignee"}</div>
                    <div><strong style={{ color: S.text2 }}>Email professionnel:</strong> {request.email || "Non renseigne"}</div>
                    <div><strong style={{ color: S.text2 }}>Telephone:</strong> {request.phone || "Non renseigne"}</div>
                    <div><strong style={{ color: S.text2 }}>Activite:</strong> {request.activity || "Non renseignee"}</div>
                    <div><strong style={{ color: S.text2 }}>Responsable:</strong> {request.manager_name || "Non renseigne"}</div>
                    <div><strong style={{ color: S.text2 }}>Quartier:</strong> {request.district || "Non renseigne"}</div>
                    <div><strong style={{ color: S.text2 }}>Adresse:</strong> {request.address || "Non renseignee"}</div>
                    <div><strong style={{ color: S.text2 }}>NINEA:</strong> {request.ninea || "Non renseigne"}</div>
                    <div><strong style={{ color: S.text2 }}>Couleur:</strong> {request.color || "Non renseignee"}</div>
                    <div><strong style={{ color: S.text2 }}>Statut:</strong> {isApproved ? "Agence enregistree" : "En attente"}</div>
                  </div>

                  {request.logo_url ? (
                    <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: S.text2 }}>Logo fourni</div>
                      <AgencyLogoPreview
                        logoUrl={request.logo_url}
                        company={request.company}
                        onOpen={() => onOpenDocument?.(request.id, "logo", request.logo_url)}
                        onDownload={() => onDownloadDocument?.(request.id, "logo", request.logo_download_url || request.logo_url)}
                      />
                    </div>
                  ) : null}

                  <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: S.text2 }}>
                      Documents fournis ({request.documents_count || request.documents?.length || 0})
                    </div>
                    {request.documents?.length ? request.documents.map((document) => (
                      <div key={`${request.id}-${document.id}`} style={{ padding: "10px 12px", borderRadius: 12, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.84)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                          <div>
                            <div style={{ fontWeight: 600, color: S.text, wordBreak: "break-word" }}>{document.name}</div>
                            <div style={{ marginTop: 4, fontSize: 12, color: S.text3 }}>
                              {document.mime_type} · {formatFileSize(document.size)}
                            </div>
                          </div>
                          <Chip tone={document.is_previewable ? "blue" : "dark"}>{getDocumentLabel(document)}</Chip>
                        </div>
                        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button type="button" onClick={() => onOpenDocument?.(request.id, document.id, document.preview_url || document.download_url)} style={ghostButtonStyle()}>
                            {document.is_previewable ? "Voir" : "Ouvrir"}
                          </button>
                          <button type="button" onClick={() => onDownloadDocument?.(request.id, document.id, document.download_url)} style={ghostButtonStyle()}>Telecharger</button>
                        </div>
                      </div>
                    )) : <div style={{ fontSize: 12, color: S.text3 }}>Aucun document joint.</div>}
                  </div>

                  <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => onApproveRequest?.(request.id)}
                      disabled={approvingRequestId === request.id || !isPending}
                      style={{
                        ...ghostButtonStyle(),
                        borderColor: isApproved ? S.borderStrong : S.success,
                        color: isApproved ? S.text3 : S.success,
                        opacity: approvingRequestId === request.id ? 0.7 : 1,
                        cursor: approvingRequestId === request.id ? "wait" : (!isPending ? "not-allowed" : "pointer"),
                      }}
                    >
                      {approvingRequestId === request.id ? "Enregistrement..." : (isApproved ? "Agence deja enregistree" : "Enregistrer l'agence")}
                    </button>
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <EmptyText>Aucune demande agence disponible pour le moment.</EmptyText>
          )}
        </SectionCard>
      </div>
    </Panel>
  );
}

function AgencyLogoPreview({ logoUrl, company, onOpen, onDownload }) {
  const [hasError, setHasError] = useState(false);
  const [resolvedLogoUrl, setResolvedLogoUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    setHasError(false);
    setResolvedLogoUrl("");

    if (!logoUrl) {
      setHasError(true);
      return undefined;
    }

    loadAgencyRequestLogo(logoUrl)
      .then((file) => {
        if (cancelled) {
          URL.revokeObjectURL(file.url);
          return;
        }

        objectUrl = file.url;
        setResolvedLogoUrl(file.url);
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true);
        }
      });

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [logoUrl]);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ width: 160, height: 160, borderRadius: 20, overflow: "hidden", border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.92)", display: "grid", placeItems: "center", boxShadow: "0 10px 24px rgba(24,21,18,0.06)" }}>
        {!hasError && resolvedLogoUrl ? (
          <img
            src={resolvedLogoUrl}
            alt={`Logo ${company}`}
            onError={() => setHasError(true)}
            style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff" }}
          />
        ) : !hasError ? (
          <div style={{ fontSize: 12, color: S.text3 }}>Chargement...</div>
        ) : (
          <div style={{ padding: 10, textAlign: "center", fontSize: 12, fontWeight: 700, color: S.text3, lineHeight: 1.4 }}>
            Logo indisponible
          </div>
        )}
      </div>
      {!hasError && resolvedLogoUrl ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={onOpen} style={ghostButtonStyle()}>
            Voir le logo
          </button>
          <button type="button" onClick={onDownload} style={ghostButtonStyle()}>
            Telecharger le logo
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ManageAgencies() {
  const [rows, setRows] = useState([
    { name: "AutoSud SN", city: "Thies", baseStatus: "En attente", type: "Location", action: "Valider", toggled: false },
    { name: "MobileCar", city: "Dakar", baseStatus: "Active", type: "Vente", action: "Suspendre", toggled: false },
    { name: "TransPlus", city: "Saint-Louis", baseStatus: "Active", type: "Les deux", action: "Suspendre", toggled: false },
    { name: "Dakar Auto Services", city: "Dakar", baseStatus: "Active", type: "Les deux", action: "Suspendre", toggled: false },
  ]);

  const act = (index) => {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, toggled: !row.toggled } : row)));
  };

  return (
    <Panel title="Gestion des agences" subtitle="Validation, suspension et suivi des statuts partenaires">
      <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", minWidth: "min(760px, 100%)", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Agence", "Type", "Statut", "Action"].map((head) => <th key={head} style={tableHeadStyle()}>{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.name}>
                <td style={tableCellStyle()}>
                  <div style={{ fontWeight: 600, color: S.text }}>{row.name}</div>
                  <div style={{ fontSize: 12, color: S.text3, marginTop: 3 }}>{row.city} · {getManagedAgencyStatus(row)}</div>
                </td>
                <td style={tableCellStyle()}><Chip tone={row.type === "Les deux" ? "dark" : "gold"}>{row.type}</Chip></td>
                <td style={tableCellStyle()}>
                  <StatusPill value={getManagedAgencyStatus(row)} />
                </td>
                <td style={tableCellStyle()}>
                  <button type="button" onClick={() => act(index)} style={actionButtonStyle(row, row.toggled)}>
                    {getManagedAgencyActionLabel(row)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function AdminUsers({ adminSearch, setAdminSearch, users, agencies }) {
  const filteredUsers = useMemo(() => {
    const q = adminSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) => `${user.name} ${user.tel} ${user.role} ${user.status}`.toLowerCase().includes(q));
  }, [adminSearch]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={autoGrid(210)}>
        <SoftMetric label="Utilisateurs actifs" value="1 018" sub="clients et partenaires" />
        <SoftMetric label="Comptes inactifs" value="222" sub="a relancer ou nettoyer" />
        <SoftMetric label="Agences dans la liste" value="34" sub="visibles dans la plateforme" />
      </div>

      <Panel title="Recherche utilisateurs" subtitle="Filtrez la liste des comptes en temps reel">
        <Input
          placeholder="Nom, telephone, role ou statut..."
          value={adminSearch}
          onChange={(e) => setAdminSearch(e.target.value)}
        />
      </Panel>

      <Panel title="Utilisateurs" subtitle="Liste simple avec nom, telephone, role et statut">
          <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "min(720px, 100%)", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Nom", "Telephone", "Role", "Statut"].map((head) => <th key={head} style={tableHeadStyle()}>{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.name}>
                  <td style={tableCellStyle()}>{user.name}</td>
                  <td style={tableCellStyle()}>{user.tel}</td>
                  <td style={tableCellStyle()}><Chip tone={user.role === "Agence" ? "dark" : "gold"}>{user.role}</Chip></td>
                  <td style={tableCellStyle()}><StatusPill value={user.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredUsers.length && <EmptyText>Aucun utilisateur ne correspond a cette recherche.</EmptyText>}
        </div>
      </Panel>
    </div>
  );
}

function AdminAgences({ onViewAgency, adminSearch, setAdminSearch, agencies }) {
  const [filter, setFilter] = useState("Tous");

  const filtered = useMemo(() => {
    const q = adminSearch.trim().toLowerCase();
    let results = agencies;
    if (filter === "Actives") results = results.filter((agency) => agency.status === "Active");
    if (filter === "En attente") results = results.filter((agency) => agency.status === "En attente");
    if (q) {
      results = results.filter((agency) => `${agency.name} ${agency.city} ${agency.type} ${agency.status} ${agency.docs} ${agency.revenue}`.toLowerCase().includes(q));
    }
    return results;
  }, [filter, adminSearch]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="Agences partenaires" subtitle="Pilotage des structures actives et en attente">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
          {["Tous", "Actives", "En attente"].map((item) => (
            <FilterChip key={item} active={filter === item} onClick={() => setFilter(item)}>{item}</FilterChip>
          ))}
        </div>

        <div style={autoGrid(200, 14)}>
          <SoftMetric label="Actives" value="31" sub="operationnelles" />
          <SoftMetric label="En attente" value="3" sub="a verifier" />
          <SoftMetric label="Volume moyen" value="1,1 M F" sub="revenu mensuel par agence" />
        </div>
      </Panel>

      <Panel title="Recherche agences" subtitle="Nom, ville, type, statut ou documents">
        <Input
          placeholder="Rechercher une agence..."
          value={adminSearch}
          onChange={(e) => setAdminSearch(e.target.value)}
        />
      </Panel>

      <Panel title="Liste des agences" subtitle="Vue metier plus lisible avec statut, ville et volume">
          <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "min(780px, 100%)", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Agence", "Ville", "Type", "Statut", "Revenu", "Action"].map((head) => <th key={head} style={tableHeadStyle()}>{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((agency) => (
                <tr key={agency.name}>
                  <td style={tableCellStyle()}>
                    <div style={{ fontWeight: 600, color: S.text }}>{agency.name}</div>
                    <div style={{ fontSize: 12, color: S.text3, marginTop: 3 }}>{agency.docs}</div>
                  </td>
                  <td style={tableCellStyle()}>{agency.city}</td>
                  <td style={tableCellStyle()}><Chip tone={agency.type === "Les deux" ? "dark" : "gold"}>{agency.type}</Chip></td>
                  <td style={tableCellStyle()}><StatusPill value={agency.status} /></td>
                  <td style={tableCellStyle()}>{agency.revenue}</td>
                  <td style={tableCellStyle()}>
                    <button
                      type="button"
                      onClick={() => {
                        if (agency.status === "Active") onViewAgency(agency);
                      }}
                      disabled={agency.status !== "Active"}
                      title={agency.status === "Active" ? "Voir l'agence" : "Disponible apres la premiere connexion de l'agence"}
                      style={{
                        ...ghostButtonStyle(),
                        opacity: agency.status === "Active" ? 1 : 0.45,
                        cursor: agency.status === "Active" ? "pointer" : "not-allowed",
                      }}
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <EmptyText>Aucune agence ne correspond a cette recherche.</EmptyText>}
        </div>
      </Panel>
    </div>
  );
}

function AdminMessages({ chatThreads, sendChatMessage }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={autoGrid(220)}>
        <SoftMetric label="Conversations" value={String(chatThreads.length)} sub="echanges en cours" />
        <SoftMetric label="Messages recus" value={String(chatThreads.reduce((sum, thread) => sum + thread.messages.filter((item) => item.senderRole !== "admin").length, 0))} sub="clients et agences" />
        <SoftMetric label="Dossiers suivis" value={String(chatThreads.length)} sub="messages a traiter" />
      </div>

      <Panel title="Messagerie" subtitle="Envoyez et recevez des messages.">
        <ChatPanel
          threads={chatThreads}
          accent={S.red}
          currentRole="admin"
          currentName="Admin Car Express"
          listTitle="Conversations"
          emptyTitle="Aucune conversation"
          emptySubtitle="Les echanges avec les clients et les agences apparaitront ici."
          onSend={sendChatMessage}
        />
      </Panel>
    </div>
  );
}

function AdminSysteme() {
  const statuses = [
    { label: "Uptime", value: "99,9%", sub: "30 derniers jours", state: "ok" },
    { label: "API", value: "OK", sub: "Routes principales operationnelles", state: "ok" },
    { label: "Base de donnees", value: "OK", sub: "Latence moyenne 42 ms", state: "ok" },
    { label: "Paiements", value: "OK", sub: "Carte, mobile money et cash", state: "ok" },
  ];

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={autoGrid(220)}>
        {statuses.map((status) => (
          <MetricCard key={status.label} label={status.label} value={status.value} sub={status.sub} accent={status.state === "ok" ? S.success : S.red} />
        ))}
      </div>

      <Panel title="Etat de la plateforme" subtitle="Lecture systeme et prochaines operations">
        <div style={{ display: "grid", gap: 14 }}>
          <TimelineRow title="Derniere mise a jour" sub="15 mars 2026 · modules client et agence" />
          <TimelineRow title="Prochaine maintenance" sub="1 avril 2026 · 02:00 a 03:00" />
          <TimelineRow title="Supervision paiements" sub="Passerelles actives, aucun incident critique" />
        </div>
      </Panel>
    </div>
  );
}

function AdminProfil({ onLogout }) {
  const [activeSection, setActiveSection] = useState("Securite et 2FA");
  const detailContent = {
    "Securite et 2FA": {
      title: "Securite et 2FA",
      subtitle: "Etat des protections du compte administrateur.",
      items: [
        { label: "Acces administrateur", value: "Niveau complet" },
        { label: "2FA", value: "Active via application d'authentification" },
        { label: "Derniere verification", value: "Aujourd'hui a 08:24" },
        { label: "Recommandation", value: "Renouveler les codes de secours ce mois-ci" },
      ],
    },
    "Parametres plateforme": {
      title: "Parametres plateforme",
      subtitle: "Les reglages globaux actuellement suivis.",
      items: [
        { label: "Passerelles paiement", value: "Carte, Mobile Money et cash actives" },
        { label: "Moderation annonces", value: "Controle manuel sur les nouveaux partenaires" },
        { label: "Alertes systeme", value: "Notifications actives pour l'equipe admin" },
        { label: "Version suivie", value: "Modules client, agence et admin operationnels" },
      ],
    },
    "Journaux d'activite": {
      title: "Journaux d'activite",
      subtitle: "Resume des derniers evenements de supervision.",
      items: [
        { label: "Derniere action", value: "Validation agence AutoSud SN" },
        { label: "Derniere suspension", value: "Aucune aujourd'hui" },
        { label: "Derniere mise a jour", value: "15 mars 2026" },
        { label: "Volume", value: "124 evenements systeme aujourd'hui" },
      ],
    },
    "Documentation interne": {
      title: "Documentation interne",
      subtitle: "Rappels utiles pour l'administration de la plateforme.",
      items: [
        { label: "Guide moderation", value: "Validation agences et annonces" },
        { label: "Guide paiements", value: "Verification des flux et rapprochements" },
        { label: "Support interne", value: "Equipe technique Car Express" },
        { label: "Disponibilite", value: "Lun - Sam · 08:00 a 19:00" },
      ],
    },
  };
  const selectedDetail = detailContent[activeSection];

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="Profil administrateur" subtitle="Acces securite, journaux et documentation">
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 82, height: 82, borderRadius: 24, background: S.black, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>
            SA
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: S.text }}>Super Administrateur</div>
            <div style={{ marginTop: 4, color: S.text3 }}>admin@carexpress.sn</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              <Chip tone="dark">Acces complet</Chip>
              <Chip tone="success">2FA active</Chip>
              <Chip tone="gold">Derniere connexion aujourd'hui</Chip>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Raccourcis administrateur" subtitle="Configuration, securite et supervision" noPadding>
        <div style={{ paddingTop: 8 }}>
          <ProfileMenuItem icon="shield" label="Securite et 2FA" onClick={() => setActiveSection("Securite et 2FA")} />
          <ProfileMenuItem icon="settings" label="Parametres plateforme" onClick={() => setActiveSection("Parametres plateforme")} />
          <ProfileMenuItem icon="file" label="Journaux d'activite" onClick={() => setActiveSection("Journaux d'activite")} />
          <ProfileMenuItem icon="help" label="Documentation interne" onClick={() => setActiveSection("Documentation interne")} />
          <ProfileMenuItem icon="logout" label="Se deconnecter" onClick={onLogout} danger />
        </div>
      </Panel>

      <Panel title={selectedDetail.title} subtitle={selectedDetail.subtitle}>
        <div style={{ display: "grid", gap: 12 }}>
          {selectedDetail.items.map((item) => (
            <div key={item.label} style={{ display: "grid", gap: 5, padding: "14px 16px", borderRadius: 18, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.74)" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: S.text3 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: S.text, lineHeight: 1.6 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function HeroPanel({ title, subtitle }) {
  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      borderRadius: 28,
      background: "linear-gradient(135deg, #171311 0%, #2a1b17 48%, #402522 100%)",
      color: "#fff",
      border: `1px solid ${S.border}`,
      boxShadow: "0 28px 60px rgba(18,18,18,0.12)",
      padding: 24,
    }}>
      <div style={{ position: "absolute", top: -90, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.22), transparent 68%)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,5,17,0.16), transparent 70%)" }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.56)", marginBottom: 10 }}>Pilotage plateforme</div>
        <h1 style={{ fontSize: "clamp(2rem, 3.3vw, 3.5rem)", lineHeight: 0.98, margin: 0, maxWidth: 840 }}>{title}</h1>
        <p style={{ marginTop: 14, maxWidth: 780, color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 1.7 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children, noPadding }) {
  return (
    <section style={{ borderRadius: 24, border: `1px solid ${S.border}`, background: S.panel, boxShadow: "0 18px 50px rgba(24,21,18,0.06)", overflow: "hidden" }}>
      {(title || subtitle) && (
        <div style={{ padding: "18px 20px 0" }}>
          {title && <div style={{ fontSize: 20, fontWeight: 700, color: S.text }}>{title}</div>}
          {subtitle && <div style={{ marginTop: 6, color: S.text3, fontSize: 14 }}>{subtitle}</div>}
        </div>
      )}
      <div style={{ padding: noPadding ? 0 : 20 }}>{children}</div>
    </section>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ borderRadius: 20, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.74)", padding: 18 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: S.text, marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, accent }) {
  return (
    <div style={{ padding: 18, borderRadius: 22, border: `1px solid ${S.border}`, background: S.panelStrong }}>
      <div style={{ width: 38, height: 6, borderRadius: 999, background: accent, marginBottom: 14 }} />
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.text3 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 30, fontWeight: 800, color: S.text }}>{value}</div>
      <div style={{ marginTop: 4, fontSize: 13, color: S.text2 }}>{sub}</div>
    </div>
  );
}

function AdminAlertCard({ alert }) {
  const tone = alert.tone === "amber"
    ? { bg: S.amberSoft, color: "#8f6b00", dot: S.amber }
    : alert.tone === "blue"
      ? { bg: S.blueSoft, color: S.blue, dot: S.blue }
      : { bg: S.redSoft, color: S.red, dot: S.red };

  return (
    <div style={{ padding: "14px 16px", borderRadius: 18, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.82)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: tone.dot, display: "inline-block" }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: tone.color }}>{alert.type}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: S.text }}>{alert.title}</div>
      <div style={{ marginTop: 6, fontSize: 13, color: S.text2, lineHeight: 1.6 }}>{alert.detail}</div>
    </div>
  );
}

function SearchResultRow({ result }) {
  return (
    <div style={{ display: "grid", gap: 4, padding: "13px 14px", borderRadius: 16, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.74)" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: S.text }}>{result.label}</div>
      <div style={{ fontSize: 12, color: S.text3 }}>{result.sub}</div>
    </div>
  );
}

function EmptyText({ children }) {
  return <div style={{ paddingTop: 12, color: S.text3, fontSize: 13 }}>{children}</div>;
}

function SoftMetric({ label, value, sub }) {
  return (
    <div style={{ padding: 16, borderRadius: 18, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.72)" }}>
      <div style={{ fontSize: 11, color: S.text3, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700, color: S.text }}>{value}</div>
      <div style={{ marginTop: 3, color: S.text3, fontSize: 12 }}>{sub}</div>
    </div>
  );
}

function TrendChart({ data }) {
  const width = 520;
  const height = 220;
  const max = Math.max(...data.map((item) => item.amount));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - (item.amount / max) * 170 - 20;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: 240 }}>
        <defs>
          <linearGradient id="admin-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(212,5,17,0.28)" />
            <stop offset="100%" stopColor="rgba(212,5,17,0)" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((row) => (
          <line key={row} x1="0" x2={width} y1={20 + row * 50} y2={20 + row * 50} stroke="rgba(24,21,18,0.08)" />
        ))}
        <polyline fill="none" stroke={S.red} strokeWidth="4" points={points} strokeLinejoin="round" strokeLinecap="round" />
        <polygon fill="url(#admin-line)" points={`0,${height} ${points} ${width},${height}`} />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - (item.amount / max) * 170 - 20;
          return <circle key={item.label} cx={x} cy={y} r="6" fill="#fff" stroke={S.red} strokeWidth="3" />;
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        {data.map((item) => (
          <div key={item.label} style={{ display: "grid", gap: 4 }}>
            <span style={{ fontSize: 12, color: S.text3 }}>{item.label}</span>
            <strong style={{ color: S.text }}>{item.amount} M F</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitStats({ items }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 14 }}>
            <span style={{ color: S.text }}>{item.label}</span>
            <strong style={{ color: S.text }}>{item.value}</strong>
          </div>
          <div style={{ height: 12, borderRadius: 999, background: "rgba(24,21,18,0.06)", overflow: "hidden" }}>
            <div style={{ width: `${item.pct}%`, height: "100%", background: item.color, borderRadius: 999 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusHighlight({ item }) {
  const tone = item.tone === "amber"
    ? { bg: S.amberSoft, color: "#7b5a00" }
    : item.tone === "blue"
      ? { bg: S.blueSoft, color: S.blue }
      : { bg: S.redSoft, color: S.red };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", padding: "14px 16px", borderRadius: 18, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.76)" }}>
      <div>
        <div style={{ fontWeight: 600, color: S.text }}>{item.label}</div>
        <div style={{ marginTop: 3, fontSize: 13, color: S.text3 }}>Element necessitant une action de controle</div>
      </div>
      <span style={{ padding: "7px 12px", borderRadius: 999, background: tone.bg, color: tone.color, fontWeight: 700 }}>{item.value}</span>
    </div>
  );
}

function TimelineRow({ title, sub }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: S.black, marginTop: 6 }} />
      <div>
        <div style={{ fontWeight: 600, color: S.text }}>{title}</div>
        <div style={{ marginTop: 4, color: S.text3, fontSize: 14 }}>{sub}</div>
      </div>
    </div>
  );
}

function StatusPill({ value }) {
  const map = {
    Active: { bg: S.successSoft, color: S.success },
    Actif: { bg: S.successSoft, color: S.success },
    "En attente": { bg: S.amberSoft, color: "#7b5a00" },
    Inactif: { bg: "rgba(24,21,18,0.06)", color: S.text3 },
  };
  const tone = map[value] || { bg: "rgba(24,21,18,0.06)", color: S.text2 };
  return <span style={{ padding: "6px 10px", borderRadius: 999, background: tone.bg, color: tone.color, fontSize: 12, fontWeight: 600 }}>{value}</span>;
}

function Chip({ children, tone }) {
  const tones = {
    dark: { bg: S.black, color: "#fff" },
    gold: { bg: S.amberSoft, color: "#7b5a00" },
    success: { bg: S.successSoft, color: S.success },
  };
  const style = tones[tone] || { bg: "rgba(24,21,18,0.06)", color: S.text2 };
  return <span style={{ padding: "6px 10px", borderRadius: 999, background: style.bg, color: style.color, fontSize: 12, fontWeight: 600 }}>{children}</span>;
}

function FilterChip({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? S.black : S.borderStrong}`,
        background: active ? S.black : "rgba(255,255,255,0.7)",
        color: active ? "#fff" : S.text2,
        padding: "10px 16px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function autoGrid(min, gap = 16) {
  return { display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${Math.max(min, 140)}px, 1fr))`, gap };
}

function dashboardGrid() {
  return { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 };
}

function tableHeadStyle() {
  return {
    textAlign: "left",
    padding: "12px 14px",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: S.text3,
    borderBottom: `1px solid ${S.border}`,
  };
}

function tableCellStyle() {
  return {
    padding: "14px",
    borderBottom: `1px solid ${S.border}`,
    fontSize: 13,
    color: S.text2,
    verticalAlign: "top",
  };
}

function formGrid() {
  return { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 };
}

function ghostButtonStyle() {
  return {
    border: `1px solid ${S.borderStrong}`,
    background: "rgba(255,255,255,0.72)",
    color: S.text,
    padding: "8px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
  };
}

function getManagedAgencyStatus(row) {
  if (!row.toggled) return row.baseStatus;
  return row.action === "Valider" ? "Active" : "Suspendue";
}

function getManagedAgencyActionLabel(row) {
  if (!row.toggled) return row.action;
  return row.action === "Valider" ? "Annuler validation" : "Annuler suspension";
}

function actionButtonStyle(row, done) {
  const isValidateAction = row.action === "Valider";
  return {
    border: `1px solid ${done ? (isValidateAction ? "rgba(26,122,46,0.24)" : "rgba(59,130,246,0.24)") : isValidateAction ? S.black : S.borderStrong}`,
    background: done ? (isValidateAction ? "rgba(26,122,46,0.08)" : "rgba(59,130,246,0.08)") : isValidateAction ? S.black : "rgba(255,255,255,0.74)",
    color: done ? (isValidateAction ? S.success : S.blue) : isValidateAction ? "#fff" : S.text,
    padding: "9px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
  };
}
