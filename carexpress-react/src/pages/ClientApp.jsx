import { useEffect, useMemo, useState } from "react";
import { useResponsive } from "../hooks/useResponsive";
import { Topbar, BottomNav, Hero, SearchBox, CarCard, ViewToggle, SectionLabel, ProfileMenuItem, Notification, Btn } from "../components/UI";
import { FilterPanel } from "../components/FilterPanel";
import { LocDetail, VntDetail, AgencyProfilePage } from "../components/VehicleDetail";
import { VehicleService } from "../services/VehicleService";
import { COLORS } from "../utils/constants";
import ChatPanel from "../components/ChatPanel";
import {
  checkVehicleAvailability,
  createPurchaseRequest,
  createReservation,
  fetchCatalogueVehicles,
  fetchClientPurchaseRequests,
  fetchClientReservations,
} from "../services/catalogue";

const S = COLORS;

export default function ClientApp({ user, chatThreads, sendChatMessage, onLogout, onGoToLanding }) {
  const [page, setPage] = useState("home");
  const [clientTab, setClientTab] = useState("location");
  const [view, setView] = useState("grid");
  const [detail, setDetail] = useState(null);
  const [agencyProfile, setAgencyProfile] = useState(null);
  const [notif, setNotif] = useState(null);
  const [catalogueVehicles, setCatalogueVehicles] = useState([]);
  const [clientReservations, setClientReservations] = useState([]);
  const [clientPurchases, setClientPurchases] = useState([]);
  const [locationFilters, setLocationFilters] = useState(null);
  const [saleFilters, setSaleFilters] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchCatalogueVehicles(),
      fetchClientReservations().catch(() => []),
      fetchClientPurchaseRequests().catch(() => []),
    ])
      .then(([vehicles, reservations, purchases]) => {
        setCatalogueVehicles(vehicles);
        setClientReservations(reservations);
        setClientPurchases(purchases);
      })
      .catch(() => {
        setNotif({ icon: "⚠️", title: "Connexion API", msg: "Le catalogue backend est momentanement indisponible." });
      });
  }, []);

  const locVehicles = useMemo(() => VehicleService.getLocationVehicles(catalogueVehicles), [catalogueVehicles]);
  const vntVehicles = useMemo(() => VehicleService.getSaleVehicles(catalogueVehicles), [catalogueVehicles]);
  const filteredLocVehicles = useMemo(() => VehicleService.filterVehicles(locVehicles, locationFilters), [locVehicles, locationFilters]);
  const filteredVntVehicles = useMemo(() => VehicleService.filterVehicles(vntVehicles, saleFilters), [vntVehicles, saleFilters]);
  const allVehiclesWithId = useMemo(() => VehicleService.getAllVehicles(catalogueVehicles), [catalogueVehicles]);

  const navItems = [
    { key: "home", icon: "home", label: "Accueil" },
    { key: "search", icon: "search", label: "Recherche" },
    { key: "messages", icon: "bell", label: "Messages", badge: true },
    { key: "profil", icon: "user", label: "Profil" },
  ];

  const avatarInitials = user?.name
    ? user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
    : "CL";

  const detailVehicle = detail ? VehicleService.getVehicleById(detail, catalogueVehicles) : null;
  const isLoc = detail?.startsWith("loc-");

  return (
    <div className="container-responsive" style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f7f2ec 0%, #fcfaf7 42%, #f4eee7 100%)", paddingBottom: 92 }}>
      {detailVehicle && isLoc && (
        <LocDetail
          vehicle={detailVehicle}
          user={user}
          onClose={() => setDetail(null)}
          onGoToSale={() => { setDetail(null); setTimeout(() => setClientTab("vente"), 180); }}
          onOpenAgency={() => setAgencyProfile(detailVehicle)}
          onNotif={setNotif}
          onCheckAvailability={checkVehicleAvailability}
          onCreateReservation={async (payload) => {
            const reservation = await createReservation(payload);
            setClientReservations((current) => [reservation, ...current]);
          }}
        />
      )}
      {detailVehicle && !isLoc && (
        <VntDetail
          vehicle={detailVehicle}
          user={user}
          onClose={() => setDetail(null)}
          onOpenAgency={() => setAgencyProfile(detailVehicle)}
          onNotif={setNotif}
          onCreatePurchaseRequest={async (payload) => {
            const purchaseRequest = await createPurchaseRequest(payload);
            setClientPurchases((current) => [purchaseRequest, ...current]);
          }}
        />
      )}
      {agencyProfile && <AgencyProfilePage vehicle={agencyProfile} onClose={() => setAgencyProfile(null)} />}
      {notif && <Notification notif={notif} onClose={() => setNotif(null)} />}

      <Topbar
        right="Dakar, SN"
        onLogout={onLogout}
        onLogoClick={onGoToLanding}
        profile={{
          name: user?.name || "Client Car Express",
          email: user?.email || user?.tel || "",
          subtitle: "Espace client",
        }}
      />

      <section className="container-responsive" style={{ maxWidth: 1360, margin: "0 auto", padding: "20px 20px 0" }}>
        {page === "home" && <HomePage clientTab={clientTab} setClientTab={setClientTab} view={view} setView={setView} onOpenDetail={setDetail} locVehicles={filteredLocVehicles} vntVehicles={filteredVntVehicles} onLocationFilterChange={setLocationFilters} onSaleFilterChange={setSaleFilters} />}
        {page === "search" && <SearchPage onOpenDetail={setDetail} allVehiclesWithId={allVehiclesWithId} />}
        {page === "messages" && <MessagesPage user={user} chatThreads={chatThreads} sendChatMessage={sendChatMessage} />}
        {page === "profil" && <ProfilPage user={user} avatarInitials={avatarInitials} onLogout={onLogout} reservations={clientReservations} purchases={clientPurchases} />}
      </section>

      <BottomNav items={navItems} active={page} onChange={setPage} />
    </div>
  );
}

