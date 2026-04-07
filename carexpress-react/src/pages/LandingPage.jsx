import { useEffect, useMemo, useRef, useState } from "react";
import { useResponsive } from "../hooks/useResponsive";
import logo from "../assets/logofinal.png";
import peugeotImg from "../assets/3008.png";
import bmwImg from "../assets/bmw-x5-30d-2019-08_1.jpg";
import clioImg from "../assets/clio.png";
import landcruiserImg from "../assets/landcruiser.jpg";
import sprinterImg from "../assets/mercedes sprinter.jpg";
import hiaceImg from "../assets/toyota hiace.jpg";
import tucsonImg from "../assets/tucson.png";
import kiaImg from "../assets/kia.png";
import hiluxImg from "../assets/toyotahilux.png";
import berlineImg from "../assets/berline.png";
import suvImg from "../assets/suv.png";
import vanImg from "../assets/van.png";
import pickupImg from "../assets/pickup.png";
import minibusImg from "../assets/minibus.png";
import economiqueImg from "../assets/economique.png";
import utilitaireImg from "../assets/utilitaire.png";
import luxeImg from "../assets/luxe.png";
import abarth from "../assets/marques/Abarth-LogoPNG2.png";
import ford from "../assets/marques/Ford_logo_PNG1.png";
import renault from "../assets/marques/Renault_logo_PNG5.png";
import audi from "../assets/marques/Audi_logo_PNG5.png";
import hyundai from "../assets/marques/Hyundai_logo_PNG14.png";
import peugeot from "../assets/marques/Peugeot_logo_PNG8.png";
import alfaRomeo from "../assets/marques/Alfa-Romeo-Logo.png";
import chevrolet from "../assets/marques/Chevrolet_logo_PNG9.png";
import citroen from "../assets/marques/Citroen_logo_PNG4.png";
import dacia from "../assets/marques/Dacia-LogoPNG2.png";
import fiat from "../assets/marques/Fiat_logo_PNG5.png";
import honda from "../assets/marques/Honda_logo_PNG4.png";
import mitsubishi from "../assets/marques/Mitsubishi_logo_PNG3.png";

const pageShell = {
  width: "100%",
  maxWidth: 1280,
  margin: "0 auto",
  paddingLeft: 16,
  paddingRight: 16,
  boxSizing: "border-box",
};

