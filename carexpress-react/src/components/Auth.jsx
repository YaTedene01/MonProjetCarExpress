import { useState } from "react";
import { Btn, Input, FormField, Select } from "./UI";
import logo from "../assets/logofinal.png";
import landcruiserImg from "../assets/landcruiser.jpg";
import bmwImg from "../assets/bmw-x5-30d-2019-08_1.jpg";
import sprinterImg from "../assets/mercedes sprinter.jpg";

const S = {
  loc: "#D40511",
  locLight: "#FFF0F0",
  locMid: "#F5C6C6",
  vnt: "#FFCC00",
  vntLight: "#FFFBE0",
  vntMid: "#FFE066",
  vntText: "#7A5C00",
  black: "#111111",
  bg2: "#f7f3ee",
  text: "#181512",
  text2: "#5f5750",
  text3: "#8f877f",
  border: "rgba(24, 21, 18, 0.1)",
};

export function RoleSelect({ onSelect }) {
  const roles = [
    {
      key: "client",
      title: "Espace Client",
      desc: "Louez ou achetez avec une interface plus raffinée, plus rapide et plus rassurante.",
      badge: "Location & Achat",
      accent: S.loc,
      stats: "28 véhicules prêts à partir",
    },
    {
      key: "agency",
      title: "Espace Agence",
      desc: "Gérez votre flotte et vos demandes avec une présence plus haut de gamme.",
      badge: "Partenaires",
      accent: S.vnt,
      stats: "Gestion commerciale centralisée",
    },
    {
      key: "admin",
      title: "Super Admin",
      desc: "Supervisez la plateforme dans un espace clair, premium et sécurisé.",
      badge: "Pilotage",
      accent: S.black,
      stats: "Contrôle global",
    },
  ];

  const highlights = [
    { value: "Premium", label: "direction artistique plus luxe" },
    { value: "Rapide", label: "réservation en quelques clics" },
    { value: "Fiable", label: "agences et annonces vérifiées" },
  ];

  const experiences = [
    { title: "Location instantanée", text: "Des véhicules mis en scène comme une vraie marque auto, pas juste une liste d’annonces." },
    { title: "Achat plus crédible", text: "Une présentation plus premium pour inspirer confiance dès la première seconde." },
    { title: "Gestion élégante", text: "Des accès métier mieux hiérarchisés, plus propres et plus rassurants." },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "18px 18px 42px", position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -180,
          left: -120,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,5,17,0.2), transparent 68%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -160,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,204,0,0.24), transparent 68%)",
          pointerEvents: "none",
        }}
      />

      <section
        className="animate-fade-in"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          borderRadius: 38,
          position: "relative",
          overflow: "hidden",
          background: "#0f0f10",
          boxShadow: "0 40px 100px rgba(17,17,17,0.22)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(212,5,17,0.12), transparent 34%, rgba(255,204,0,0.12) 100%)" }} />
        <img
          src={landcruiserImg}
          alt="Toyota Land Cruiser"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.32 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(15,15,16,0.92) 0%, rgba(15,15,16,0.72) 42%, rgba(15,15,16,0.58) 60%, rgba(15,15,16,0.9) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "28px",
            display: "grid",
            gap: 26,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
              <div style={{ padding: "10px 0" }}>
                <img src={logo} alt="Car Express" style={{ height: window.innerWidth <= 600 ? 28 : 80, maxWidth: window.innerWidth <= 600 ? 100 : 180, width: 'auto', objectFit: 'contain', display: 'block', imageRendering: '-webkit-optimize-contrast' }} />
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                Dakar • Mobilite premium
              </div>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                padding: "8px 14px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#fff",
                fontSize: 12,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: S.vnt, display: "inline-block" }} />
              Vitrine premium nouvelle génération
            </div>
          </div>

          <div className="landing-cinema-grid" style={{ display: "grid", gap: 22 }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.52)", marginBottom: 14 }}>
                Location • Achat • Gestion
              </div>
              <h1 style={{ fontSize: "clamp(3rem, 7vw, 6.2rem)", lineHeight: 0.9, color: "#fff", maxWidth: 780, marginBottom: 18 }}>
                Une presence auto qui impressionne des le premier regard.
              </h1>
              <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.78)", maxWidth: 620, marginBottom: 22 }}>
                Une landing plus cinematique, plus haut de gamme et plus desiree, pensee pour donner envie de cliquer,
                reserver et faire confiance a Car Express.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                <button
                  onClick={() => onSelect("client")}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    background: "#fff",
                    color: S.black,
                    padding: "15px 24px",
                    borderRadius: 999,
                    fontSize: 15,
                    fontWeight: 800,
                    boxShadow: "0 22px 48px rgba(255,255,255,0.12)",
                  }}
                >
                  Entrer comme client
                </button>
                <button
                  onClick={() => onSelect("agency")}
                  style={{
                    border: "1px solid rgba(255,255,255,0.18)",
                    cursor: "pointer",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    padding: "15px 24px",
                    borderRadius: 999,
                    fontSize: 15,
                    fontWeight: 700,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  Acces partenaire
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      borderRadius: 22,
                      padding: "16px 16px 14px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#fff",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 5 }}>{item.value}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.68)", lineHeight: 1.5 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: 14, alignContent: "end" }}>
              <FloatingPromoCard
                image={bmwImg}
                label="Selection prestige"
                title="BMW Serie 3"
                price="12 000 000 F CFA"
                note="Mise en scene plus premium"
                accent={S.vnt}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <MiniGlassStat value="24/7" label="resevation digitale" />
                <MiniGlassStat value="< 30 min" label="retour agence" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "28px auto 0", display: "grid", gap: 22 }}>
        <div className="glass-panel" style={{ padding: 24, borderRadius: 30 }}>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.18em", color: S.text3, marginBottom: 8 }}>
            Signature visuelle
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", marginBottom: 12, maxWidth: 820 }}>
            Une page vitrine plus belle, plus intense et moins generique.
          </h2>
          <p style={{ color: S.text2, maxWidth: 760, lineHeight: 1.8 }}>
            On est sur une approche plus mode, plus automobile et plus premium, avec davantage de contraste, une vraie image hero
            et une meilleure mise en valeur des espaces.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {roles.map((role) => (
            <RoleCard key={role.key} role={role} onClick={() => onSelect(role.key)} />
          ))}
        </div>

        <div className="landing-story-grid" style={{ display: "grid", gap: 18 }}>
          <div
            style={{
              borderRadius: 30,
              overflow: "hidden",
              position: "relative",
              minHeight: 340,
              boxShadow: "0 30px 70px rgba(17,17,17,0.14)",
            }}
          >
            <img src={sprinterImg} alt="Mercedes Sprinter" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(17,17,17,0.08), rgba(17,17,17,0.82))" }} />
            <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, color: "#fff" }}>
              <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.58)", marginBottom: 10 }}>
                Expérience Car Express
              </div>
              <div style={{ fontSize: 34, lineHeight: 0.98, fontWeight: 800, marginBottom: 10 }}>
                Une identite plus forte pour vendre, louer et convaincre.
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.76)", maxWidth: 520 }}>
                Le premier ecran ne doit pas seulement etre propre. Il doit donner envie, rassurer et marquer.
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {experiences.map((item, index) => (
              <div
                key={item.title}
                className="glass-panel"
                style={{
                  padding: 20,
                  borderRadius: 24,
                  display: "grid",
                  gap: 10,
                  background: index === 1 ? "linear-gradient(135deg, rgba(255,204,0,0.18), rgba(255,255,255,0.84))" : undefined,
                }}
              >
                <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: S.text3 }}>
                  0{index + 1}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.05 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: S.text2, lineHeight: 1.75 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function RoleCard({ role, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: "left",
        border: `1px solid rgba(24,21,18,0.08)`,
        background: "rgba(255,255,255,0.82)",
        borderRadius: 28,
        padding: 24,
        cursor: "pointer",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 30px 65px rgba(17,17,17,0.12)" : "0 16px 34px rgba(17,17,17,0.06)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 34 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 11px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.92)",
            border: `1px solid ${S.border}`,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: S.text2,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: role.accent, display: "inline-block" }} />
          {role.badge}
        </div>
        <span style={{ fontSize: 22, color: role.accent }}>→</span>
      </div>
      <div style={{ fontSize: 27, fontWeight: 800, marginBottom: 10 }}>{role.title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: S.text2, marginBottom: 20 }}>{role.desc}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span style={{ fontSize: 12, color: S.text3 }}>{role.stats}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: role.accent }}>Entrer</span>
      </div>
    </button>
  );
}

