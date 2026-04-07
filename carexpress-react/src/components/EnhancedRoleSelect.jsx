import { useState } from "react";
import { useResponsive } from "../hooks/useResponsive";
import logo from "../assets/logofinal.png";
import landcruiserImg from "../assets/landcruiser.jpg";
import bmwImg from "../assets/bmw-x5-30d-2019-08_1.jpg";

const roles = [
  {
    key: "client",
    title: "Espace Client",
    eyebrow: "Location & achat",
    description: "Recherchez un vehicule, consultez les details, reservez une location ou lancez une demande d'achat.",
    accent: "#ffcc00",
    image: landcruiserImg,
    features: ["Recherche rapide", "Reservation en ligne", "Suivi du profil et des alertes"],
  },
  {
    key: "agency",
    title: "Espace Agence",
    eyebrow: "Partenaires",
    description: "Presentez vos vehicules, gerez vos annonces et centralisez vos demandes de clients.",
    accent: "#d40511",
    image: bmwImg,
    features: ["Gestion de flotte", "Suivi des demandes", "Mise en valeur des annonces"],
  },
  {
    key: "admin",
    title: "Super Admin",
    eyebrow: "Plateforme",
    description: "Supervisez les acces, les partenaires et le fonctionnement global de Car Express.",
    accent: "#ffffff",
    image: null,
    features: ["Vue globale", "Controle des acces", "Pilotage de la plateforme"],
  },
];