export default function LandingPage({ onGetStarted }) {
  const { isMobile } = useResponsive();

  const responsivePageShell = {
    ...pageShell,
    paddingLeft: isMobile ? 12 : pageShell.paddingLeft,
    paddingRight: isMobile ? 12 : pageShell.paddingRight,
  };

  const navShellStyle = {
    ...responsivePageShell,
    position: "relative",
    zIndex: 6,
  };

  const partnerRowStyle = {
    ...styles.partnerRow,
    gridTemplateColumns: isMobile ? "repeat(auto-fit, minmax(120px, 1fr))" : styles.partnerRow.gridTemplateColumns,
  };

  const reviewGridStyle = {
    ...styles.reviewGrid,
    gridTemplateColumns: isMobile ? "repeat(auto-fit, minmax(220px, 1fr))" : styles.reviewGrid.gridTemplateColumns,
  };

  const footerGridStyle = {
    ...styles.footerGrid,
    gridTemplateColumns: isMobile ? "repeat(auto-fit, minmax(140px, 1fr))" : styles.footerGrid.gridTemplateColumns,
  };

  const storyGridStyle = {
    ...styles.storyGrid,
    gridTemplateColumns: isMobile ? "1fr" : styles.storyGrid.gridTemplateColumns,
    gap: isMobile ? 20 : styles.storyGrid.gap,
  };

  const storyLogoCardStyle = {
    ...styles.storyLogoCard,
    minWidth: isMobile ? 200 : 280,
    padding: isMobile ? 16 : styles.storyLogoCard.padding,
  };

  const heroStageStyle = {
    ...styles.heroStage,
    minHeight: isMobile ? "78dvh" : "104dvh",
  };

  const heroContentStyle = {
    ...styles.heroContent,
    minHeight: isMobile ? "78dvh" : "104dvh",
    paddingTop: isMobile ? 20 : 28,
    paddingBottom: isMobile ? 40 : styles.heroContent.paddingBottom,
  };

  // Responsive button styles
  const loginButtonStyle = {
    ...styles.loginButton,
    padding: isMobile ? "8px 14px" : "14px 22px",
    fontSize: isMobile ? 12 : 15,
  };

  const typeArrowStyle = {
    ...styles.typeArrow,
    width: isMobile ? 40 : 48,
    height: isMobile ? 40 : 48,
  };

  const smallActionButtonStyle = {
    ...styles.smallActionButton,
    padding: isMobile ? "12px 20px" : "14px 28px",
    fontSize: isMobile ? 13 : 14,
  };

  const smallActionButtonDarkStyle = {
    ...styles.smallActionButtonDark,
    padding: isMobile ? "12px 20px" : "14px 28px",
    fontSize: isMobile ? 13 : 14,
  };

  // Responsive logo style
  const logoStyle = {
    height: isMobile ? 26 : 60,
    display: "block",
    maxWidth: isMobile ? 84 : 168,
    width: "auto",
    imageRendering: "auto",
    objectFit: "contain",
    transform: "translateZ(0)",
  };

  // Responsive glow styles
  const heroGlow1Style = {
    position: "fixed", 
    top: "5%", 
    right: "10%", 
    width: isMobile ? 200 : 300, 
    height: isMobile ? 200 : 300, 
    borderRadius: "50%", 
    background: "radial-gradient(circle, rgba(255,204,0,0.25), transparent 60%)", 
    pointerEvents: "none", 
    zIndex: 0
  };

  const heroGlow2Style = {
    position: "fixed", 
    bottom: "20%", 
    left: "5%", 
    width: isMobile ? 180 : 280, 
    height: isMobile ? 180 : 280, 
    borderRadius: "50%", 
    background: "radial-gradient(circle, rgba(212,5,17,0.2), transparent 65%)", 
    pointerEvents: "none", 
    zIndex: 0
  };

  // Responsive text styles
  const navLinkStyle = {
    ...styles.navLink,
    fontSize: isMobile ? 11 : 13,
    padding: isMobile ? "4px 8px" : "8px 14px",
    borderBottom: isMobile ? "1px solid rgba(255,255,255,0.35)" : "none",
    paddingBottom: isMobile ? "6px" : "8px",
    marginBottom: isMobile ? "-2px" : 0,
  };

  const navLinkHoverStyle = {
    ...styles.navLinkHover,
  };

  const sectionTitleStyle = {
    ...styles.sectionTitle,
    fontSize: isMobile ? 24 : 28,
  };

  const sectionSubtitleStyle = {
    ...styles.reviewSubtitle,
    fontSize: isMobile ? 13 : 14,
  };

  const navItems = [
    { label: "A propos de nous", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Types de véhicules", href: "#types" },
  ];

  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredType, setHoveredType] = useState(null);
  const [hoveredLogin, setHoveredLogin] = useState(false);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [hoveredBrand, setHoveredBrand] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const typeSliderRef = useRef(null);
  const brandSliderRef = useRef(null);

  const heroCars = useMemo(
    () => [
      { image: landcruiserImg, alt: "Toyota Land Cruiser", tag: "4x4 Premium", position: "center 78%" },
      { image: bmwImg, alt: "BMW X5", tag: "Confort Business", position: "center 74%" },
      { image: peugeotImg, alt: "Peugeot 3008", tag: "SUV Moderne", position: "center 74%" },
      { image: tucsonImg, alt: "Hyundai Tucson", tag: "Elegance Urbaine", position: "center 74%" },
      { image: kiaImg, alt: "Kia Sportage", tag: "Ligne Dynamique", position: "center 74%" },
    ],
    []
  );

  const vehicleTypes = useMemo(
    () => [
      {
        title: "Berline",
        image: berlineImg,
        tone: "linear-gradient(135deg, #e9eefb 0%, #dfe7f8 100%)",
        text: "Ideale pour la ville, les rendez-vous et les trajets du quotidien.",
      },
      {
        title: "SUV",
        image: suvImg,
        tone: "linear-gradient(135deg, #f4e8ea 0%, #f7eef0 100%)",
        text: "Un bon equilibre entre confort, style et presence sur la route.",
      },
      {
        title: "Van",
        image: vanImg,
        tone: "linear-gradient(135deg, #e8f0ef 0%, #edf6f4 100%)",
        text: "Parfait pour les groupes, les familles et les deplacements pro.",
      },
      {
        title: "Pick-up",
        image: pickupImg,
        tone: "linear-gradient(135deg, #f6eadf 0%, #fbf1e8 100%)",
        text: "Robuste et pratique pour le travail comme pour l'aventure.",
      },
      {
        title: "Minibus",
        image: minibusImg,
        tone: "linear-gradient(135deg, #ece8f5 0%, #f4f1fb 100%)",
        text: "La solution ideale pour transporter plusieurs passagers sereinement.",
      },
      {
        title: "Luxe",
        image: luxeImg,
        tone: "linear-gradient(135deg, #f3eadc 0%, #fbf4ea 100%)",
        text: "Une experience plus haut de gamme pour vos trajets importants.",
      },
      {
        title: "Economique",
        image: economiqueImg,
        tone: "linear-gradient(135deg, #e6f1eb 0%, #edf8f2 100%)",
        text: "Une option simple et efficace pour maitriser votre budget.",
      },
      {
        title: "Utilitaire",
        image: utilitaireImg,
        tone: "linear-gradient(135deg, #ececec 0%, #f6f6f6 100%)",
        text: "Adapte aux besoins intensifs, aux charges et aux missions terrain.",
      },
    ],
    []
  );

  const reviews = [
    {
      name: "Aminata",
      company: "Aliou Transport",
      text: "Car Express facilite vraiment la recherche, la reservation et le suivi. L'interface est plus claire et tres simple a utiliser.",
    },
    {
      name: "Moussa",
      company: "SenBus Logistics",
      text: "J'aime la rapidite du parcours location et la presentation des vehicules. On comprend vite ce qui est disponible.",
    },
    {
      name: "Khady",
      company: "Dakar Auto Services",
      text: "Pour une agence, le tableau de bord est plus parlant. Les annonces, les demandes et les alertes sont faciles a suivre.",
    },
  ];

  const footerColumns = [
    { title: "Entreprise", items: ["À propos", "Blog", "Services", "FAQ", "Conditions", "Contact"] },
    { title: "Nos Marques", items: ["Toyota", "Porsche", "Audi", "BMW", "Ford", "Nissan", "Peugeot", "Volkswagen"] },
    { title: "Types de véhicules", items: ["Berline", "SUV", "Van", "Pick-up", "Minibus", "Luxe", "Économique", "Utilitaire"] },
  ];

  const contactInfo = {
    title: "Contact",
    phone: "+221 77 757 12 51",
    email: "support@carexpress.sn",
    address: "Dakar, Sénégal",
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroCars.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [heroCars.length]);

  const scrollTypeSlider = (direction) => {
    if (!typeSliderRef.current) return;
    typeSliderRef.current.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  const scrollBrandSlider = (direction) => {
    if (!brandSliderRef.current) return;
    brandSliderRef.current.scrollBy({
      left: direction * 240,
      behavior: "smooth",
    });
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #1a1a1a 0%, #2a2520 35%, #1a1a1a 100%)",
        color: "#1b1d23",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Glow effects - jaune et rouge */}
      <div style={heroGlow1Style} />
      <div style={heroGlow2Style} />
      
      <section style={{ background: "linear-gradient(135deg, #181311 0%, #2d1f19 54%, #493026 100%)", color: "#fff", paddingBottom: 0, position: "relative", zIndex: 1 }}>
        <nav style={navShellStyle}>
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center", paddingTop: 5, paddingBottom: 5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", minHeight: 46 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={logo} alt="Car Express" style={logoStyle} />
                </div>
                <button 
                  onClick={onGetStarted} 
                  onMouseEnter={() => setHoveredLogin(true)}
                  onMouseLeave={() => setHoveredLogin(false)}
                  style={{ 
                    ...loginButtonStyle, 
                    ...(hoveredLogin ? styles.loginButtonHover : {}),
                  }}
                >
                  se connecter
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  minHeight: 40,
                  padding: "1px 8px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  flexDirection: "row",
                }}
              >
                {navItems.map((item) => {
                  const isTargetHover = ["Contact", "A propos de nous", "Types de véhicules"].includes(item.label);
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onMouseEnter={() => isTargetHover && setHoveredNav(item.href)}
                      onMouseLeave={() => isTargetHover && setHoveredNav(null)}
                      style={{
                        ...navLinkStyle,
                        ...(hoveredNav === item.href && isTargetHover ? navLinkHoverStyle : {}),
                      }}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 18,
                alignItems: "center",
                minHeight: 72,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <img src={logo} alt="Car Express" style={logoStyle} />
              </div>

              <div
                style={{
                  justifySelf: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  flexWrap: "wrap",
                  minHeight: 44,
                  padding: "1px 18px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  flexDirection: "row",
                }}
              >
                {navItems.map((item) => {
                  const isTargetHover = ["Contact", "A propos de nous", "Types de véhicules"].includes(item.label);
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onMouseEnter={() => isTargetHover && setHoveredNav(item.href)}
                      onMouseLeave={() => isTargetHover && setHoveredNav(null)}
                      style={{
                        ...navLinkStyle,
                        ...(hoveredNav === item.href && isTargetHover ? navLinkHoverStyle : {}),
                      }}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>

              <button 
                onClick={onGetStarted} 
                onMouseEnter={() => setHoveredLogin(true)}
                onMouseLeave={() => setHoveredLogin(false)}
                style={{ 
                  ...loginButtonStyle, 
                  ...(hoveredLogin ? styles.loginButtonHover : {}),
                }}
              >
                se connecter
              </button>
            </div>
          )}
        </nav>

        <div style={styles.heroBackdrop} />
        <div style={styles.heroGlow} />

        <div style={heroStageStyle}>
          <div style={styles.heroBackdrop} />
          <div style={styles.heroGlow} />
          {heroCars.map((car, index) => (
            <img
              key={car.alt}
              src={car.image}
              alt={car.alt}
              style={{
                ...styles.heroCarImage,
                objectPosition: car.position,
                ...(heroIndex === index ? styles.heroCarImageActive : styles.heroCarImageInactive),
              }}
            />
          ))}
          <div style={styles.heroOverlay} />

          <div style={{ ...responsivePageShell, ...heroContentStyle }}>
            <div style={styles.heroCopyBlock}>
              <div style={styles.heroBadge}>{heroCars[heroIndex].tag}</div>
              <h1 style={styles.heroTitle}>Trouver la voiture qu'il vous faut en un clic</h1>
              <p style={styles.heroText}>
                Des voitures plus belles, plus visibles et mises en avant dès l’arrivée sur la page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="types" style={{ ...responsivePageShell, paddingTop: 0, paddingBottom: 0, marginTop: 80, marginBottom: 42 }}>
        <div style={styles.sectionCenter}>
          <div style={styles.sectionKicker}>types de vehicule</div>
          <h2 style={sectionTitleStyle}>Choisissez le type de véhicule qui vous convient</h2>
        </div>

        <div style={styles.typeSliderShell}>
          <button type="button" onClick={() => scrollTypeSlider(-1)} style={typeArrowStyle}>
            ‹
          </button>

          <div ref={typeSliderRef} style={styles.typeGrid}>
            {vehicleTypes.map((item) => (
              <div
                key={item.title}
                onMouseEnter={() => setHoveredType(item.title)}
                onMouseLeave={() => setHoveredType(null)}
                style={{
                  ...styles.typeCard,
                  ...(hoveredType === item.title ? styles.typeCardHover : {}),
                }}
              >
                <div style={styles.typeImageWrap}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      ...styles.typeImage,
                      ...(hoveredType === item.title ? styles.typeImageHover : {}),
                    }}
                  />
                </div>
                <div style={styles.typeCopy}>
                  <div style={styles.typeLabel}>{item.title}</div>
                  <p style={styles.typeDescription}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={() => scrollTypeSlider(1)} style={typeArrowStyle}>
            ›
          </button>
        </div>
      </section>

      <section id="about" style={{ ...pageShell, ...styles.anchorSection, paddingTop: 0, paddingBottom: 16, marginTop: isMobile ? 0 : -80 }}>
        <div className="landing-luxe-hero" style={storyGridStyle}>
          <div style={storyLogoCardStyle}>
            <img src={logo} alt="Car Express" style={{ width: "100%", maxWidth: 360 }} />
          </div>

          <div style={{ display: "grid", gap: 16, alignContent: "center" }}>
            <div style={styles.sectionKicker}>Presentation</div>
            <h2 style={styles.storyTitle}>
              Une seule plateforme pour la location, l'achat et la gestion des annonces auto.
            </h2>
            <p style={styles.storyText}>
              Car Express relie les clients, les agences et le super administrateur dans une interface plus claire. Le client recherche et reserve. L'agence gere ses vehicules. L'administration supervise toute la plateforme.
            </p>
          </div>
        </div>
      </section>

      <section id="services" style={{ ...responsivePageShell, ...styles.anchorSection, paddingTop: 18, paddingBottom: 26 }}>
          <div className="landing-luxe-info-grid" style={styles.actionGrid}>
          <div style={{ ...styles.actionCard, background: "rgba(255,255,255,0.04)" }}>
            <div style={styles.frostOverlay} />
            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 14 }}>
              <div style={styles.actionTitle}>Vous voulez vous achetez une voiture ?</div>
              <p style={styles.actionText}>
                Recherchez, consultez les details, choisissez vos dates et lancez votre reservation plus simplement.
              </p>
              <button 
                onClick={onGetStarted} 
                onMouseEnter={() => setHoveredAction('buy')}
                onMouseLeave={() => setHoveredAction(null)}
                style={{
                  ...smallActionButtonStyle,
                  ...(hoveredAction === 'buy' ? { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(255,165,0,0.45)' } : {})
                }}
              >
                Acheter
              </button>
            </div>
          </div>

          <div style={{ ...styles.actionCard, background: "rgba(255,255,255,0.04)" }}>
            <div style={styles.frostOverlay} />
            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 14 }}>
              <div style={styles.actionTitle}>Vous voulez louer une voiture?</div>
              <p style={styles.actionText}>
                Les agences peuvent ajouter leurs annonces, gerer les demandes et suivre leurs revenus depuis un tableau de bord dedie.
              </p>
              <button 
                onClick={onGetStarted} 
                onMouseEnter={() => setHoveredAction('rent')}
                onMouseLeave={() => setHoveredAction(null)}
                style={{
                  ...smallActionButtonDarkStyle,
                  ...(hoveredAction === 'rent' ? { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(212,5,17,0.45)' } : {})
                }}
              >
                Louer
              </button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...responsivePageShell, paddingTop: 42, paddingBottom: 42 }}>
        <div style={styles.sectionCenter}>
          <div style={styles.sectionKicker}>nos partenaires</div>
          <h2 style={sectionTitleStyle}>Les meilleures marques automobiles</h2>
          <p style={sectionSubtitleStyle}>
            Car Express propose une sélection variée des plus grandes marques automobiles du monde pour répondre à tous vos besoins.
          </p>
        </div>

        <div style={styles.brandSliderShell}>
          <button type="button" onClick={() => scrollBrandSlider(-1)} style={typeArrowStyle}>
            ‹
          </button>

          <div ref={brandSliderRef} style={styles.brandGrid}>
            {[
              { name: "Abarth", logo: abarth },
              { name: "Ford", logo: ford },
              { name: "Renault", logo: renault },
              { name: "Audi", logo: audi },
              { name: "Hyundai", logo: hyundai },
              { name: "Peugeot", logo: peugeot },
              { name: "Alfa Romeo", logo: alfaRomeo },
              { name: "Chevrolet", logo: chevrolet },
              { name: "Citroen", logo: citroen },
              { name: "Dacia", logo: dacia },
              { name: "Fiat", logo: fiat },
              { name: "Honda", logo: honda },
              { name: "Mitsubishi", logo: mitsubishi },
            ].map((brand) => (
              <div 
                key={brand.name}
                onMouseEnter={() => setHoveredBrand(brand.name)}
                onMouseLeave={() => setHoveredBrand(null)}
                style={{
                  ...styles.partnerBrandCard,
                  ...(hoveredBrand === brand.name ? styles.partnerBrandCardHover : {})
                }}
              >
                <img src={brand.logo} alt={brand.name} style={styles.partnerBrandLogo} />
              </div>
            ))}
          </div>

          <button type="button" onClick={() => scrollBrandSlider(1)} style={typeArrowStyle}>
            ›
          </button>
        </div>
      </section>

      <section style={{ ...responsivePageShell, paddingTop: 50, paddingBottom: 42 }}>
        <div style={styles.sectionCenter}>
          <div style={styles.sectionKicker}>temoignages</div>
          <h2 style={{ ...sectionTitleStyle, color: "#fff" }}>Ce que disent nos clients</h2>
          <p style={sectionSubtitleStyle}>
            Découvrez comment les utilisateurs et partenaires perçoivent leur experience sur Car Express.
          </p>
        </div>

        <div className="landing-luxe-info-grid" style={reviewGridStyle}>
          {reviews.map((review) => (
            <div key={review.name + review.company} style={styles.reviewCard}>
              <div style={styles.reviewAvatar}>{review.name[0]}</div>
              <p style={styles.reviewText}>{review.text}</p>
              <div style={styles.reviewName}>{review.name}</div>
              <div style={styles.reviewCompany}>{review.company}</div>
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" style={{ ...styles.anchorSection, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 40, paddingBottom: 56, background: "#15110f" }}>
        <div style={{ ...responsivePageShell, display: "grid", gap: 34 }}>
          <div className="landing-luxe-info-grid" style={footerGridStyle}>
            {footerColumns.map((column) => (
              <div key={column.title} style={{ display: "grid", gap: 12 }}>
                <div style={styles.footerTitleDark}>{column.title}</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {column.items.map((item) => (
                    <div key={item} style={styles.footerItemDark}>{item}</div>
                  ))}
                </div>
              </div>
            ))}

              <div style={{ display: "grid", gap: 12 }}>
                <div style={styles.footerTitleDark}>{contactInfo.title}</div>
                <div style={styles.footerItemDark}>Téléphone : {contactInfo.phone}</div>
                <div style={styles.footerItemDark}>Email : {contactInfo.email}</div>
                <div style={styles.footerItemDark}>Adresse : {contactInfo.address}</div>
              </div>

            <div style={{ display: "grid", gap: 14 }}>
                <div style={styles.footerTitleDark}>Horaires</div>
                <div style={styles.footerItemDark}>Lundi - Vendredi : 09h00 - 21h00</div>
                <div style={styles.footerItemDark}>Samedi : 09h00 - 19h00</div>
                <div style={styles.footerItemDark}>Dimanche : Fermé</div>
                <div style={{ ...styles.footerTitleDark, marginTop: 8 }}>Connectez-vous avec nous</div>
              <div style={{ display: "flex", gap: 10 }}>
                {["f", "x", "ig", "in"].map((item) => (
                  <div key={item} style={styles.socialPillDark}>{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  navLink: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 13,
    color: "rgba(255,255,255,0.82)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    transition: "color 0.22s ease, transform 0.22s ease, text-shadow 0.22s ease",
  },
  navLinkHover: {
    color: "#ffffff",
    textShadow: "0 0 8px rgba(255,255,255,0.95)",
    transform: "translateY(-1px)",
    transition: "color 0.18s ease, transform 0.18s ease, text-shadow 0.18s ease",
  },
  anchorSection: {
    scrollMarginTop: 120,
  },
  loginButton: {
    border: "none",
    borderRadius: 999,
    background: "linear-gradient(135deg, #ffcc00 0%, #d40511 100%)",
    color: "#fff",
    padding: "14px 22px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(212,5,17,0.25)",
    position: "relative",
    overflow: "hidden",
  },
  loginButtonHover: {
    background: "linear-gradient(135deg, #d40511 0%, #ffcc00 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 12px 28px rgba(212,5,17,0.35)",
  },
  heroStage: {
    position: "relative",
    height: "100%",
    width: "100%",
    display: "grid",
    alignItems: "end",
    isolation: "isolate",
    paddingBottom: 54,
    overflow: "hidden",
  },
  heroBackdrop: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle at 45% 40%, rgba(0,0,0,0.32), rgba(0,0,0,0.02) 35%, transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.4) 48%, rgba(0,0,0,0.17) 100%)",
    zIndex: 0,
  },
  heroGlow: {
    position: "absolute",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(212,5,17,0.35), rgba(212,5,17,0.03) 62%)",
    filter: "blur(34px)",
  },
  heroCarImage: {
    position: "absolute",
    top: 0,
    left: "50%",
    bottom: 0,
    width: "100vw",
    height: "100%",
    maxWidth: "none",
    transform: "translateX(-50%)",
    objectFit: "cover",
    objectPosition: "center 74%",
    filter: "drop-shadow(0 50px 80px rgba(0,0,0,0.45)) saturate(1.08) contrast(1.04)",
    opacity: 0,
    transition: "opacity 1.2s ease, transform 1.6s ease",
    zIndex: 0,
  },
  heroCarImageActive: {
    opacity: 1,
    transform: "translateX(-50%) scale(1.03)",
  },
  heroCarImageInactive: {
    opacity: 0,
    transform: "translateX(-50%) scale(1.07)",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.45) 100%)",
    zIndex: 3,
  },
  heroContent: {
    position: "relative",
    zIndex: 4,
    width: "100%",
    paddingTop: 0,
    paddingBottom: 56,
    minHeight: "70dvh",
    display: "grid",
    alignItems: "end",
  },
  heroCopyBlock: {
    display: "grid",
    gap: 18,
    alignContent: "end",
  },
  heroBadge: {
    width: "fit-content",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    padding: "10px 16px",
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#fff7f2",
    fontWeight: 700,
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(2.6rem, 6vw, 5.8rem)",
    lineHeight: 0.92,
    color: "#f7f4ef",
    maxWidth: 700,
    fontWeight: 800,
    letterSpacing: "-0.07em",
  },
  heroText: {
    margin: 0,
    maxWidth: 560,
    color: "rgba(255,255,255,0.82)",
    fontSize: "clamp(1rem, 1.5vw, 1.1rem)",
    lineHeight: 1.7,
  },
  sectionCenter: {
    display: "grid",
    gap: 10,
    justifyItems: "center",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionKicker: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    color: "rgba(255,255,255,0.58)",
    fontWeight: 700,
  },
  sectionTitle: {
    margin: 0,
    fontSize: "clamp(1.8rem, 3.2vw, 3rem)",
    lineHeight: 1.02,
    color: "#f7f4ef",
    fontWeight: 800,
    letterSpacing: "-0.05em",
    maxWidth: 920,
  },
  typeSliderShell: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gap: 16,
    alignItems: "center",
  },
  typeGrid: {
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: "minmax(320px, 360px)",
    gap: 22,
    overflowX: "auto",
    scrollBehavior: "smooth",
    scrollbarWidth: "none",
    padding: "6px 4px 18px",
  },
  typeArrow: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 18px 32px rgba(0, 0, 0, 0.25)",
    background: "rgba(255,255,255,0.06)",
    color: "#f7f4ef",
    display: "grid",
    placeItems: "center",
  },
  typeCard: {
    display: "grid",
    gap: 18,
    gridTemplateRows: "220px auto",
    minHeight: 430,
    padding: "28px 24px",
    borderRadius: 34,
    transition: "transform 0.35s ease, box-shadow 0.35s ease",
    scrollSnapAlign: "start",
  },
  typeCardHover: {
    transform: "translateY(-6px)",
  },
  typeImageWrap: {
    width: "100%",
    minHeight: 220,
    borderRadius: 26,
    background: "transparent",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
  },
  typeImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: 6,
    filter: "drop-shadow(0 20px 28px rgba(0,0,0,0.2))",
    transition: "transform 0.35s ease, filter 0.35s ease",
  },
  typeImageHover: {
    transform: "translateY(-4px) scale(1.03)",
    filter: "drop-shadow(0 26px 34px rgba(0,0,0,0.24))",
  },
  typeCopy: {
    display: "grid",
    gap: 14,
    alignContent: "start",
  },
  typeLabel: {
    fontSize: 24,
    fontWeight: 800,
    color: "#ffffff",
    textAlign: "left",
    width: "100%",
  },
  typeDescription: {
    margin: 0,
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 1.7,
  },
  storyGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 0.82fr) minmax(0, 1.18fr)",
    gap: 28,
    alignItems: "center",
  },
  storyLogoCard: {
    minWidth: 280,
    display: "grid",
    placeItems: "center",
    background: "transparent",
    borderRadius: 0,
    border: "none",
    boxShadow: "none",
    padding: 24,
  },
  storyTitle: {
    margin: 0,
    fontSize: "clamp(2rem, 4vw, 4rem)",
    lineHeight: 0.98,
    letterSpacing: "-0.06em",
    fontWeight: 800,
    color: "#f7f4ef",
    maxWidth: 760,
  },
  storyText: {
    margin: 0,
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 1.9,
    maxWidth: 660,
  },
  darkButton: {
    border: "none",
    borderRadius: 12,
    background: "transparent",
    color: "#fff",
    padding: 0,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    width: "fit-content",
  },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 18,
  },
  actionCard: {
    borderRadius: 24,
    padding: "28px 26px",
    border: "1px solid rgba(24,21,18,0.07)",
    boxShadow: "0 20px 46px rgba(24,21,18,0.06)",
    display: "grid",
    gap: 14,
    position: "relative",
    overflow: "hidden",
  },

  frostOverlay: {
    position: "absolute",
    inset: 0,
    borderRadius: 24,
    background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.04)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  actionTitle: {
    fontSize: 30,
    lineHeight: 1.05,
    fontWeight: 800,
    color: "#ffffff",
    maxWidth: 360,
    letterSpacing: "-0.04em",
  },
  actionText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.8,
    color: "#ffffff",
    maxWidth: 420,
  },
  smallActionButton: {
    border: "none",
    borderRadius: 999,
    background: "linear-gradient(135deg, #ffcc00 0%, #ffa500 100%)",
    color: "#fff",
    padding: "14px 28px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    width: "fit-content",
    boxShadow: "0 8px 20px rgba(255,165,0,0.35)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  smallActionButtonDark: {
    border: "none",
    borderRadius: 999,
    background: "linear-gradient(135deg, #d40511 0%, #ff6b6b 100%)",
    color: "#fff",
    padding: "14px 28px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    width: "fit-content",
    boxShadow: "0 8px 20px rgba(212,5,17,0.35)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  partnerRow: {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
    gap: 14,
    alignItems: "center",
  },
  brandSliderShell: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gap: 16,
    alignItems: "center",
  },
  brandGrid: {
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: "minmax(200px, 220px)",
    gap: 20,
    overflowX: "auto",
    scrollBehavior: "smooth",
    scrollbarWidth: "none",
    padding: "6px 4px 18px",
  },
  partnerBrandCard: {
    minHeight: 140,
    borderRadius: 24,
    border: "none",
    background: "transparent",
    display: "grid",
    placeItems: "center",
    padding: "20px 16px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    scrollSnapAlign: "start",
  },
  partnerBrandCardHover: {
    background: "transparent",
    transform: "translateY(-4px)",
    boxShadow: "none",
    borderColor: "transparent",
  },
  partnerBrandLogo: {
    maxWidth: "100%",
    maxHeight: "80px",
    objectFit: "contain",
    filter: "brightness(1.1)",
  },
  partnerLogo: {
    minHeight: 70,
    borderRadius: 18,
    border: "1px solid rgba(24,21,18,0.08)",
    background: "rgba(255,255,255,0.05)",
    display: "grid",
    placeItems: "center",
    color: "rgba(255,255,255,0.72)",
    fontWeight: 700,
    letterSpacing: "0.12em",
    fontSize: 12,
  },
  reviewSubtitle: {
    margin: 0,
    maxWidth: 680,
    color: "rgba(255,255,255,0.68)",
    lineHeight: 1.8,
  },
  reviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
  },
  reviewCard: {
    borderRadius: 24,
    padding: 24,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "grid",
    gap: 14,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
  },
  reviewText: {
    margin: 0,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 1.8,
  },
  reviewName: {
    fontWeight: 700,
    color: "#fff",
  },
  reviewCompany: {
    color: "rgba(255,255,255,0.54)",
    fontSize: 14,
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 18,
  },
  footerTitleDark: {
    color: "#f7f4ef",
    fontWeight: 700,
  },
  footerItemDark: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 14,
  },
  socialPillDark: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
  },
};