function FloatingPromoCard({ image, label, title, price, note, accent }) {
  return (
    <div
      style={{
        borderRadius: 28,
        overflow: "hidden",
        position: "relative",
        minHeight: 250,
        boxShadow: "0 26px 70px rgba(0,0,0,0.26)",
      }}
    >
      <img src={image} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(17,17,17,0.05), rgba(17,17,17,0.82))" }} />
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 999,
          padding: "8px 12px",
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.18)",
          color: "#fff",
          fontSize: 12,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, display: "inline-block" }} />
        {label}
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, color: "#fff" }}>
        <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 0.98, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.62)", marginBottom: 8 }}>
          {note}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{price}</div>
      </div>
    </div>
  );
}

function MiniGlassStat({ value, label }) {
  return (
    <div
      style={{
        borderRadius: 22,
        padding: "18px 16px",
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "#fff",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.68)", lineHeight: 1.5 }}>{label}</div>
    </div>
  );
}

function AuthHero({ subtitle, badge, accent, badgeColor, onBack }) {
  return (
    <div
      className="auth-panel"
      style={{
        minHeight: 420,
        padding: "30px 28px",
        borderRadius: 32,
        background: "linear-gradient(145deg, #0f0f11 0%, #1c1a17 55%, #34261d 100%)",
        boxShadow: "0 35px 80px rgba(17,17,17,0.2)",
      }}
    >
      <button
        onClick={onBack}
        style={{
          border: "none",
          background: "rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.85)",
          padding: "10px 14px",
          borderRadius: 999,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Retour
      </button>

      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          top: -70,
          right: -60,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent || "rgba(255,255,255,0.16)"} 0%, transparent 70%)`,
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          bottom: -120,
          left: -40,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />

      <div style={{ position: "relative", marginTop: 56 }}>
        <div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: 20 }}>
          <img src={logo} alt="Car Express" style={{ height: window.innerWidth <= 600 ? 52 : 110, maxWidth: window.innerWidth <= 600 ? 120 : 240, width: 'auto', objectFit: 'contain', imageRendering: '-webkit-optimize-contrast' }} />
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            border: `1px solid ${badgeColor || "rgba(255,255,255,0.2)"}`,
            color: badgeColor || "#fff",
            fontSize: 12,
            marginBottom: 18,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: badgeColor || "#fff", display: "inline-block" }} />
          {badge}
        </div>
        <h2 style={{ fontSize: "clamp(2.1rem, 5vw, 3.4rem)", color: "#fff", lineHeight: 0.98, marginBottom: 14 }}>
          Une connexion plus premium, plus rassurante.
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.72)", maxWidth: 520 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function AuthLayout({ heroSubtitle, heroBadge, accent, children, onBack, badgeColor }) {
  return (
    <div style={{ minHeight: "100vh", padding: "22px 18px 40px" }}>
      <div className="auth-shell" style={{ maxWidth: 1160, margin: "0 auto" }}>
        <AuthHero subtitle={heroSubtitle} badge={heroBadge} accent={accent} badgeColor={badgeColor} onBack={onBack} />
        <div className="glass-panel animate-slide-up" style={{ padding: 26, borderRadius: 30 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ClientAuth({ onLogin, onBack }) {
  const [tab, setTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", pwd: "" });
  const [regData, setRegData] = useState({ prenom: "", nom: "", tel: "", email: "", ville: "", pwd: "", pwd2: "" });
  const [cgu, setCgu] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [pwdStrength, setPwdStrength] = useState(0);

  const checkStrength = (v) => {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setPwdStrength(s);
  };

  const handleLogin = () => {
    if (!loginData.email || !loginData.pwd) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setError("");
    onLogin({ name: "", tel: loginData.email });
  };

  const handleRegister = () => {
    if (!regData.prenom || !regData.nom || !regData.tel || !regData.pwd) {
      setError("Champs obligatoires (*) manquants.");
      return;
    }
    if (regData.pwd !== regData.pwd2) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (regData.pwd.length < 8) {
      setError("Mot de passe trop court (min. 8 caractères).");
      return;
    }
    if (!cgu) {
      setError("Veuillez accepter les conditions générales.");
      return;
    }
    setError("");
    onLogin({ name: `${regData.prenom} ${regData.nom}`, tel: regData.tel });
  };

  const strengthColors = ["#e0e0e0", "#D40511", "#FFCC00", "#88c057", "#1a7a2e"];

  return (
    <AuthLayout
      heroSubtitle="Connectez-vous pour louer, acheter et suivre vos demandes dans une interface plus fluide."
      heroBadge="Espace Client"
      accent={S.loc}
      badgeColor={S.loc}
      onBack={onBack}
    >
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: S.text3, marginBottom: 8 }}>
          Accès client
        </div>
        <h3 style={{ fontSize: 32, marginBottom: 8 }}>Bienvenue sur Car Express</h3>
        <p style={{ color: S.text2, lineHeight: 1.7 }}>Un espace plus propre, plus crédible et plus confortable pour réserver ou acheter.</p>
      </div>

      <div style={{ display: "flex", gap: 10, padding: 6, borderRadius: 18, background: "rgba(255,255,255,0.6)", border: `1px solid ${S.border}`, marginBottom: 22 }}>
        {["login", "register"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setTab(item);
              setError("");
            }}
            style={{
              flex: 1,
              border: "none",
              cursor: "pointer",
              borderRadius: 14,
              padding: "12px 14px",
              background: tab === item ? S.black : "transparent",
              color: tab === item ? "#fff" : S.text2,
              fontWeight: 700,
            }}
          >
            {item === "login" ? "Connexion" : "Inscription"}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ fontSize: 12, color: S.loc, background: S.locLight, padding: "12px 14px", borderRadius: 14, marginBottom: 16, border: `1px solid ${S.locMid}` }}>
          {error}
        </div>
      )}

      {tab === "login" ? (
        <>
          <FormField label="Email ou téléphone *">
            <Input placeholder="email@exemple.sn ou +221 77…" value={loginData.email} onChange={(e) => setLoginData((p) => ({ ...p, email: e.target.value }))} />
          </FormField>
          <FormField label="Mot de passe *">
            <div style={{ position: "relative" }}>
              <Input type={showPwd ? "text" : "password"} placeholder="Votre mot de passe" value={loginData.pwd} onChange={(e) => setLoginData((p) => ({ ...p, pwd: e.target.value }))} />
              <span onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 13, color: S.text3 }}>
                {showPwd ? "Masquer" : "Afficher"}
              </span>
            </div>
          </FormField>
          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: S.text2, textDecoration: "underline", cursor: "pointer" }}>Mot de passe oublié ?</span>
          </div>
          <Btn onClick={handleLogin} accent={S.loc}>Se connecter</Btn>
        </>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            <FormField label="Prénom *">
              <Input placeholder="Prénom" value={regData.prenom} onChange={(e) => setRegData((p) => ({ ...p, prenom: e.target.value }))} />
            </FormField>
            <FormField label="Nom *">
              <Input placeholder="Nom" value={regData.nom} onChange={(e) => setRegData((p) => ({ ...p, nom: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Téléphone *">
            <Input type="tel" placeholder="+221 77 000 00 00" value={regData.tel} onChange={(e) => setRegData((p) => ({ ...p, tel: e.target.value }))} />
          </FormField>
          <FormField label="Email">
            <Input type="email" placeholder="email@exemple.sn" value={regData.email} onChange={(e) => setRegData((p) => ({ ...p, email: e.target.value }))} />
          </FormField>
          <FormField label="Ville">
            <Select value={regData.ville} onChange={(e) => setRegData((p) => ({ ...p, ville: e.target.value }))}>
              <option value="">Sélectionner…</option>
              {["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack", "Touba", "Autre"].map((ville) => (
                <option key={ville}>{ville}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Mot de passe *">
            <Input
              type="password"
              placeholder="Minimum 8 caractères"
              value={regData.pwd}
              onChange={(e) => {
                setRegData((p) => ({ ...p, pwd: e.target.value }));
                checkStrength(e.target.value);
              }}
            />
            <div style={{ height: 5, borderRadius: 999, background: "rgba(24,21,18,0.08)", marginTop: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pwdStrength * 25}%`, background: strengthColors[pwdStrength], transition: "all 0.3s", borderRadius: 999 }} />
            </div>
          </FormField>
          <FormField label="Confirmer le mot de passe *">
            <Input type="password" placeholder="Répétez le mot de passe" value={regData.pwd2} onChange={(e) => setRegData((p) => ({ ...p, pwd2: e.target.value }))} />
          </FormField>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16, cursor: "pointer", color: S.text2, lineHeight: 1.6 }}>
            <input type="checkbox" checked={cgu} onChange={(e) => setCgu(e.target.checked)} style={{ marginTop: 3, width: 15, height: 15 }} />
            <span>J'accepte les conditions générales de Car Express.</span>
          </label>
          <Btn onClick={handleRegister} accent={S.loc}>Créer mon compte</Btn>
        </>
      )}
    </AuthLayout>
  );
}

