import { useEffect, useMemo, useState } from "react";
import { Topbar, BottomNav, ProfileMenuItem, Btn } from "../components/UI";
import landcruiserImg from "../assets/landcruiser.jpg";
import tucsonImg from "../assets/tucson.png";
import kiaImg from "../assets/kia.png";
import dusterImg from "../assets/duster.jpeg";
import ChatPanel from "../components/ChatPanel";
import { createAgencyVehicle, fetchAgencyAlerts, fetchAgencyDashboard, fetchAgencyVehicles, updateAgencyVehicle } from "../services/catalogue";
import { adaptAgencyVehicleRow } from "../services/adapters";

const S = {
  gold: "#f4c95d",
  goldSoft: "rgba(244, 201, 93, 0.16)",
  red: "#D40511",
  redSoft: "rgba(212, 5, 17, 0.08)",
  black: "#121212",
  text: "#17130f",
  text2: "#5f5750",
  text3: "#8f877f",
  border: "rgba(24, 21, 18, 0.1)",
  borderStrong: "rgba(24, 21, 18, 0.16)",
  bg: "#f4eee7",
  panel: "rgba(255,255,255,0.86)",
  panelStrong: "rgba(255,255,255,0.96)",
  success: "#1a7a2e",
  successSoft: "#e6f4ea",
  warning: "#ffcc00",
};

const initialAgencyVehicles = [
  { name: "Toyota Prado 2021", detail: "SUV · 7 places · 85 000 F / jour", status: "Disponible", type: "Location", revenue: "340 000 F", views: 128, urgent: false, images: [landcruiserImg] },
  { name: "Hyundai Tucson 2020", detail: "SUV · 5 places · 65 000 F / jour", status: "Loue", type: "Location", revenue: "520 000 F", views: 94, urgent: false, images: [tucsonImg] },
  { name: "Kia Sportage 2019", detail: "SUV · 74 000 km · 7 200 000 F", status: "En vente", type: "Vente", revenue: "Frais service 95 000 F", views: 67, urgent: true, images: [kiaImg] },
  { name: "Renault Duster 2022", detail: "SUV · 5 places · 55 000 F / jour", status: "Disponible", type: "Location", revenue: "165 000 F", views: 88, urgent: false, images: [dusterImg] },
  { name: "Toyota Hiace 2019", detail: "Minibus · 14 places · 180 000 F / jour", status: "Maintenance", type: "Location", revenue: "0 F", views: 43, urgent: true, images: [landcruiserImg] },
];

const agencyAlerts = [
  { read: false, title: "Nouvelle demande de location", sub: "Toyota Prado · Moussa Diallo · 2 au 5 avril · aeroport DSS", time: "Il y a 18 min", tone: "red" },
  { read: false, title: "Reservation confirmee", sub: "Hyundai Tucson · depart demain a 09:00 · paiement mobile money", time: "Il y a 1 heure", tone: "gold" },
  { read: false, title: "Manifestation d'interet achat", sub: "Kia Sportage · 2 acheteurs souhaitent visiter le vehicule", time: "Il y a 3 heures", tone: "gold" },
  { read: true, title: "Avis client recu", sub: "Toyota Prado · note 4,8/5 apres restitution", time: "Hier", tone: "neutral" },
];

const performanceBars = [
  { label: "Lun", value: 64 },
  { label: "Mar", value: 82 },
  { label: "Mer", value: 76 },
  { label: "Jeu", value: 88 },
  { label: "Ven", value: 92 },
  { label: "Sam", value: 74 },
  { label: "Dim", value: 58 },
];

const requestSteps = [
  { label: "Demandes recues", value: 38, color: "#17130f" },
  { label: "Dates verifiees", value: 29, color: "#5f5750" },
  { label: "Confirmees", value: 21, color: "#D40511" },
  { label: "Cloturees", value: 17, color: "#1a7a2e" },
];