function HomePage({ clientTab, setClientTab, view, setView, onOpenDetail, locVehicles, vntVehicles, onLocationFilterChange, onSaleFilterChange }) {
  const { isMobile } = useResponsive();
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        padding: 8,
        borderRadius: 22,
        border: `1px solid ${S.border}`,
        background: S.panel,
        boxShadow: "0 14px 34px rgba(24,21,18,0.05)",
      }}>
        {[{ key: "location", label: "Location" }, { key: "vente", label: "Achat" }].map((tab) => {
          const active = clientTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setClientTab(tab.key)}
              style={{
                flex: 1,
                minWidth: isMobile ? 90 : 140,
                padding: "14px 18px",
                borderRadius: 16,
                border: `1px solid ${active ? (tab.key === "location" ? S.loc : S.vnt) : "transparent"}`,
                background: active ? (tab.key === "location" ? S.loc : S.vnt) : "transparent",
                color: active ? (tab.key === "location" ? "#fff" : S.vntText) : S.text3,
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {clientTab === "location"
        ? <LocationScreen view={view} setView={setView} onOpenDetail={onOpenDetail} locVehicles={locVehicles} onFilterChange={onLocationFilterChange} />
        : <AchatScreen view={view} setView={setView} onOpenDetail={onOpenDetail} vntVehicles={vntVehicles} onFilterChange={onSaleFilterChange} />}
    </div>
  );
}

function LocationScreen({ view, setView, onOpenDetail, locVehicles, onFilterChange }) {
  const { isMobile } = useResponsive();
  const [lieu, setLieu] = useState("");
  const [depDate, setDepDate] = useState("");
  const [retDate, setRetDate] = useState("");
  const [depH, setDepH] = useState("08:00");
  const [retH, setRetH] = useState("18:00");
  const heures = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const reset = () => {
    setLieu("");
    setDepDate("");
    setRetDate("");
    setDepH("08:00");
    setRetH("18:00");
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Hero
        eyebrow="Client · Location"
        title="Reservez un vehicule, verifiez les dates et finalisez votre location plus simplement."
        subtitle="Choisissez votre lieu de prise en charge, vos dates et vos horaires. Consultez ensuite les vehicules disponibles avec leurs fiches detaillees."
        badge="Reservation en ligne et confirmation agence"
        accent={S.loc}
      />

      <div style={dashboardGrid()}>
        <Panel title="Planifier une location" subtitle="Lieu, dates, horaires et remise a zero du formulaire">
          <div style={rentalFormShellStyle()}>
            <div style={rentalFormHeroStyle()}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ maxWidth: 520 }}>
                  <div style={rentalEyebrowStyle()}>Reservation rapide</div>
                  <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: S.text, lineHeight: 1.04 }}>
                    Préparez votre location en quelques informations
                  </div>
                  <div style={{ marginTop: 10, color: S.text2, fontSize: 14, lineHeight: 1.7 }}>
                    Choisissez le lieu, les dates et les horaires pour afficher des vehicules adaptes a votre besoin.
                  </div>
                </div>
                <div style={rentalStatBadgeStyle()}>
                  <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", opacity: 0.82 }}>Parcours</span>
                  <strong style={{ fontSize: 16 }}>Location Car Express</strong>
                </div>
              </div>
              <div style={rentalMiniInfoGridStyle(isMobile)}>
                <MiniInfoCard label="Prise en charge" value={lieu || "A definir"} />
                <MiniInfoCard label="Depart" value={depDate ? `${depDate} · ${depH}` : "Non renseigne"} />
                <MiniInfoCard label="Retour" value={retDate ? `${retDate} · ${retH}` : "Non renseigne"} />
              </div>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <Field label="Lieu de prise en charge" hint="Ville, aeroport ou adresse de remise">
                <input value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder="Ville, aeroport ou adresse" style={inputStyle("text")} />
              </Field>
              <div style={formGrid(isMobile)}>
                <Field label="Date depart" hint="Jour de debut de votre reservation">
                  <input type="date" value={depDate} onChange={(e) => setDepDate(e.target.value)} style={inputStyle("date")} />
                </Field>
                <Field label="Heure depart" hint="Heure souhaitee pour recuperer le vehicule">
                  <select value={depH} onChange={(e) => setDepH(e.target.value)} style={timeSelectStyle(isMobile)}>
                    {heures.map((hour) => <option key={hour}>{hour}</option>)}
                  </select>
                </Field>
              </div>
              <div style={formGrid(isMobile)}>
                <Field label="Date retour" hint="Jour de fin de votre reservation">
                  <input type="date" value={retDate} onChange={(e) => setRetDate(e.target.value)} style={inputStyle("date")} />
                </Field>
                <Field label="Heure retour" hint="Heure prevue pour la restitution">
                  <select value={retH} onChange={(e) => setRetH(e.target.value)} style={timeSelectStyle(isMobile)}>
                    {heures.map((hour) => <option key={hour}>{hour}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 2 }}>
              <Btn accent={S.loc}>Rechercher</Btn>
              <Btn outline accent={S.loc} onClick={reset}>Reinitialiser</Btn>
            </div>
          </div>
        </Panel>

        <Panel title="Ce que vous pouvez faire" subtitle="La fiche detail vous permet ensuite de continuer la reservation">
          <div style={{ display: "grid", gap: 10 }}>
            {[
              "Consulter la galerie, les caracteristiques techniques, les equipements et les avis.",
              "Verifier la disponibilite selon les dates choisies.",
              "Calculer automatiquement le nombre de jours et le total de location.",
              "Finaliser avec vos informations, les conditions et le mode de paiement.",
            ].map((item) => (
              <InfoRow key={item} tone="red">{item}</InfoRow>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Filtres visuels" subtitle="Marque, sieges, motorisation, transmission, categorie, classe et prix">
        <FilterPanel prefix="loc" accent={S.loc} onApply={onFilterChange} />
      </Panel>

      <Panel
        title="Vehicules disponibles"
        subtitle="Alternez entre une vue liste et une vue grille pour parcourir les vehicules"
        right={<ViewToggle view={view} onChange={setView} count={locVehicles.length} accent={S.loc} />}
      >
        <div className="car-grid" style={carGridStyle(view)}>
          {locVehicles.map((vehicle) => (
            <CarCard key={vehicle.id} vehicle={vehicle} onClick={() => onOpenDetail(vehicle.id)} gridView={view === "grid"} accent={S.loc} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function AchatScreen({ view, setView, onOpenDetail, vntVehicles, onFilterChange }) {
  const [query, setQuery] = useState("");

  const recent = useMemo(() => vntVehicles.slice(0, 3), [vntVehicles]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Hero
        eyebrow="Client · Achat"
        title="Lancez une demande d'achat, reglez les frais de service et poursuivez avec le concessionnaire."
        subtitle="Recherchez un vehicule par marque, modele ou annee, consultez les annonces recentes puis ouvrez une fiche detaillee avant de lancer votre dossier."
        badge="Le solde du vehicule se regle directement avec le concessionnaire"
        accent={S.vnt}
      />

      <div style={dashboardGrid()}>
        <Panel title="Recherche achat" subtitle="Marque, modele ou annee">
          <div style={{ display: "grid", gap: 12 }}>
            <SearchBox placeholder="Marque, modele, annee..." value={query} onChange={setQuery} />
            <Btn outline accent={S.vnt} onClick={() => setQuery("")}>Reinitialiser</Btn>
          </div>
        </Panel>

        <Panel title="Informations dossier achat" subtitle="Fonctionnement du paiement dans l'application">
          <div style={{ display: "grid", gap: 10 }}>
            <InfoRow tone="gold">Le prix total du vehicule n'est pas encaisse par la plateforme.</InfoRow>
            <InfoRow tone="gold">Seuls les frais de service Car Express sont payes dans l'application.</InfoRow>
            <InfoRow tone="gold">Le client accepte les CGU, les conditions du concessionnaire et la clause non remboursable des frais de service.</InfoRow>
          </div>
        </Panel>
      </div>

      <Panel title="Filtres achat" subtitle="Affinez les annonces recentes et les vehicules en vente">
        <FilterPanel prefix="vnt" accent={S.vnt} onApply={onFilterChange} />
      </Panel>

      <Panel
        title="Annonces recentes"
        subtitle="Les clients peuvent consulter les fiches detaillees, les informations techniques et les avis d'acheteurs"
        right={<ViewToggle view={view} onChange={setView} count={vntVehicles.length} accent={S.vnt} />}
      >
        <div className="car-grid" style={carGridStyle(view)}>
          {vntVehicles.map((vehicle) => (
            <CarCard key={vehicle.id} vehicle={vehicle} onClick={() => onOpenDetail(vehicle.id)} gridView={view === "grid"} accent={S.vnt} />
          ))}
        </div>
      </Panel>

      <Panel title="Selection du moment" subtitle="Quelques vehicules mis en avant pour l'achat">
        <div style={autoGrid(260)}>
          {recent.map((vehicle) => (
            <CarCard key={vehicle.id} vehicle={vehicle} onClick={() => onOpenDetail(vehicle.id)} gridView accent={S.vnt} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SearchPage({ onOpenDetail, allVehiclesWithId }) {
  const [q, setQ] = useState("");

  const recentSearches = [
    "Toyota Land Cruiser · Dakar aeroport",
    "BMW Serie 3 · achat Dakar",
    "SUV automatique · Almadies",
  ];
  const categories = ["SUV", "Berline", "Van", "Pick-up", "Luxe", "Economique"];

  const filtered = useMemo(() => {
    if (!q) return [];
    const lower = q.toLowerCase();
    return allVehiclesWithId.filter((vehicle) =>
      vehicle.name.toLowerCase().includes(lower)
      || vehicle.agency.toLowerCase().includes(lower)
      || vehicle.tags.join(" ").toLowerCase().includes(lower)
    );
  }, [q]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="Recherche globale" subtitle="Location et vente dans un meme moteur de recherche">
        <div style={{ display: "grid", gap: 14 }}>
          <SearchBox placeholder="Marque, modele, ville ou categorie..." value={q} onChange={setQ} />
          <div style={autoGrid(220, 12)}>
            <SoftMetric label="Recherches recentes" value="3" sub="sauvegardees pour ce client" />
            <SoftMetric label="Categories populaires" value="6" sub="acces rapide" />
            <SoftMetric label="Resultats actifs" value={String(allVehiclesWithId.length)} sub="location et achat" />
          </div>
        </div>
      </Panel>

      {q && filtered.length > 0 ? (
        <Panel title="Resultats" subtitle="Vehicules trouves selon votre recherche">
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((vehicle) => (
              <CarCard key={vehicle.id} vehicle={vehicle} onClick={() => onOpenDetail(vehicle.id)} accent={vehicle.id.startsWith("loc-") ? S.loc : S.vnt} />
            ))}
          </div>
        </Panel>
      ) : (
        <div style={dashboardGrid()}>
          <Panel title="Recherches recentes" subtitle="Acces rapide aux dernieres intentions">
            <div style={{ display: "grid", gap: 10 }}>
              {recentSearches.map((item) => <InfoRow key={item}>{item}</InfoRow>)}
            </div>
          </Panel>

          <Panel title="Categories populaires" subtitle="Relancez une recherche en un clic">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {categories.map((category) => (
                <button key={category} onClick={() => setQ(category)} style={pillButtonStyle()}>
                  {category}
                </button>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

function MessagesPage({ user, chatThreads, sendChatMessage }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={autoGrid(220)}>
        <SoftMetric label="Conversations" value={String(chatThreads.length)} sub="avec les agences suivies" />
        <SoftMetric label="Messages recus" value={String(chatThreads.reduce((sum, thread) => sum + thread.messages.filter((item) => item.senderRole === "agency").length, 0))} sub="reponses partenaires" />
        <SoftMetric label="Dossiers suivis" value="2" sub="location et achat" />
      </div>

      <Panel title="Messagerie agence" subtitle="Discutez directement avec l'agence pour confirmer une location ou suivre un dossier achat.">
        <ChatPanel
          threads={chatThreads}
          accent={S.loc}
          currentRole="client"
          currentName={user?.name || "Client Car Express"}
          listTitle="Conversations"
          emptyTitle="Aucune conversation"
          emptySubtitle="Les echanges avec les agences apparaitront ici des qu'une reservation ou une demande d'achat est lancee."
          onSend={sendChatMessage}
        />
      </Panel>
    </div>
  );
}

function ProfilPage({ user, avatarInitials, onLogout, reservations, purchases }) {
  const [activeSection, setActiveSection] = useState("Informations personnelles");
  const menuItems = [
    { icon: "user", label: "Informations personnelles" },
    { icon: "calendar", label: "Mes reservations" },
    { icon: "bag", label: "Mes achats" },
    { icon: "star", label: "Mes avis" },
    { icon: "bell", label: "Notifications" },
    { icon: "lock", label: "Securite et mot de passe" },
    { icon: "help", label: "Aide et support" },
  ];

  const detailContent = {
    "Informations personnelles": {
      title: "Informations personnelles",
      subtitle: "Les coordonnees et informations de votre compte client.",
      items: [
        { label: "Nom complet", value: user?.name || "Client Car Express" },
        { label: "Telephone", value: user?.phone || user?.tel || "+221 77 000 00 00" },
        { label: "Email", value: user?.email || "client@carexpress.sn" },
        { label: "Ville", value: user?.city || "Dakar" },
      ],
    },
    "Mes reservations": {
      title: "Mes reservations",
      subtitle: "Suivi rapide des locations deja effectuees ou en attente.",
      items: [
        { label: "Reservation active", value: reservations[0]?.vehicle?.name ? `${reservations[0].vehicle.name} · ${reservations[0].pickup_date} au ${reservations[0].return_date}` : "Aucune reservation enregistree" },
        { label: "Prochaine restitution", value: reservations[0]?.return_date || "Aucune restitution a venir" },
        { label: "Total reservations", value: `${reservations.length} dossier${reservations.length > 1 ? "s" : ""} location` },
        { label: "Statut recent", value: reservations[0]?.status || "Aucun statut recent" },
      ],
    },
    "Mes achats": {
      title: "Mes achats",
      subtitle: "Les dossiers d'achat suivis depuis votre espace.",
      items: [
        { label: "Dossier en cours", value: purchases[0]?.vehicle?.name || "Aucun dossier d'achat en cours" },
        { label: "Dossier negocie", value: purchases[1]?.vehicle?.name || "Aucun second dossier pour le moment" },
        { label: "Frais de service", value: `${purchases.length} paiement${purchases.length > 1 ? "s" : ""} enregistres` },
        { label: "Derniere mise a jour", value: purchases[0]?.created_at || "Aucune mise a jour" },
      ],
    },
    "Mes avis": {
      title: "Mes avis",
      subtitle: "Vos retours laisses apres location ou achat.",
      items: [
        { label: "Avis publies", value: "4 avis clients" },
        { label: "Dernier avis", value: "Toyota Prado · note 4,8/5" },
        { label: "Agence la mieux notee", value: "Dakar Auto Services" },
        { label: "Statut", value: "Tous les avis sont visibles" },
      ],
    },
    "Notifications": {
      title: "Notifications",
      subtitle: "Les alertes importantes reliees a vos dossiers client.",
      items: [
        { label: "Non lues", value: "2 notifications" },
        { label: "Derniere alerte", value: "Reservation confirmee · il y a 2 heures" },
        { label: "Type principal", value: "Reservations et suivi achat" },
        { label: "Canal actif", value: "Application et telephone" },
      ],
    },
    "Securite et mot de passe": {
      title: "Securite et mot de passe",
      subtitle: "Parametres utiles pour proteger votre compte.",
      items: [
        { label: "Mot de passe", value: "Mis a jour il y a 2 mois" },
        { label: "Telephone verifie", value: user?.tel || "+221 77 000 00 00" },
        { label: "Etat du compte", value: "Compte client verifie" },
        { label: "Recommandation", value: "Activer un mot de passe plus fort au prochain changement" },
      ],
    },
    "Aide et support": {
      title: "Aide et support",
      subtitle: "Les contacts utiles pour vos questions ou problemes.",
      items: [
        { label: "Support client", value: "+221 77 757 12 51" },
        { label: "Email support", value: "support@carexpress.sn" },
        { label: "Disponibilite", value: "Lun - Sam · 08:00 a 19:00" },
        { label: "Sujet le plus frequent", value: "Modification de reservation et suivi paiement" },
      ],
    },
  };

  const selectedDetail = detailContent[activeSection];

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="Profil client" subtitle="Vos informations, vos reservations, vos achats et vos acces rapides">
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 82, height: 82, borderRadius: 24, background: S.black, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>
            {avatarInitials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: S.text }}>{user?.name || "Mon compte"}</div>
            <div style={{ marginTop: 4, color: S.text3 }}>{user?.phone || user?.tel || user?.email || ""}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              <Badge tone="red">Client verifie</Badge>
              <Badge tone="success">Notifications actives</Badge>
            </div>
          </div>
        </div>

        <div style={{ ...autoGrid(190, 14), marginTop: 18 }}>
          <SoftMetric label="Reservations" value={String(reservations.length)} sub="location effectuees" />
          <SoftMetric label="Achats" value={String(purchases.length)} sub="dossiers lances" />
          <SoftMetric label="Avis postes" value="4" sub="sur les agences" />
        </div>
      </Panel>

      <Panel title="Acces rapides" subtitle="Toutes les rubriques utiles du profil" noPadding>
        <div style={{ paddingTop: 8 }}>
          {menuItems.map((item) => <ProfileMenuItem key={item.label} {...item} onClick={() => setActiveSection(item.label)} />)}
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

function Panel({ title, subtitle, right, children, noPadding }) {
  return (
    <section style={{
      borderRadius: 24,
      border: `1px solid ${S.border}`,
      background: S.panel,
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
      <div style={{ padding: noPadding ? 0 : 20 }}>{children}</div>
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.11em", color: S.text3, marginBottom: 8 }}>{label}</div>
      {children}
      {hint && <div style={{ marginTop: 7, color: S.text3, fontSize: 12, lineHeight: 1.5 }}>{hint}</div>}
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

function InfoRow({ children, tone }) {
  const colors = tone === "gold"
    ? { bg: "rgba(255,204,0,0.14)", dot: "#c39200" }
    : tone === "red"
      ? { bg: "rgba(212,5,17,0.06)", dot: S.loc }
      : { bg: "rgba(24,21,18,0.04)", dot: S.black };

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "13px 14px", borderRadius: 16, background: colors.bg }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors.dot, marginTop: 6, flexShrink: 0 }} />
      <div style={{ color: S.text2, fontSize: 14, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function Badge({ children, tone }) {
  const colors = tone === "success"
    ? { bg: S.successSoft, color: S.success }
    : { bg: S.locLight, color: S.loc };

  return <span style={{ padding: "6px 10px", borderRadius: 999, background: colors.bg, color: colors.color, fontSize: 12, fontWeight: 700 }}>{children}</span>;
}

function dashboardGrid() {
  return { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 };
}

function autoGrid(min, gap = 16) {
  return { display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${Math.max(min, 180)}px, 1fr))`, gap };
}

function formGrid(isMobile = false) {
  return {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
    columnGap: isMobile ? 12 : 32,
    rowGap: 10,
    alignItems: "end",
  };
}

function carGridStyle(view) {
  return {
    display: view === "grid" ? "grid" : "flex",
    gridTemplateColumns: view === "grid" ? "repeat(auto-fit, minmax(280px, 1fr))" : "",
    flexDirection: view === "grid" ? undefined : "column",
    gap: 12,
  };
}

function rentalFormShellStyle() {
  return {
    display: "grid",
    gap: 14,
  };
}

function rentalFormHeroStyle() {
  return {
    padding: "18px",
    borderRadius: 26,
    border: `1px solid rgba(212,5,17,0.16)`,
    background: "linear-gradient(135deg, rgba(255,241,241,0.98) 0%, rgba(255,255,255,0.98) 56%, rgba(255,248,244,0.98) 100%)",
    boxShadow: "0 24px 48px rgba(212,5,17,0.08)",
  };
}

function rentalEyebrowStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 999,
    border: `1px solid rgba(212,5,17,0.14)`,
    background: "rgba(255,255,255,0.78)",
    color: S.loc,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    marginBottom: 12,
  };
}

function rentalStatBadgeStyle() {
  return {
    minWidth: 170,
    display: "grid",
    gap: 6,
    padding: "14px 16px",
    borderRadius: 20,
    background: S.loc,
    color: "#fff",
    boxShadow: "0 18px 34px rgba(212,5,17,0.2)",
  };
}

function compactRentalHeaderStyle(isMobile = false) {
  return {
    display: "grid",
    gap: 12,
    padding: isMobile ? "14px" : "16px 18px",
    borderRadius: 22,
    border: `1px solid rgba(212,5,17,0.12)`,
    background: "linear-gradient(135deg, rgba(255,245,245,0.96) 0%, rgba(255,255,255,0.96) 100%)",
  };
}

function compactRentalSummaryStyle(isMobile = false) {
  return {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: 8,
    fontSize: 12,
    color: S.text2,
  };
}

function rentalMiniInfoGridStyle(isMobile = false) {
  return {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginTop: 18,
  };
}

function MiniInfoCard({ label, value }) {
  return (
    <div style={{ padding: "14px 15px", borderRadius: 18, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.74)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: S.text3 }}>{label}</div>
      <div style={{ marginTop: 7, fontSize: 14, fontWeight: 700, color: S.text }}>{value}</div>
    </div>
  );
}

function inputStyle(kind = "text") {
  return {
    width: "100%",
    minHeight: 38,
    boxSizing: "border-box",
    padding: kind === "date" ? "6px 10px" : "6px 10px",
    borderRadius: 10,
    border: `1px solid rgba(24,21,18,0.14)`,
    background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(252,249,246,0.98) 100%)",
    outline: "none",
    fontSize: 12,
    color: S.text,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.88), 0 12px 26px rgba(17,17,17,0.04)",
  };
}

function timeSelectStyle(isMobile = false) {
  return {
    ...inputStyle(),
    width: "100%",
    minWidth: 0,
    padding: isMobile ? "6px 10px" : "6px 30px 6px 10px",
    appearance: "auto",
  };
}

function pillButtonStyle() {
  return {
    border: `1px solid ${S.borderStrong}`,
    background: "rgba(255,255,255,0.82)",
    padding: "10px 16px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    color: S.text2,
    cursor: "pointer",
  };
}