export function AgencyAuth({ onLogin, onBack }) {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!id || !pwd) {
      setError("Veuillez remplir vos identifiants.");
      return;
    }
    setError("");
    onLogin();
  };

  return (
    <AuthLayout
      heroSubtitle="Un espace partenaire plus fort visuellement pour inspirer confiance dès la connexion."
      heroBadge="Espace Agence"
      accent={S.vnt}
      badgeColor={S.vnt}
      onBack={onBack}
    >
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: S.text3, marginBottom: 8 }}>
          Portail partenaire
        </div>
        <h3 style={{ fontSize: 32, marginBottom: 8 }}>Gérez votre activité avec une présence plus premium</h3>
        <p style={{ color: S.text2, lineHeight: 1.7 }}>L'accès agence est réservé aux partenaires enregistrés par un administrateur Car Express.</p>
      </div>
      {error && <div style={{ fontSize: 12, color: S.loc, background: S.locLight, padding: "12px 14px", borderRadius: 14, marginBottom: 16 }}>{error}</div>}
      <FormField label="Identifiant agence *">
        <Input placeholder="ID fourni par Car Express" value={id} onChange={(e) => setId(e.target.value)} />
      </FormField>
      <FormField label="Mot de passe *">
        <div style={{ position: "relative" }}>
          <Input type={showPwd ? "text" : "password"} placeholder="Votre mot de passe" value={pwd} onChange={(e) => setPwd(e.target.value)} />
          <span onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 13, color: S.text3 }}>
            {showPwd ? "Masquer" : "Afficher"}
          </span>
        </div>
      </FormField>
      <Btn onClick={handleLogin} accent={S.vnt}>Accéder à mon espace</Btn>
      <Btn outline accent={S.black} style={{ marginTop: 12 }}>Contacter Car Express pour s'enregistrer</Btn>
    </AuthLayout>
  );
}