function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(255,255,255,${alpha})`;
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function EnhancedRoleSelect({ onSelect, onBack }) {
  const [hoveredRole, setHoveredRole] = useState("client");
  const { isMobile } = useResponsive();

  const rolesWrapStyle = {
    ...styles.rolesWrap,
    gridTemplateColumns: isMobile ? "repeat(auto-fit, minmax(280px, 1fr))" : styles.rolesWrap.gridTemplateColumns,
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowLeft} />
      <div style={styles.glowRight} />

      <div style={styles.container}>
        <div style={styles.topBar}>
          <button
            onClick={onBack}
            style={styles.backButton}
            type="button"
          >
            ← Retour a la vitrine
          </button>
          <div style={styles.brandWrap}>
            <div style={styles.brandBox}>
              <img src={logo} alt="Car Express" style={styles.logo} />
            </div>
            <div>
              <div style={styles.brandText}>Choisissez votre espace</div>
            </div>
          </div>
        </div>

        <div className="landing-luxe-role-layout" style={styles.layout}>
          <div style={styles.showcase}>
            <div style={styles.showcaseImageWrap}>
              {hoveredRole !== "admin" && (
                <>
                  <img
                    src={roles.find((item) => item.key === hoveredRole)?.image || landcruiserImg}
                    alt={hoveredRole}
                    style={styles.showcaseImage}
                  />
                  <div style={styles.showcaseOverlay} />
                </>
              )}
              {hoveredRole === "admin" && <div style={styles.adminBackdrop} />}

              <div style={styles.showcasePanel}>
                <div style={styles.showcaseKicker}>Selection active</div>
                <div style={styles.showcaseTitle}>{roles.find((item) => item.key === hoveredRole)?.title}</div>
                <div style={styles.showcaseText}>
                  {roles.find((item) => item.key === hoveredRole)?.description}
                </div>
              </div>
            </div>
          </div>

          <div style={rolesWrapStyle}>
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => onSelect(role.key)}
                onMouseEnter={() => setHoveredRole(role.key)}
                onMouseLeave={() => setHoveredRole((prev) => prev)}
                type="button"
                style={{
                  ...styles.roleCard,
                  ...(hoveredRole === role.key
                    ? {
                        ...styles.roleCardActive,
                        border: `1.4px solid ${hexToRgba(role.accent, 0.28)}`,
                        boxShadow: `0 6px 18px ${hexToRgba(role.accent, 0.10)}, 0 28px 60px rgba(0,0,0,0.18)`,
                      }
                    : {}),
                }}
              >
                <div style={styles.roleCardTop}>
                  <div style={{ ...styles.roleBadge, color: role.key === "admin" ? "#fff" : role.accent }}>
                    <span style={{ ...styles.roleDot, background: role.key === "admin" ? "#fff" : role.accent }} />
                    {role.eyebrow}
                  </div>
                  <span style={styles.roleArrow}>↗</span>
                </div>
                <div style={styles.roleTitle}>{role.title}</div>
                <div style={styles.roleDescription}>{role.description}</div>
                <div style={styles.roleFeatures}>
                  {role.features.map((feature) => (
                    <div key={feature} style={styles.roleFeature}>
                      <span style={styles.featureTick}>✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoBadge({ value, label }) {
  return (
    <div style={styles.infoBadge}>
      <div style={styles.infoValue}>{value}</div>
      <div style={styles.infoLabel}>{label}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at top left, rgba(255,204,0,0.16), transparent 26%), radial-gradient(circle at top right, rgba(212,5,17,0.12), transparent 24%), linear-gradient(180deg, #090909 0%, #111111 52%, #17120f 100%)",
    color: "#fff",
    pointerEvents: "auto",
  },
  glowLeft: {
    position: "absolute",
    top: -120,
    left: -120,
    width: 360,
    height: 360,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,204,0,0.18), transparent 70%)",
  },
  glowRight: {
    position: "absolute",
    top: 80,
    right: -120,
    width: 360,
    height: 360,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(212,5,17,0.18), transparent 70%)",
  },
  container: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "clamp(16px, 4vw, 24px) clamp(12px, 3vw, 20px) clamp(28px, 5vw, 44px)",
    position: "relative",
    zIndex: 1,
    pointerEvents: "auto",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "clamp(10px, 2vw, 16px)",
    flexWrap: "wrap",
    marginBottom: "clamp(18px, 3vw, 26px)",
    pointerEvents: "auto",
  },
  backButton: {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "clamp(10px, 2vw, 12px) clamp(14px, 3vw, 16px)",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "clamp(12px, 2vw, 14px)",
    pointerEvents: "auto",
  },
  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(10px, 2vw, 14px)",
  },
  brandBox: {
    padding: "clamp(8px, 2vw, 12px) 0",
  },
  logo: {
    height: window.innerWidth <= 600 ? 36 : 90,
    maxWidth: window.innerWidth <= 600 ? 120 : 220,
    width: "auto",
    display: "block",
    imageRendering: "-webkit-optimize-contrast",
    objectFit: "contain",
  },
  brandText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.82)",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "clamp(24px, 5vw, 40px)",
    marginBottom: "clamp(12px, 2vw, 18px)",
  },
  heroPanel: {
    borderRadius: "clamp(20px, 3vw, 32px)",
    padding: "clamp(18px, 4vw, 28px)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
  },
  heroKicker: {
    fontSize: 12,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.56)",
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: "clamp(2.4rem, 5vw, 4.4rem)",
    lineHeight: 0.94,
    margin: "0 0 14px",
    fontFamily: '"Space Grotesk", sans-serif',
  },
  heroText: {
    fontSize: 15,
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.72)",
    margin: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "clamp(8px, 1.5vw, 12px)",
    marginTop: "clamp(16px, 3vw, 22px)",
  },
  infoBadge: {
    borderRadius: "clamp(16px, 2.5vw, 22px)",
    padding: "clamp(12px, 2vw, 16px)",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 800,
    fontFamily: '"Space Grotesk", sans-serif',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.64)",
    lineHeight: 1.6,
  },
  rolesWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    alignItems: "start",
    gap: "clamp(12px, 2vw, 16px)",
    marginTop: "clamp(18px, 3vw, 28px)",
    position: "relative",
    zIndex: 3,
    maxHeight: "calc(100vh - 360px)",
    overflow: "auto",
  },
  roleCard: {
    textAlign: "left",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "clamp(20px, 3vw, 28px)",
    background: "rgba(255,255,255,0.06)",
    padding: "clamp(16px, 3vw, 22px)",
    color: "#fff",
    cursor: "pointer",
    position: "relative",
    zIndex: 4,
    transform: "translateZ(0)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
    transition: "all 0.25s ease",
    minHeight: 280,
  },
  roleCardActive: {
    transform: "translateZ(0)",
    background: "rgba(255,255,255,0.1)",
    border: "1.5px solid rgba(255,255,255,0.22)",
    boxShadow: "0 -4px 10px rgba(255,255,255,0.04), 0 28px 60px rgba(0,0,0,0.18)",
    zIndex: 30,
  },
  roleCardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 18,
  },
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "8px 12px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  roleDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    display: "inline-block",
  },
  roleArrow: {
    fontSize: 20,
    color: "rgba(255,255,255,0.66)",
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 800,
    fontFamily: '"Space Grotesk", sans-serif',
    marginBottom: 10,
  },
  roleDescription: {
    fontSize: 14,
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.72)",
    marginBottom: 18,
  },
  roleFeatures: {
    display: "grid",
    gap: 10,
  },
  roleFeature: {
    display: "flex",
    alignItems: "center",
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
  },
  featureTick: {
    color: "#ffcc00",
    fontWeight: 800,
  },
  showcase: {
    borderRadius: 32,
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
    minHeight: 160,
    position: "relative",
    zIndex: 0,
  },
  showcaseImageWrap: {
    position: "relative",
    minHeight: 180,
    background: "transparent",
  },
  showcaseImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },
  showcaseOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(12,12,12,0.5) 0%, rgba(12,12,12,0.12) 40%, rgba(12,12,12,0.0) 100%)",
    zIndex: 0,
  },
  adminBackdrop: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 24%), linear-gradient(135deg, #111111 0%, #1d1d1d 50%, #2d241b 100%)",
    zIndex: 0,
  },
  showcasePanel: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 8,
    padding: 20,
    borderRadius: 24,
    background: "rgba(0,0,0,0.34)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    zIndex: 1,
  },
  showcaseKicker: {
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.56)",
    marginBottom: 8,
  },
  showcaseTitle: {
    fontSize: 28,
    fontWeight: 800,
    fontFamily: '"Space Grotesk", sans-serif',
    marginBottom: 8,
  },
  showcaseText: {
    fontSize: 14,
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.72)",
    maxWidth: 620,
  },
};