export default function AgencyApp({ onLogout, branding, chatThreads, sendChatMessage, onGoToLanding }) {
  const [page, setPage] = useState("home");
  const [vehicles, setVehicles] = useState(initialAgencyVehicles);
  const [alerts, setAlerts] = useState(agencyAlerts);
  const [showNewListing, setShowNewListing] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const agencyBrand = branding || {
    name: "Dakar Auto Services",
    activity: "Location et vente",
    city: "Dakar Plateau",
    color: "#D40511",
    logoUrl: "",
  };

  const navItems = [
    { key: "home", icon: "home", label: "Accueil" },
    { key: "annonces", icon: "grid", label: "Annonces" },
    { key: "messages", icon: "bell", label: "Messages", badge: true },
    { key: "profil", icon: "user", label: "Profil" },
  ];

  useEffect(() => {
    Promise.all([
      fetchAgencyVehicles().catch(() => []),
      fetchAgencyDashboard().catch(() => null),
      fetchAgencyAlerts().catch(() => []),
    ]).then(([apiVehicles, dashboard, apiAlerts]) => {
      if (apiVehicles.length) {
        setVehicles(apiVehicles.map((vehicle) => adaptAgencyVehicleRow(vehicle)));
      }

      if (dashboard?.metrics) {
        setDashboardMetrics(dashboard.metrics);
      }

      if (apiAlerts.length) {
        setAlerts(apiAlerts.map((alert) => ({
          read: Boolean(alert.is_read),
          title: alert.title,
          sub: alert.message,
          time: formatAlertTime(alert.created_at),
          tone: "red",
        })));
      }
    });
  }, []);

  const handleCreateListing = async (listing) => {
    const created = await createAgencyVehicle(toAgencyVehiclePayload(listing));
    setVehicles((current) => [adaptAgencyVehicleRow(created), ...current]);
    setShowNewListing(false);
    setPage("annonces");
  };

  const handleUpdateListing = async (listing) => {
    const updated = await updateAgencyVehicle(editingVehicle.backendId, toAgencyVehiclePayload(listing));
    setVehicles((current) => current.map((item) => item.backendId === editingVehicle.backendId ? adaptAgencyVehicleRow(updated) : item));
    setEditingVehicle(null);
    setPage("annonces");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f7f1ea 0%, #fbf8f4 42%, #f4eee7 100%)", paddingBottom: 92 }}>
      {showNewListing && (
        <NewListingModal
          onClose={() => setShowNewListing(false)}
          onSubmit={handleCreateListing}
        />
      )}
      {editingVehicle && (
        <NewListingModal
          initialData={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSubmit={handleUpdateListing}
        />
      )}
      <Topbar
        badge={{ label: "Agence", bg: `${agencyBrand.color}18`, color: agencyBrand.color }}
        right="Espace partenaire"
        onLogout={onLogout}
        onLogoClick={onGoToLanding}
        profile={{
          name: agencyBrand.name,
          email: agencyBrand.activity,
          subtitle: agencyBrand.city,
        }}
      />
      <section className="container-responsive" style={{ maxWidth: 1360, margin: "0 auto", padding: "20px 20px 0" }}>
        {page === "home" && <AgencyHome setPage={setPage} vehicles={vehicles} alerts={alerts} onCreateListing={() => setShowNewListing(true)} branding={agencyBrand} dashboardMetrics={dashboardMetrics} />}
        {page === "annonces" && <AgencyAnnonces vehicles={vehicles} onCreateListing={() => setShowNewListing(true)} onEditVehicle={setEditingVehicle} onDeleteVehicle={(vehicleName) => setVehicles((current) => current.filter((item) => item.name !== vehicleName))} />}
        {page === "messages" && <AgencyMessages chatThreads={chatThreads} branding={agencyBrand} sendChatMessage={sendChatMessage} />}
        {page === "profil" && <AgencyProfil branding={agencyBrand} onLogout={onLogout} />}
        </section>
      <BottomNav items={navItems} active={page} onChange={setPage} />
    </div>
  );
}

function AgencyHome({ setPage, vehicles, alerts, onCreateListing, branding, dashboardMetrics }) {
  const occupancy = 84;

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <HeroPanel
        title="Pilotez vos locations, ventes et demandes depuis un seul espace."
        subtitle="Suivez vos vehicules actifs, vos demandes en attente, votre revenu mensuel et votre taux d'occupation avec une lecture plus directe."
        meta={[
          { label: "Agence", value: branding.name },
          { label: "Activite", value: branding.activity },
          { label: "Ville", value: branding.city },
        ]}
        ctaLabel="Publier une annonce"
        onAction={onCreateListing}
        accent={branding.color}
        logoUrl={branding.logoUrl}
      />

      <div style={autoGrid(220)}>
        <MetricCard label="Vehicules actifs" value={String(dashboardMetrics?.vehicles_count ?? vehicles.length)} sub="+2 ajoutes ce mois" accent={S.red} />
        <MetricCard label="Demandes recues" value={String((dashboardMetrics?.active_rentals || 0) + (dashboardMetrics?.purchase_requests_count || 0))} sub="location et achat" accent={S.black} />
        <MetricCard label="Revenus du mois" value={`${Number(dashboardMetrics?.monthly_revenue || 0).toLocaleString("fr-FR")} F`} sub="Location, achat et frais service" accent={S.gold} />
        <MetricCard label="Taux d'occupation" value={`${occupancy}%`} sub="Objectif mensuel 90%" accent={S.success} />
      </div>

      <div style={dashboardGrid()}>
        <Panel
          title="Occupation hebdomadaire"
          subtitle="Lecture rapide des jours les plus demandes"
          right={<Chip tone="success">+12% vs semaine derniere</Chip>}
        >
          <BarChart bars={performanceBars} accent={S.red} />
        </Panel>

        <Panel
          title="Entonnoir des demandes"
          subtitle="De la premiere demande a la remise vehicule"
          right={<Chip tone="gold">21 confirmations</Chip>}
        >
          <FunnelSteps steps={requestSteps} />
        </Panel>
      </div>

      <div style={dashboardGrid()}>
        <Panel
          title="Apercu des annonces"
          subtitle="Statut commercial et performance des vehicules"
          right={<ActionLink onClick={() => setPage("annonces")}>Voir toutes les annonces</ActionLink>}
        >
          <div style={{ display: "grid", gap: 10 }}>
            {vehicles.slice(0, 4).map((vehicle) => (
              <VehicleRow key={vehicle.name} vehicle={vehicle} />
            ))}
          </div>
        </Panel>

        <Panel
          title="Notifications agence"
          subtitle="Dernieres reservations et alertes importantes"
        >
          {alerts.length > 0 ? (
            <div style={{ display: "grid", gap: 10 }}>
              {alerts.slice(0, 4).map((alert) => (
                <AlertRow key={`${alert.title}-${alert.time}`} alert={alert} />
              ))}
            </div>
          ) : (
            <div style={{ color: S.text3, fontSize: 14 }}>Aucune notification pour le moment.</div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function AgencyAnnonces({ vehicles, onCreateListing, onEditVehicle, onDeleteVehicle }) {
  const [filter, setFilter] = useState("Tous");

  const filtered = useMemo(() => {
    if (filter === "Tous") return vehicles;
    return vehicles.filter((item) => item.type === filter);
  }, [filter, vehicles]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel
        title="Gestion des annonces"
        subtitle="Retrouvez vos annonces location et vente, leur statut et leur niveau d'interet."
        right={<Btn onClick={onCreateListing} small style={{ width: "auto", paddingInline: 18 }}>Nouvelle annonce</Btn>}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
          {["Tous", "Location", "Vente"].map((item) => (
            <FilterChip key={item} active={filter === item} onClick={() => setFilter(item)}>
              {item}
            </FilterChip>
          ))}
        </div>

        <div style={autoGrid(190, 14)}>
          <SoftMetric label="En ligne" value={String(vehicles.filter((item) => item.status !== "Maintenance").length)} sub="visibles maintenant" />
          <SoftMetric label="Loue" value="2" sub="en cours de reservation" />
          <SoftMetric label="En vente" value={String(vehicles.filter((item) => item.type === "Vente").length)} sub="dossiers ouverts" />
          <SoftMetric label="A relancer" value="4" sub="visiteurs sans suite" />
        </div>
      </Panel>

      <Panel
        title="Catalogue partenaire"
        subtitle="Un module plus clair pour suivre les annonces, leur statut et leur traction."
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "min(760px, 100%)" }}>
            <thead>
              <tr>
                {["Vehicule", "Type", "Statut", "Vues", "Revenu", "Action"].map((head) => (
                  <th key={head} style={tableHeadStyle()}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((vehicle) => (
                <tr key={vehicle.name}>
                  <td style={tableCellStyle()}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 68, height: 52, borderRadius: 12, overflow: "hidden", background: "rgba(24,21,18,0.06)", flexShrink: 0 }}>
                        {vehicle.images?.[0] ? <img src={vehicle.images[0]} alt={vehicle.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: S.text }}>{vehicle.name}</div>
                        <div style={{ fontSize: 12, color: S.text3, marginTop: 3 }}>{vehicle.detail}</div>
                        {!!vehicle.images?.length && <div style={{ fontSize: 11, color: S.text3, marginTop: 4 }}>{vehicle.images.length} photo{vehicle.images.length > 1 ? "s" : ""}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={tableCellStyle()}><Chip tone={vehicle.type === "Vente" ? "gold" : "dark"}>{vehicle.type}</Chip></td>
                  <td style={tableCellStyle()}><StatusBadge value={vehicle.status} /></td>
                  <td style={tableCellStyle()}>{vehicle.views}</td>
                  <td style={tableCellStyle()}>{vehicle.revenue}</td>
                  <td style={tableCellStyle()}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" onClick={() => onEditVehicle(vehicle)} style={ghostButtonStyle()}>Modifier</button>
                      <button type="button" onClick={() => onDeleteVehicle(vehicle.name)} style={dangerButtonStyle()}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function AgencyMessages({ chatThreads, branding, sendChatMessage }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={autoGrid(210)}>
        <SoftMetric label="Conversations actives" value={String(chatThreads.length)} sub="clients a suivre" />
        <SoftMetric label="Messages clients" value={String(chatThreads.reduce((sum, thread) => sum + thread.messages.filter((item) => item.senderRole === "client").length, 0))} sub="questions et confirmations" />
        <SoftMetric label="Dossiers chauds" value="2" sub="achat et location a relancer" />
      </div>

      <Panel title="Messagerie client" subtitle="Centralisez les echanges avec les clients pour confirmer les reservations et suivre les ventes.">
        <ChatPanel
          threads={chatThreads}
          accent={branding.color || S.red}
          currentRole="agency"
          currentName={branding.name || "Agence"}
          listTitle="Demandes clients"
          emptyTitle="Aucune conversation"
          emptySubtitle="Les demandes de location et d'achat apparaitront ici pour permettre un suivi direct avec les clients."
          onSend={sendChatMessage}
        />
      </Panel>
    </div>
  );
}

function AgencyProfil({ onLogout, branding }) {
  const [activeSection, setActiveSection] = useState("Modifier les informations agence");
  const items = [
    { icon: "edit", label: "Modifier les informations agence" },
    { icon: "grid", label: "Gerer les annonces" },
    { icon: "chart", label: "Revenus et statistiques" },
    { icon: "star", label: "Avis et reputation" },
    { icon: "lock", label: "Securite du compte" },
    { icon: "help", label: "Support partenaire" },
  ];

  const detailContent = {
    "Modifier les informations agence": {
      title: "Informations agence",
      subtitle: "Les informations principales de votre profil partenaire.",
      items: [
        { label: "Nom de l'agence", value: branding.name },
        { label: "Activite", value: branding.activity },
        { label: "Ville", value: branding.city },
        { label: "Couleur de marque", value: branding.color || "#D40511" },
      ],
    },
    "Gerer les annonces": {
      title: "Gestion des annonces",
      subtitle: "Resume rapide de vos vehicules et de leur statut.",
      items: [
        { label: "Annonces actives", value: "12 annonces en ligne" },
        { label: "En location", value: "9 vehicules disponibles ou loues" },
        { label: "En vente", value: "3 vehicules avec dossier ouvert" },
        { label: "Priorite", value: "1 vehicule en maintenance a remettre en ligne" },
      ],
    },
    "Revenus et statistiques": {
      title: "Revenus et statistiques",
      subtitle: "Les chiffres utiles pour piloter l'activite de l'agence.",
      items: [
        { label: "Revenus du mois", value: "1,2 M F CFA" },
        { label: "Demandes traitees", value: "38 demandes clients" },
        { label: "Taux d'occupation", value: "84%" },
        { label: "Conversion", value: "55% de demandes confirmees" },
      ],
    },
    "Avis et reputation": {
      title: "Avis et reputation",
      subtitle: "Vos retours clients et la perception de votre agence.",
      items: [
        { label: "Note moyenne", value: "4,8 / 5" },
        { label: "Dernier avis", value: "Toyota Prado · client satisfait apres restitution" },
        { label: "Temps de reponse", value: "24 min en moyenne" },
        { label: "Statut", value: "Agence certifiee" },
      ],
    },
    "Securite du compte": {
      title: "Securite du compte",
      subtitle: "Les elements de securite actuellement visibles sur votre espace.",
      items: [
        { label: "Statut du compte", value: "Compte agence actif" },
        { label: "Mot de passe", value: "Derniere mise a jour il y a 2 mois" },
        { label: "Connexion", value: "Acces partenaire securise" },
        { label: "Recommandation", value: "Renouveler les acces des collaborateurs si besoin" },
      ],
    },
    "Support partenaire": {
      title: "Support partenaire",
      subtitle: "Les points de contact utiles pour l'accompagnement de votre agence.",
      items: [
        { label: "Contact prioritaire", value: "+221 77 757 12 51" },
        { label: "Email partenaire", value: "partenaires@carexpress.sn" },
        { label: "Disponibilite", value: "Lun - Sam · 08:00 a 19:00" },
        { label: "Sujet frequent", value: "Validation annonces et suivi des dossiers clients" },
      ],
    },
  };

  const selectedDetail = detailContent[activeSection];

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="Profil agence" subtitle="Informations, reputation et acces rapides">
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 84, height: 84, borderRadius: 24, background: branding.color || S.black, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, overflow: "hidden", border: `1px solid ${branding.color || S.black}` }}>
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              "DA"
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: S.text }}>{branding.name}</div>
            <div style={{ fontSize: 14, color: S.text3, marginTop: 4 }}>{branding.activity} · {branding.city}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              <Chip tone="gold">Agence certifiee</Chip>
              <Chip tone="success">4,8/5 avis</Chip>
              <Chip tone="dark">Reponse moyenne 24 min</Chip>
            </div>
          </div>
        </div>

        <div style={{ ...autoGrid(180, 14), marginTop: 18 }}>
          <SoftMetric label="Annonces actives" value="12" sub="location et vente" />
          <SoftMetric label="Demandes traitees" value="38" sub="sur le mois" />
          <SoftMetric label="Taux de conversion" value="55%" sub="demandes confirmees" />
        </div>
      </Panel>

      <Panel title="Acces de gestion" subtitle="Raccourcis vers les modules principaux" noPadding>
        <div style={{ paddingTop: 8 }}>
          {items.map((item) => <ProfileMenuItem key={item.label} {...item} onClick={() => setActiveSection(item.label)} />)}
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

function HeroPanel({ title, subtitle, meta, ctaLabel, onAction, accent, logoUrl }) {
  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      borderRadius: 28,
      border: `1px solid ${S.border}`,
      background: "linear-gradient(135deg, #181311 0%, #2d1f19 54%, #493026 100%)",
      color: "#fff",
      padding: 24,
      boxShadow: "0 28px 60px rgba(18,18,18,0.12)",
    }}>
      <div style={{ position: "absolute", top: -80, right: -40, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${accent || "rgba(244,201,93,0.28)"}44, transparent 68%)` }} />
      <div style={{ position: "absolute", bottom: -70, left: -20, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${accent || "rgba(212,5,17,0.16)"}33, transparent 70%)` }} />
      <div style={{ position: "relative", display: "grid", gap: 18 }}>
        {logoUrl && (
          <div style={{ width: 40, height: 40, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.08)" }}>
            <img src={logoUrl} alt="Logo agence" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.56)", marginBottom: 10 }}>Tableau de bord agence</div>
          <h1 style={{ fontSize: "clamp(2rem, 3.4vw, 3.4rem)", lineHeight: 0.98, margin: 0, maxWidth: 780 }}>{title}</h1>
          <p style={{ marginTop: 14, maxWidth: 760, color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 1.7 }}>{subtitle}</p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {meta.map((item) => (
            <div key={item.label} style={{ padding: "10px 14px", borderRadius: 18, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.14em" }}>{item.label}</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 220 }}>
          <Btn onClick={onAction} accent={accent || S.red}>{ctaLabel}</Btn>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, right, children, noPadding }) {
  return (
    <section style={{
      borderRadius: 24,
      border: `1px solid ${S.border}`,
      background: S.panel,
      backdropFilter: "blur(14px)",
      boxShadow: "0 18px 50px rgba(24,21,18,0.06)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "18px 20px 0", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: S.text }}>{title}</div>
          {subtitle && <div style={{ marginTop: 6, color: S.text3, fontSize: 14 }}>{subtitle}</div>}
        </div>
        {right}
      </div>
      <div style={{ padding: noPadding ? 0 : 20 }}>
        {children}
      </div>
    </section>
  );
}

function MetricCard({ label, value, sub, accent }) {
  return (
    <div style={{
      padding: 18,
      borderRadius: 22,
      border: `1px solid ${S.border}`,
      background: S.panelStrong,
      boxShadow: "0 12px 34px rgba(24,21,18,0.05)",
    }}>
      <div style={{ width: 38, height: 6, borderRadius: 999, background: accent, marginBottom: 14 }} />
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.text3 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 30, fontWeight: 800, color: S.text }}>{value}</div>
      <div style={{ marginTop: 4, fontSize: 13, color: S.text2 }}>{sub}</div>
    </div>
  );
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

function BarChart({ bars, accent }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ height: 210, display: "flex", alignItems: "flex-end", gap: 12 }}>
        {bars.map((bar) => (
          <div key={bar.label} style={{ flex: 1, display: "grid", gap: 8, justifyItems: "center" }}>
            <div style={{ fontSize: 11, color: S.text3 }}>{bar.value}%</div>
            <div style={{ width: "100%", height: 170, borderRadius: 999, background: "rgba(24,21,18,0.06)", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
              <div style={{ width: "100%", height: `${bar.value}%`, borderRadius: 999, background: `linear-gradient(180deg, ${accent}, rgba(212,5,17,0.36))` }} />
            </div>
            <div style={{ fontSize: 12, color: S.text2 }}>{bar.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelSteps({ steps }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {steps.map((step, index) => (
        <div key={step.label} style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 14 }}>
            <span style={{ color: S.text }}>{step.label}</span>
            <strong style={{ color: S.text }}>{step.value}</strong>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: "rgba(24,21,18,0.06)", overflow: "hidden" }}>
            <div style={{ width: `${Math.max(22, (step.value / steps[0].value) * 100)}%`, height: "100%", background: step.color, borderRadius: 999 }} />
          </div>
          {index < steps.length - 1 && <div style={{ width: 1, height: 10, background: S.borderStrong, marginInlineStart: 8 }} />}
        </div>
      ))}
    </div>
  );
}

function VehicleRow({ vehicle }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) auto",
      gap: 12,
      alignItems: "center",
      padding: "14px 16px",
      borderRadius: 18,
      border: `1px solid ${vehicle.urgent ? "rgba(212,5,17,0.16)" : S.border}`,
      background: vehicle.urgent ? "rgba(212,5,17,0.03)" : "rgba(255,255,255,0.72)",
    }}>
      <div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 74, height: 56, borderRadius: 12, overflow: "hidden", background: "rgba(24,21,18,0.06)", flexShrink: 0 }}>
            {vehicle.images?.[0] ? <img src={vehicle.images[0]} alt={vehicle.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: S.text }}>{vehicle.name}</div>
            <div style={{ marginTop: 4, fontSize: 13, color: S.text3 }}>{vehicle.detail}</div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
        <StatusBadge value={vehicle.status} />
        <div style={{ fontSize: 12, color: S.text3 }}>{vehicle.revenue}</div>
      </div>
    </div>
  );
}

function AlertRow({ alert }) {
  const toneColor = alert.tone === "red" ? S.red : alert.tone === "gold" ? "#8b6800" : S.text3;
  const toneBg = alert.tone === "red" ? S.redSoft : alert.tone === "gold" ? S.goldSoft : "rgba(24,21,18,0.04)";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "auto minmax(0,1fr) auto",
      gap: 12,
      alignItems: "start",
      padding: "14px 16px",
      borderRadius: 18,
      border: `1px solid ${S.border}`,
      background: "rgba(255,255,255,0.76)",
    }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: alert.read ? S.borderStrong : toneColor, marginTop: 6 }} />
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: S.text }}>{alert.title}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: S.text3, lineHeight: 1.6 }}>{alert.sub}</div>
      </div>
      <div style={{ textAlign: "right", display: "grid", gap: 8 }}>
        <span style={{ fontSize: 11, color: toneColor, background: toneBg, padding: "5px 10px", borderRadius: 999 }}>{alert.time}</span>
      </div>
    </div>
  );
}