export function AdminAuth({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !pwd) {
      setError("Veuillez remplir vos identifiants.");
      return;
    }
    setError("");
    onLogin();
  };

  return (
    <AuthLayout
      heroSubtitle="Un accès administrateur plus net et plus crédible pour la supervision de la plateforme."
      heroBadge="Super Admin"
      accent={S.black}
      badgeColor="#ffffff"
      onBack={onBack}
    >
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: S.text3, marginBottom: 8 }}>
          Administration
        </div>
        <h3 style={{ fontSize: 32, marginBottom: 8 }}>Supervision sécurisée</h3>
        <p style={{ color: S.text2, lineHeight: 1.7 }}>Réservé à l'équipe Car Express pour la gestion globale de la plateforme.</p>
      </div>
      {error && <div style={{ fontSize: 12, color: S.loc, background: S.locLight, padding: "12px 14px", borderRadius: 14, marginBottom: 16 }}>{error}</div>}
      <FormField label="Email administrateur *">
        <Input type="email" placeholder="admin@carexpress.sn" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormField>
      <FormField label="Mot de passe *">
        <Input type="password" placeholder="Mot de passe sécurisé" value={pwd} onChange={(e) => setPwd(e.target.value)} />
      </FormField>
      <FormField label="Code 2FA">
        <Input placeholder="Code à 6 chiffres" value={otp} onChange={(e) => setOtp(e.target.value)} style={{ letterSpacing: 4, textAlign: "center" }} />
      </FormField>
      <Btn onClick={handleLogin}>Connexion sécurisée</Btn>
    </AuthLayout>
  );
}
