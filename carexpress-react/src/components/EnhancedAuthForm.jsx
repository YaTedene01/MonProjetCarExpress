import { useState } from "react";
import { useResponsive } from "../hooks/useResponsive";
import { getPricingBands } from "../utils/pricing";
import logo from "../assets/logofinal.png";
import landcruiserImg from "../assets/landcruiser.jpg";
import bmwImg from "../assets/bmw-x5-30d-2019-08_1.jpg";
import sprinterImg from "../assets/mercedes sprinter.jpg";

const roleConfig = {
  client: {
    accent: "#ffcc00",
    image: landcruiserImg,
    title: "Espace Client",
    helper: "Accedez a la recherche, aux fiches vehicules, aux reservations et aux demandes d'achat.",
    fields: ["name", "email", "password"],
    submit: "Entrer dans mon espace",
    stats: [
      { value: "Location", label: "Recherche et reservation" },
      { value: "Achat", label: "Dossier et frais service" },
      { value: "Profil", label: "Alertes et suivi" },
    ],
  },
  agency: {
    accent: "#d40511",
    image: bmwImg,
    title: "Espace Agence",
    helper: "Connectez-vous pour gerer vos vehicules, vos annonces et les demandes clients.",
    fields: ["email", "password"],
    submit: "Acceder a mon espace agence",
    stats: [
      { value: "Dashboard", label: "Pilotage activite" },
      { value: "Annonces", label: "Location et vente" },
      { value: "Alertes", label: "Demandes en attente" },
    ],
  },
  admin: {
    accent: "#ffffff",
    image: sprinterImg,
    title: "Super Admin",
    helper: "Controlez la plateforme, les acces et les partenaires depuis un espace centralise.",
    fields: ["email", "password"],
    submit: "Ouvrir le panneau admin",
    stats: [
      { value: "Users", label: "Utilisateurs et roles" },
      { value: "Agences", label: "Validation et suivi" },
      { value: "Systeme", label: "Etat plateforme" },
    ],
  },
};