function ActionList({ items }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item) => (
        <div key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 0", borderBottom: `1px solid ${S.border}` }}>
          <div style={{ width: 28, height: 28, borderRadius: 10, background: S.redSoft, color: S.red, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>!</div>
          <div style={{ fontSize: 14, color: S.text2, lineHeight: 1.65 }}>{item}</div>
        </div>
      ))}
    </div>
  );
}

function formatAlertTime(createdAt) {
  if (!createdAt) return "A l'instant";

  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return "A l'instant";
  }

  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "A l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays} j`;
}

function StatusBadge({ value }) {
  const map = {
    Disponible: { bg: "#eef8f0", color: S.success },
    Loue: { bg: "rgba(244,201,93,0.18)", color: "#7b5a00" },
    "En vente": { bg: "rgba(17,17,17,0.08)", color: S.black },
    Maintenance: { bg: S.redSoft, color: S.red },
  };
  const tone = map[value] || { bg: "rgba(24,21,18,0.06)", color: S.text2 };
  return <span style={{ padding: "6px 10px", borderRadius: 999, background: tone.bg, color: tone.color, fontSize: 12, fontWeight: 600 }}>{value}</span>;
}

function Chip({ children, tone }) {
  const tones = {
    dark: { bg: S.black, color: "#fff" },
    gold: { bg: S.goldSoft, color: "#7b5a00" },
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

function ActionLink({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ border: "none", background: "none", color: S.red, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
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

function dangerButtonStyle() {
  return {
    border: "1px solid rgba(212,5,17,0.2)",
    background: "rgba(212,5,17,0.08)",
    color: S.red,
    padding: "8px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
  };
}

function parseVehicleToForm(vehicle) {
  if (!vehicle) {
    return {
      type: "Location",
      name: "",
      category: "SUV",
      detail: "",
      price: "",
      city: "Dakar",
      seats: "5",
      transmission: "Automatique",
      photos: [],
    };
  }

  const parts = (vehicle.detail || "").split("·").map((item) => item.trim());
  const category = parts[0] || "SUV";
  const seats = (parts[1]?.match(/\d+/)?.[0]) || "5";
  const price = (parts[2] || "").replace(/[^\d]/g, "") || "";

  return {
    type: vehicle.type || "Location",
    name: vehicle.name || "",
    category,
    detail: vehicle.commercialDetail || vehicle.detail || "",
    price,
    city: vehicle.city || "Dakar",
    seats,
    transmission: vehicle.transmission || "Automatique",
    photos: (vehicle.images || []).map((url, index) => ({
      name: `photo-${index + 1}`,
      url,
    })),
  };
}

function toAgencyVehiclePayload(listing) {
  const type = listing.type === "Vente" ? "sale" : "rental";
  const status = type === "sale" ? "for_sale" : "available";
  const words = (listing.name || "").trim().split(/\s+/);
  const brand = words[0] || "Marque";
  const model = words.slice(1).join(" ") || listing.category || "Modele";

  return {
    listing_type: type,
    name: listing.name,
    brand,
    model,
    year: Number(listing.year || new Date().getFullYear()),
    category: listing.category || "SUV",
    class_name: listing.type === "Vente" ? "Standard" : "Location",
    price: Number(listing.price || 0),
    price_unit: type === "sale" ? "fixed" : "day",
    service_fee: type === "sale" ? 95000 : null,
    city: listing.city || "Dakar",
    status,
    summary: listing.detail,
    description: listing.detail,
    seats: Number(listing.seats || 5),
    transmission: listing.transmission || "Automatique",
    gallery: [],
    equipment: ["Climatisation", "Bluetooth", "ABS"],
    tags: [listing.category || "Vehicule", listing.city || "Dakar"],
  };
}

function NewListingModal({ onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    ...parseVehicleToForm(initialData),
  });
  const [errors, setErrors] = useState({});
  const [photoError, setPhotoError] = useState("");

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const handlePhotos = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const next = files.slice(0, 4).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setForm((current) => ({ ...current, photos: next }));
    setPhotoError(files.length > 4 ? "Maximum 4 photos par annonce." : "");
  };

  const handleSubmit = async () => {
    const nextErrors = {};
    ["name", "detail", "price"].forEach((key) => {
      if (!form[key]) nextErrors[key] = "Champ requis.";
    });
    if (!form.photos?.length) setPhotoError("Ajoutez au moins une photo.");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !form.photos?.length) return;

    const status = form.type === "Vente" ? "En vente" : "Disponible";
    const priceLabel = form.type === "Vente" ? `${form.price} F` : `${form.price} F / jour`;
    await onSubmit({
      name: form.name,
      detail: `${form.category} · ${form.seats} places · ${priceLabel}`,
      commercialDetail: form.detail,
      status,
      type: form.type,
      revenue: initialData?.revenue || (form.type === "Vente" ? "Frais service a venir" : "Nouvelle annonce"),
      views: initialData?.views ?? 0,
      urgent: initialData?.urgent ?? false,
      images: form.photos.map((photo) => photo.url),
      city: form.city,
      transmission: form.transmission,
      category: form.category,
      seats: form.seats,
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(0,0,0,0.46)", backdropFilter: "blur(8px)", padding: 20, overflowY: "auto" }}>
      <div style={{ maxWidth: 840, margin: "0 auto", borderRadius: 28, background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,241,234,0.98))", border: `1px solid ${S.border}`, boxShadow: "0 30px 80px rgba(0,0,0,0.18)", overflow: "hidden" }}>
        <div style={{ padding: "20px 22px", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: S.text3 }}>Publication</div>
            <div style={{ marginTop: 6, fontSize: 26, fontWeight: 800, color: S.text }}>{initialData ? "Modifier l'annonce" : "Nouvelle annonce"}</div>
            <div style={{ marginTop: 6, color: S.text3, fontSize: 14 }}>{initialData ? "Mettez a jour les informations de votre vehicule avant republication." : "Ajoutez un vehicule en location ou en vente pour le rendre visible sur la plateforme."}</div>
          </div>
          <button onClick={onClose} style={{ ...ghostButtonStyle(), borderRadius: 999 }}>Fermer</button>
        </div>

        <div style={{ padding: 22, display: "grid", gap: 18 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Location", "Vente"].map((item) => (
              <FilterChip key={item} active={form.type === item} onClick={() => update("type", item)}>{item}</FilterChip>
            ))}
          </div>

          <div style={autoGrid(220, 14)}>
            <FormFieldBlock label="Nom du vehicule" error={errors.name}>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ex : Toyota Land Cruiser 2022" style={modalInputStyle(Boolean(errors.name))} />
            </FormFieldBlock>
            <FormFieldBlock label="Categorie">
              <select value={form.category} onChange={(e) => update("category", e.target.value)} style={modalInputStyle(false)}>
                {["SUV", "Berline", "Van", "Pick-up", "Minibus", "Luxe"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormFieldBlock>
            <FormFieldBlock label={form.type === "Vente" ? "Prix fixe" : "Prix par jour"} error={errors.price}>
              <input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="75000" style={modalInputStyle(Boolean(errors.price))} />
            </FormFieldBlock>
            <FormFieldBlock label="Ville">
              <select value={form.city} onChange={(e) => update("city", e.target.value)} style={modalInputStyle(false)}>
                {["Dakar", "Thies", "Saint-Louis", "Touba", "Kaolack", "Ziguinchor"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormFieldBlock>
            <FormFieldBlock label="Nombre de places">
              <select value={form.seats} onChange={(e) => update("seats", e.target.value)} style={modalInputStyle(false)}>
                {["2", "4", "5", "7", "9", "14"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormFieldBlock>
            <FormFieldBlock label="Transmission">
              <select value={form.transmission} onChange={(e) => update("transmission", e.target.value)} style={modalInputStyle(false)}>
                {["Automatique", "Manuelle"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormFieldBlock>
          </div>

          <FormFieldBlock label="Photos du vehicule" error={photoError}>
            <div style={{ display: "grid", gap: 12 }}>
              <label style={{ ...modalUploadStyle(), cursor: "pointer" }}>
                <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: "none" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: S.text }}>Ajouter jusqu'a 4 photos</span>
                <span style={{ fontSize: 12, color: S.text3 }}>Formats image uniquement. La premiere photo sera la vignette principale.</span>
              </label>
              {!!form.photos?.length && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
                  {form.photos.map((photo) => (
                    <div key={photo.url} style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${S.border}`, background: "#fff" }}>
                      <img src={photo.url} alt={photo.name} style={{ width: "100%", height: 96, objectFit: "cover" }} />
                      <div style={{ padding: "8px 10px", fontSize: 11, color: S.text3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{photo.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormFieldBlock>

          <FormFieldBlock label="Detail commercial" error={errors.detail}>
            <textarea value={form.detail} onChange={(e) => update("detail", e.target.value)} placeholder="Ex : SUV confortable, carnet a jour, ideal deplacements urbains et professionnels." style={{ ...modalInputStyle(Boolean(errors.detail)), minHeight: 120, resize: "vertical" }} />
          </FormFieldBlock>

          <div style={{ borderRadius: 20, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.72)", padding: 16 }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: S.text3, marginBottom: 10 }}>Apercu annonce</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: S.text }}>{form.name || "Nom du vehicule"}</div>
            <div style={{ marginTop: 6, color: S.text3, fontSize: 13 }}>
              {form.category} · {form.seats} places · {form.type === "Vente" ? `${form.price || "0"} F` : `${form.price || "0"} F / jour`}
            </div>
            {!!form.photos?.length && (
              <div style={{ marginTop: 12, width: 120, height: 86, borderRadius: 14, overflow: "hidden", border: `1px solid ${S.border}` }}>
                <img src={form.photos[0].url} alt="Apercu annonce" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <StatusBadge value={form.type === "Vente" ? "En vente" : "Disponible"} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
            <button onClick={onClose} style={ghostButtonStyle()}>Annuler</button>
            <Btn onClick={handleSubmit} accent={S.red} style={{ width: "auto", paddingInline: 22 }}>{initialData ? "Enregistrer les modifications" : "Publier l'annonce"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormFieldBlock({ label, children, error }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.text3, fontWeight: 700 }}>{label}</span>
      {children}
      {error ? <span style={{ fontSize: 12, color: S.red }}>{error}</span> : null}
    </label>
  );
}

function modalInputStyle(hasError) {
  return {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${hasError ? "rgba(212,5,17,0.32)" : S.borderStrong}`,
    borderRadius: 16,
    background: "rgba(255,255,255,0.96)",
    padding: "13px 14px",
    fontSize: 14,
    color: S.text,
    outline: "none",
    boxShadow: hasError ? "0 0 0 3px rgba(212,5,17,0.08)" : "none",
  };
}

function modalUploadStyle() {
  return {
    display: "grid",
    gap: 6,
    border: `1px dashed ${S.borderStrong}`,
    borderRadius: 16,
    background: "rgba(255,255,255,0.84)",
    padding: "16px 14px",
  };
}