export function EnhancedAuthForm({ title, subtitle, onSubmit, onBack, role }) {
  const config = roleConfig[role] || roleConfig.client;
  const [formData, setFormData] = useState({
    identifier: "",
    email: "",
    phone: "",
    city: "",
    activity: "",
    managerName: "",
    district: "",
    address: "",
    ninea: "",
    color: "#D40511",
    logo: null,
    password: "",
    confirmPassword: "",
    company: "",
    twoFactorCode: "",
    documents: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [clientMode, setClientMode] = useState("login");
  const [agencyMode, setAgencyMode] = useState("login");
  const [showConditions, setShowConditions] = useState(false);
  const { isMobile } = useResponsive();

  const formPanelStyle = {
    ...styles.formPanel,
    maxWidth: isMobile ? "100%" : styles.formPanel.maxWidth,
    padding: isMobile ? 14 : styles.formPanel.padding,
    borderRadius: isMobile ? 16 : 24,
  };

  const pageStyle = {
    ...styles.page,
    padding: isMobile ? "14px 12px 30px" : "22px 20px 40px",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccessMessage("");
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, logo: file }));
    setError("");
    setSuccessMessage("");
    setFieldErrors((prev) => ({ ...prev, logo: "" }));
  };

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, documents: files }));
    setError("");
    setSuccessMessage("");
    setFieldErrors((prev) => ({ ...prev, documents: "" }));
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};

    if (role === "client") {
      if (clientMode === "login") {
        if (!formData.identifier) nextErrors.identifier = "Renseignez votre email ou votre telephone.";
        if (!formData.password) nextErrors.password = "Renseignez votre mot de passe.";
      } else {
        if (!formData.phone) nextErrors.phone = "Le telephone est requis.";
        if (!formData.email) nextErrors.email = "L'email est requis.";
        if (!formData.city) nextErrors.city = "La ville est requise.";
        if (!formData.password) nextErrors.password = "Le mot de passe est requis.";
        if (!formData.confirmPassword) nextErrors.confirmPassword = "Confirmez votre mot de passe.";
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          nextErrors.email = "Entrez une adresse email valide.";
        }
        if (formData.password && formData.password.length < 8) {
          nextErrors.password = "Le mot de passe doit contenir au moins 8 caracteres.";
        }
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
          nextErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
        }
      }
    } else if (role === "agency") {
      if (agencyMode === "login") {
        if (!formData.email) nextErrors.email = "L'identifiant agence est requis.";
        if (!formData.password) nextErrors.password = "Le mot de passe est requis.";
      } else {
        if (!formData.company) nextErrors.company = "Le nom de l'agence est requis.";
        if (!formData.managerName) nextErrors.managerName = "Le nom du responsable est requis.";
        if (!formData.phone) nextErrors.phone = "Le telephone est requis.";
        if (!formData.email) nextErrors.email = "L'email est requis.";
        if (!formData.city) nextErrors.city = "La ville est requise.";
        if (!formData.ninea) nextErrors.ninea = "Le NINEA ou registre est requis.";
        if (!formData.color) nextErrors.color = "La couleur de l'agence est requise.";
        if (!formData.logo) nextErrors.logo = "Le logo de l'agence est requis.";
        if (!formData.documents?.length) nextErrors.documents = "Ajoutez au moins un document justificatif.";
        if (!formData.password) nextErrors.password = "Le mot de passe est requis.";
        if (!formData.confirmPassword) nextErrors.confirmPassword = "Confirmez votre mot de passe.";
        if (formData.password && formData.password.length < 8) {
          nextErrors.password = "Le mot de passe doit contenir au moins 8 caracteres.";
        }
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
          nextErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
        }
      }
    } else if (role === "admin") {
      if (!formData.email) nextErrors.email = "L'email administrateur est requis.";
      if (!formData.password) nextErrors.password = "Le mot de passe est requis.";
      if (!formData.twoFactorCode) nextErrors.twoFactorCode = "Le code 2FA est requis.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setError("Veuillez corriger les champs en erreur.");
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({ ...formData, mode: role === "client" ? clientMode : role === "agency" ? agencyMode : "login" });

      if (role === "agency" && agencyMode === "signup") {
        setSuccessMessage("Votre demande agence a ete envoyee. Vous pourrez vous connecter uniquement apres validation par l'administrateur.");
        setAgencyMode("login");
        setFormData({
          identifier: "",
          email: "",
          phone: "",
          city: "",
          activity: "",
          managerName: "",
          district: "",
          address: "",
          ninea: "",
          color: "#D40511",
          logo: null,
          password: "",
          confirmPassword: "",
          company: "",
          twoFactorCode: "",
          documents: [],
        });
      }
    } catch (submitError) {
      setError(submitError?.message || "Une erreur est survenue.");
      setFieldErrors((current) => ({ ...current, ...(submitError?.fieldErrors || {}) }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      {showConditions ? <TarificationModal onClose={() => setShowConditions(false)} /> : null}
      <div style={{ ...styles.glow, top: -120, left: -80, background: `radial-gradient(circle, ${config.accent}33, transparent 70%)` }} />
      <div style={{ ...styles.glow, top: 90, right: -120, background: "radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)" }} />

      <div className="landing-auth-luxe" style={styles.layout}>
        <div style={styles.formShell}>
          <div style={formPanelStyle}>
            <button
              onClick={onBack}
              style={styles.backButton}
              type="button"
            >
              ← Retour
            </button>

            <div style={styles.brandBar}>
              <div style={styles.brandBox}>
                <img src={logo} alt="Car Express" style={{ height: window.innerWidth <= 600 ? 36 : 90, maxWidth: window.innerWidth <= 600 ? 120 : 220, width: 'auto', display: 'block', imageRendering: '-webkit-optimize-contrast', objectFit: 'contain' }} />
              </div>
            </div>
            <div style={styles.formHeader}>
              <div style={{ ...styles.formAccent, background: config.accent }} />
              <div>
                <div style={styles.formKicker}>{role === "client" && clientMode === "signup" ? "Inscription" : role === "agency" && agencyMode === "signup" ? "Inscription" : "Connexion"}</div>
                <div style={styles.formTitle}>{title || config.title}</div>
              </div>
            </div>

            {role === "client" && (
              <div style={styles.modeTabs}>
                <button type="button" onClick={() => { setClientMode("login"); setError(""); setFieldErrors({}); }} style={{ ...styles.modeTab, ...(clientMode === "login" ? styles.modeTabActive : {}) }}>
                  Connexion
                </button>
                <button type="button" onClick={() => { setClientMode("signup"); setError(""); setFieldErrors({}); }} style={{ ...styles.modeTab, ...(clientMode === "signup" ? styles.modeTabActive : {}) }}>
                  Inscription
                </button>
              </div>
            )}

            {role === "client" && clientMode === "signup" && (
              <div style={styles.signupBanner}>
                <div style={styles.signupBannerTitle}>Creation de compte client</div>
                <div style={styles.signupBannerText}>
                  Renseignez votre telephone, votre email et votre ville pour acceder aux reservations, achats et alertes depuis votre espace personnel.
                </div>
              </div>
            )}

            {role === "agency" && agencyMode === "signup" && (
              <div style={styles.signupBanner}>
                <div style={styles.signupBannerTitle}>Demande d'enregistrement agence</div>
                <div style={styles.signupBannerText}>
                  Remplissez ce formulaire pour creer votre profil agence et acceder ensuite a votre espace partenaire.
                </div>
                <button type="button" onClick={() => setShowConditions(true)} style={styles.conditionsButton}>
                  Voir les conditions et tarifications
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {error && <div style={styles.errorMessage}>⚠ {error}</div>}
              {successMessage && <div style={styles.successMessage}>✓ {successMessage}</div>}

              {config.fields.includes("name") && false && (
                <Field
                  label="Nom complet"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Prenom et nom"
                />
              )}

              {role === "client" ? (
                clientMode === "login" ? (
                  <Field
                    label="Email ou telephone"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    placeholder="vous@carexpress.sn ou +221 77 000 00 00"
                    error={fieldErrors.identifier}
                  />
                ) : (
                  <>
                    <Field
                      label="Telephone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+221 77 000 00 00"
                      error={fieldErrors.phone}
                    />
                    <Field
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="vous@carexpress.sn"
                      type="email"
                      error={fieldErrors.email}
                    />
                    <Field
                      label="Ville"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Dakar"
                      error={fieldErrors.city}
                    />
                  </>
                )
              ) : (
                role === "agency" && agencyMode === "signup" ? (
                  <>
                    <Field
                      label="Nom de l'agence"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Ex : Dakar Auto Services"
                      error={fieldErrors.company}
                    />
                    <Field
                      label="Telephone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+221 77 000 00 00"
                      error={fieldErrors.phone}
                    />
                    <Field
                      label="Email professionnel"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@agence.sn"
                      type="email"
                      error={fieldErrors.email}
                    />
                    <Field
                      label="Ville"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Dakar"
                      error={fieldErrors.city}
                    />
                    <Field
                      label="Activite"
                      name="activity"
                      value={formData.activity || ""}
                      onChange={handleInputChange}
                      placeholder="Location et vente"
                    />
                    <Field
                      label="Responsable agence"
                      name="managerName"
                      value={formData.managerName || ""}
                      onChange={handleInputChange}
                      placeholder="Prenom et nom du responsable"
                      error={fieldErrors.managerName}
                    />
                    <Field
                      label="Quartier"
                      name="district"
                      value={formData.district || ""}
                      onChange={handleInputChange}
                      placeholder="Plateau, Almadies..."
                    />
                    <Field
                      label="Adresse complete"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      placeholder="Adresse complete de l'agence"
                    />
                    <Field
                      label="NINEA ou registre"
                      name="ninea"
                      value={formData.ninea || ""}
                      onChange={handleInputChange}
                      placeholder="SN-2026-00123"
                      error={fieldErrors.ninea}
                    />
                    <label style={styles.fieldWrap}>
                      <span style={styles.label}>Couleur de l'agence</span>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <input
                          type="color"
                          name="color"
                          value={formData.color || "#D40511"}
                          onChange={handleInputChange}
                          style={{ width: 52, height: 44, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, background: "transparent", padding: 4 }}
                        />
                        <input
                          type="text"
                          name="color"
                          value={formData.color || ""}
                          onChange={handleInputChange}
                          placeholder="#D40511"
                          style={{ ...styles.input, ...(fieldErrors.color ? styles.inputError : {}), margin: 0 }}
                        />
                      </div>
                      {fieldErrors.color ? <span style={styles.fieldError}>{fieldErrors.color}</span> : null}
                    </label>
                    <label style={styles.fieldWrap}>
                      <span style={styles.label}>Logo de l'agence</span>
                      <div style={{ ...styles.fileDropzone, ...(fieldErrors.logo ? styles.inputError : {}) }}>
                        <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: "none" }} />
                        <span style={styles.fileButton}>Joindre le logo</span>
                        <span style={styles.fileText}>{formData.logo?.name || "JPG, PNG ou WEBP, 5 Mo maximum."}</span>
                      </div>
                      {fieldErrors.logo ? <span style={styles.fieldError}>{fieldErrors.logo}</span> : null}
                    </label>
                    <FileField
                      label="Documents justificatifs"
                      error={fieldErrors.documents}
                      files={formData.documents}
                      onChange={handleDocumentsChange}
                    />
                  </>
                ) : (
                  <Field
                    label={role === "admin" ? "Email administrateur" : role === "agency" ? "Email ou telephone agence" : "Email"}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={role === "agency" ? "contact@agence.sn ou +221 77 000 00 00" : "vous@carexpress.sn"}
                    type={role === "agency" ? "text" : "email"}
                    error={fieldErrors.email}
                  />
                )
              )}

              <Field
                label="Mot de passe"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                type="password"
                error={fieldErrors.password}
              />

              {(role === "client" && clientMode === "signup") || (role === "agency" && agencyMode === "signup") ? (
                <>
                  <PasswordStrength strength={passwordStrength} />
                  <Field
                    label="Confirmer le mot de passe"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    type="password"
                    error={fieldErrors.confirmPassword}
                  />
                </>
              ) : null}

              {role === "admin" && (
                <Field
                  label="Code 2FA"
                  name="twoFactorCode"
                  value={formData.twoFactorCode}
                  onChange={handleInputChange}
                  placeholder="123456"
                  error={fieldErrors.twoFactorCode}
                  hint="Entrez le code a 6 chiffres genere par votre application d'authentification."
                />
              )}

              {/* inlineInfo removed per request (Acces / Securite) */}

              <button type="submit" disabled={isLoading} style={{ ...styles.submitButton, opacity: isLoading ? 0.7 : 1 }}>
                {isLoading
                  ? ((role === "client" && clientMode === "signup") || (role === "agency" && agencyMode === "signup") ? "Inscription..." : "Connexion...")
                  : role === "client" && clientMode === "signup"
                    ? "Creer mon compte"
                    : role === "agency" && agencyMode === "signup"
                      ? "Envoyer ma demande agence"
                      : config.submit}
              </button>

              {role === "agency" && agencyMode === "login" && (
                <button type="button" style={styles.secondaryButton} onClick={() => { setAgencyMode("signup"); setError(""); setFieldErrors({}); }}>
                  Contactez Car Express pour vous enregistrer
                </button>
              )}
            </form>

            <div style={styles.formFooter}>
              En continuant, vous accedez a l'espace correspondant a votre profil sur Car Express.
            </div>
          </div>

          {/* footer mini-info removed per request (hide Location/Achat/Gestion) */}
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = "text", error, hint }) {
  return (
    <label style={styles.fieldWrap}>
      <span style={styles.label}>{label}</span>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={{ ...styles.input, ...(error ? styles.inputError : {}) }} />
      {error ? <span style={styles.fieldError}>{error}</span> : hint ? <span style={styles.fieldHint}>{hint}</span> : null}
    </label>
  );
}

function FileField({ label, error, hint, files, onChange }) {
  return (
    <label style={styles.fieldWrap}>
      <span style={styles.label}>{label}</span>
      <div style={{ ...styles.fileDropzone, ...(error ? styles.inputError : {}) }}>
        <input type="file" multiple onChange={onChange} style={{ display: "none" }} />
        <span style={styles.fileButton}>Joindre des fichiers</span>
        <span style={styles.fileText}>NINEA, RCCM, piece d'identite, justificatifs administratifs.</span>
        {!!files?.length && (
          <div style={styles.fileList}>
            {files.map((file) => (
              <div key={`${file.name}-${file.size}`} style={styles.fileChip}>
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
      {error ? <span style={styles.fieldError}>{error}</span> : hint ? <span style={styles.fieldHint}>{hint}</span> : null}
    </label>
  );
}

function TarificationModal({ onClose }) {
  const sections = [
    {
      key: "rental",
      title: "Location",
      subtitle: "Commission admin appliquee sur le prix journalier de chaque annonce location.",
      rows: getPricingBands("rental"),
    },
    {
      key: "sale",
      title: "Achat",
      subtitle: "Commission admin appliquee sur le prix total de vente de chaque annonce achat.",
      rows: getPricingBands("sale"),
    },
  ];

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalCard}>
        <div style={styles.modalHeader}>
          <div>
            <div style={styles.signupBannerTitle}>Conditions et tarifications agence</div>
            <div style={styles.signupBannerText}>
              Car Express applique une commission admin calculee automatiquement selon la grille ci-dessous pour les annonces location et achat.
            </div>
          </div>
          <button type="button" onClick={onClose} style={styles.secondaryButton}>Fermer</button>
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          {sections.map((section) => (
            <div key={section.key} style={styles.tariffPanel}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{section.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.74)", lineHeight: 1.7 }}>{section.subtitle}</div>
              <div style={styles.tariffTable}>
                <div style={styles.tariffHead}>Prix</div>
                <div style={styles.tariffHead}>%</div>
                {section.rows.map((row) => (
                  <div key={row.label} style={styles.tariffCell}>
                    <span>{row.label}</span>
                    <strong>{row.percentage}%</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={styles.tariffNotice}>
            Lors de la creation d'une annonce, le pourcentage admin et le montant correspondant sont affiches automatiquement a partir du prix saisi.
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div style={styles.featureItem}>
      <span style={styles.featureDot}>•</span>
      <span>{text}</span>
    </div>
  );
}

function MiniInfo({ title, text }) {
  return (
    <div style={styles.miniInfo}>
      <div style={styles.miniInfoTitle}>{title}</div>
      <div style={styles.miniInfoText}>{text}</div>
    </div>
  );
}

// MiniLine removed — inline access/security info moved/removed per design request

function PasswordStrength({ strength }) {
  return (
    <div style={styles.strengthWrap}>
      <div style={styles.strengthTop}>
        <span style={styles.inlineInfoLabel}>Robustesse du mot de passe</span>
        <span style={{ ...styles.strengthText, color: strength.color }}>{strength.label}</span>
      </div>
      <div style={styles.strengthBar}>
        <div style={{ ...styles.strengthFill, width: `${strength.score}%`, background: strength.color }} />
      </div>
    </div>
  );
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 30;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 30;

  if (score < 40) return { score: Math.max(score, 10), label: "Faible", color: "#d40511" };
  if (score < 70) return { score, label: "Moyen", color: "#c39200" };
  return { score, label: "Fort", color: "#1a7a2e" };
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    padding: "22px 20px 40px",
    background:
      "radial-gradient(circle at top left, rgba(255,204,0,0.14), transparent 26%), radial-gradient(circle at top right, rgba(212,5,17,0.1), transparent 24%), linear-gradient(180deg, #090909 0%, #101010 52%, #17120f 100%)",
  },
  glow: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: "50%",
  },
  layout: {
    maxWidth: 1240,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: "clamp(10px, 2vw, 18px)",
    position: "relative",
    zIndex: 1,
    minWidth: 0,
    padding: "0 clamp(8px, 2vw, 16px)",
  },
  leftPanel: {
    borderRadius: 34,
    padding: 24,
    background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
  },
  backButton: {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "clamp(10px, 2.5vw, 12px) clamp(14px, 3vw, 16px)",
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: "clamp(14px, 3vw, 18px)",
    fontSize: "clamp(13px, 2.5vw, 14px)",
    transition: "all 0.2s ease",
    pointerEvents: "auto",
  },
  brandBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "clamp(10px, 2vw, 14px)",
    marginBottom: "clamp(18px, 4vw, 26px)",
  },
  brandBox: {
    padding: "clamp(8px, 2vw, 12px) 0",
  },
  leftContent: {
    marginBottom: 20,
  },
  leftKicker: {
    fontSize: 12,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.56)",
    marginBottom: 12,
  },
  leftTitle: {
    fontSize: "clamp(2.2rem, 4.5vw, 4.2rem)",
    lineHeight: 0.94,
    fontFamily: '"Space Grotesk", sans-serif',
    margin: "0 0 12px",
  },
  leftText: {
    fontSize: 15,
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.74)",
    margin: 0,
    maxWidth: 620,
  },
  featureList: {
    display: "grid",
    gap: 10,
    marginTop: 20,
  },
  statRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginTop: 22,
  },
  statCard: {
    borderRadius: 22,
    padding: "16px 16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
  },
  statValue: {
    fontSize: 20,
    fontWeight: 800,
    fontFamily: '"Space Grotesk", sans-serif',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.68)",
  },
  featureItem: {
    display: "flex",
    gap: 10,
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.72)",
  },
  featureDot: {
    color: "#ffcc00",
    fontWeight: 800,
  },
  visualCard: {
    position: "relative",
    minHeight: 300,
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 30px 70px rgba(0,0,0,0.22)",
  },
  visualImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  visualOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(8,8,8,0.06), rgba(8,8,8,0.8))",
  },
  visualCaption: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    padding: "18px 18px",
    borderRadius: 22,
    background: "rgba(0,0,0,0.34)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
  },
  visualKicker: {
    fontSize: 22,
    fontWeight: 800,
    fontFamily: '"Space Grotesk", sans-serif',
    marginBottom: 6,
  },
  visualText: {
    fontSize: 13,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.72)",
  },
  formShell: {
    display: "grid",
    gap: 14,
    alignContent: "start",
    minWidth: 0,
    justifyItems: "center",
  },
  formPanel: {
    borderRadius: 24,
    padding: "clamp(16px, 4vw, 22px)",
    maxWidth: 560,
    width: "100%",
    margin: "0 auto",
    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.36)",
    minWidth: 0,
    overflow: "hidden",
    boxSizing: "border-box",
  },
  formHeader: {
    display: "flex",
    gap: "clamp(10px, 2vw, 14px)",
    alignItems: "center",
    marginBottom: "clamp(16px, 3vw, 22px)",
  },
  modeTabs: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "clamp(6px, 1.5vw, 8px)",
    padding: "clamp(4px, 1vw, 6px)",
    borderRadius: "clamp(14px, 2.5vw, 18px)",
    background: "rgba(24,21,18,0.04)",
    marginBottom: "clamp(14px, 3vw, 18px)",
    width: "100%",
  },
  modeTab: {
    border: "1px solid rgba(255,255,255,0.32)",
    borderRadius: "clamp(10px, 2vw, 14px)",
    background: "transparent",
    color: "#5f5750",
    padding: "clamp(8px, 2vw, 11px) clamp(10px, 2vw, 12px)",
    fontSize: "clamp(12px, 2vw, 13px)",
    fontWeight: 700,
    cursor: "pointer",
  },
  modeTabActive: {
    background: "#181512",
    color: "#fff",
    boxShadow: "0 10px 24px rgba(17,17,17,0.12)",
  },
  signupBanner: {
    display: "grid",
    gap: 6,
    padding: "14px 16px",
    borderRadius: 18,
    background: "linear-gradient(180deg, rgba(255,204,0,0.18), rgba(255,204,0,0.12))",
    border: "1px solid rgba(255,204,0,0.38)",
    marginBottom: 18,
  },
  signupBannerTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  signupBannerText: {
    fontSize: 13,
    lineHeight: 1.65,
    color: "rgba(255,255,255,0.92)",
  },
  conditionsButton: {
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: "10px 14px",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
    width: "fit-content",
    marginTop: 6,
  },
  formAccent: {
    width: 16,
    height: 46,
    borderRadius: 999,
    flexShrink: 0,
  },
  formKicker: {
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#8f877f",
    marginBottom: 6,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: "#ffffff",
    fontFamily: '"Space Grotesk", sans-serif',
  },
  form: {
    display: "grid",
    gap: "clamp(12px, 2vw, 14px)",
    minWidth: 0,
  },
  inlineInfo: {
    display: "grid",
    gap: 8,
    padding: "14px 16px",
    borderRadius: 18,
    background: "rgba(24,21,18,0.04)",
    border: "1px solid rgba(24,21,18,0.08)",
  },
  inlineInfoRow: {
    display: "grid",
    gap: 3,
  },
  inlineInfoLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#8f877f",
    fontWeight: 700,
  },
  inlineInfoValue: {
    fontSize: 13,
    color: "#5f5750",
    lineHeight: 1.6,
  },
  strengthWrap: {
    display: "grid",
    gap: 8,
    padding: "2px 2px 4px",
  },
  strengthTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  strengthText: {
    fontSize: 12,
    fontWeight: 700,
  },
  strengthBar: {
    height: 10,
    borderRadius: 999,
    background: "rgba(24,21,18,0.08)",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 0.2s ease, background 0.2s ease",
  },
  fieldWrap: {
    display: "grid",
    gap: 8,
    minWidth: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#8f877f",
  },
  input: {
    boxSizing: "border-box",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    border: "1px solid rgba(24,21,18,0.1)",
    borderRadius: "clamp(14px, 2.5vw, 18px)",
    background: "rgba(255,255,255,0.86)",
    padding: "clamp(10px, 2vw, 14px) clamp(12px, 2.5vw, 16px)",
    fontSize: "clamp(13px, 2vw, 14px)",
    outline: "none",
    color: "#181512",
  },
  inputError: {
    border: "1px solid rgba(212,5,17,0.45)",
    background: "rgba(255,245,245,0.95)",
    boxShadow: "0 0 0 3px rgba(212,5,17,0.08)",
  },
  fileDropzone: {
    display: "grid",
    gap: 10,
    padding: "14px 16px",
    borderRadius: "clamp(14px, 2.5vw, 18px)",
    background: "rgba(255,255,255,0.06)",
    border: "1px dashed rgba(255,255,255,0.18)",
    cursor: "pointer",
  },
  fileButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
  },
  fileText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.72)",
  },
  fileList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  fileChip: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 11,
    lineHeight: 1.4,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  fieldError: {
    fontSize: 12,
    color: "#d40511",
    lineHeight: 1.4,
  },
  fieldHint: {
    fontSize: 12,
    color: "#8f877f",
    lineHeight: 1.5,
  },
  errorMessage: {
    borderRadius: 16,
    background: "rgba(212,5,17,0.08)",
    border: "1px solid rgba(212,5,17,0.24)",
    color: "#d40511",
    padding: "12px 14px",
    fontSize: 14,
  },
  successMessage: {
    borderRadius: 16,
    background: "rgba(26,122,46,0.14)",
    border: "1px solid rgba(26,122,46,0.28)",
    color: "#9ef0af",
    padding: "12px 14px",
    fontSize: 14,
    lineHeight: 1.6,
  },
  submitButton: {
    border: "2px solid rgba(255,255,255,0.7)",
    borderRadius: 999,
    background: "linear-gradient(135deg, #111111 0%, #2a241c 100%)",
    color: "#fff",
    padding: "clamp(12px, 2.5vw, 16px) clamp(18px, 4vw, 22px)",
    fontWeight: 800,
    fontSize: "clamp(13px, 2.5vw, 15px)",
    cursor: "pointer",
    marginTop: "clamp(4px, 1vw, 6px)",
    boxShadow: "0 18px 34px rgba(17,17,17,0.18)",
  },
  secondaryButton: {
    border: "1px solid rgba(255,255,255,0.72)",
    borderRadius: 999,
    background: "rgba(255,255,255,0.78)",
    color: "#181512",
    padding: "15px 20px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(17,17,17,0.06)",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 4000,
    background: "rgba(0,0,0,0.64)",
    backdropFilter: "blur(8px)",
    padding: 18,
    overflowY: "auto",
  },
  modalCard: {
    maxWidth: 920,
    margin: "0 auto",
    borderRadius: 28,
    background: "linear-gradient(180deg, rgba(15,15,15,0.98), rgba(29,24,19,0.98))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.36)",
    padding: 24,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  tariffPanel: {
    display: "grid",
    gap: 10,
    padding: 18,
    borderRadius: 20,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  tariffTable: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) auto",
    gap: 10,
    alignItems: "center",
  },
  tariffHead: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "rgba(255,255,255,0.52)",
    paddingBottom: 8,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  tariffCell: {
    display: "contents",
  },
  tariffNotice: {
    padding: "14px 16px",
    borderRadius: 18,
    background: "rgba(255,204,0,0.12)",
    border: "1px solid rgba(255,204,0,0.18)",
    color: "#f7e7a8",
    fontSize: 13,
    lineHeight: 1.7,
  },
  formFooter: {
    marginTop: 18,
    fontSize: 12,
    color: "#5f5750",
    lineHeight: 1.7,
  },
  footerInfoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    minWidth: 0,
  },
  miniInfo: {
    borderRadius: 22,
    padding: "16px 16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
  },
  miniInfoTitle: {
    fontSize: 18,
    fontWeight: 800,
    fontFamily: '"Space Grotesk", sans-serif',
    marginBottom: 4,
  },
  miniInfoText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.66)",
    lineHeight: 1.6,
  },
};
