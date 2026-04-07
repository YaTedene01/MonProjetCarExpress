import { useEffect, useRef, useState } from "react";
import { useResponsive } from "../hooks/useResponsive";
import logo from "../assets/logofinal.png";
import landcruiserImg from "../assets/landcruiser.jpg";
import mercedesImg from "../assets/mercedes sprinter.jpg";
import tucsonImg from "../assets/tucson.png";
import dusterImg from "../assets/duster.jpeg";
import hiaceImg from "../assets/toyota hiace.jpg";
import clioImg from "../assets/clio.png";
import bmwImg from "../assets/bmw-x5-30d-2019-08_1.jpg";
import kiaImg from "../assets/kia.png";
import hiluxImg from "../assets/toyotahilux.png";
import peugeot3008Img from "../assets/3008.png";

const vehicleImages = {
  'landcruiser.jpg': landcruiserImg,
  'mercedes sprinter.jpg': mercedesImg,
  'tucson.png': tucsonImg,
  'duster.jpeg': dusterImg,
  'toyota hiace.jpg': hiaceImg,
  'clio.png': clioImg,
  'bmw-x5-30d-2019-08_1.jpg': bmwImg,
  'kia.png': kiaImg,
  'toyotahilux.png': hiluxImg,
  '3008.png': peugeot3008Img,
};

export const S = {
  loc: '#D40511', locLight: '#FFF0F0', locMid: '#F5C6C6',
  vnt: '#FFCC00', vntLight: '#FFFBE0', vntMid: '#FFE066', vntText: '#7A5C00',
  black: '#111111', bg2: '#fffaf6', bg3: '#f1e8df',
  text: '#181512', text2: '#5f5750', text3: '#8f877f',
  border: 'rgba(24,21,18,0.1)', border2: 'rgba(24,21,18,0.18)',
  green: '#1a7a2e', greenLight: '#e6f4ea',
  radius: '18px', radiusSm: '12px',
};

// ── Topbar ────────────────────────────────────────────────────────────
export function Topbar({ right, badge, onLogout, onLogoClick, profile }) {
  const { isMobile } = useResponsive();
  const topbarPadding = isMobile ? '0 12px' : '0 18px';
  const topbarHeight = isMobile ? 64 : 72;
  const badgeFontSize = isMobile ? 10 : 11;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const profileName = profile?.name || "Mon profil";
  const profileEmail = profile?.email || "";
  const profileSubtitle = profile?.subtitle || right || "";
  const profileInitials = (profile?.initials || profileName.split(" ").map((part) => part[0]).join("").slice(0, 2) || "CE").toUpperCase();

  useEffect(() => {
    const handleOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,250,246,0.72)',
      backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      borderBottom: `1px solid ${S.border}`,
      boxShadow: '0 10px 30px rgba(17,17,17,0.05)',
      padding: topbarPadding, height: topbarHeight,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          onClick={onLogoClick}
          style={{ padding: '8px 0', cursor: onLogoClick ? 'pointer' : 'default' }}
        >
            <img src={logo} alt="Car Express" style={{ height: isMobile ? 48 : 110, maxWidth: isMobile ? 120 : 240, width: 'auto', objectFit: 'contain', display: 'block', imageRendering: '-webkit-optimize-contrast' }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10 }}>
        {badge && (
          <div style={{
            fontSize: badgeFontSize, color: badge.color || S.text3,
            background: badge.bg || S.bg2,
            padding: '4px 10px', borderRadius: 20,
            fontWeight: 500, letterSpacing: '0.2px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {badge.label}
          </div>
        )}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              border: `1px solid ${S.border}`,
              background: 'rgba(255,255,255,0.88)',
              borderRadius: 999,
              minHeight: isMobile ? 42 : 48,
              padding: isMobile ? '4px 6px 4px 10px' : '5px 7px 5px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 8 : 10,
              cursor: 'pointer',
              boxShadow: '0 10px 26px rgba(17,17,17,0.06)',
            }}
          >
            {!isMobile && (
              <div style={{ display: 'grid', textAlign: 'right', minWidth: 92 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: S.text, whiteSpace: 'nowrap' }}>{profileName}</span>
                <span style={{ fontSize: 11, color: S.text3, whiteSpace: 'nowrap' }}>{profileSubtitle}</span>
              </div>
            )}
            <div style={{
              width: isMobile ? 30 : 36,
              height: isMobile ? 30 : 36,
              borderRadius: '50%',
              background: S.black,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {profileInitials}
            </div>
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: `calc(100% + 10px)`,
              right: 0,
              width: isMobile ? 260 : 320,
              borderRadius: 24,
              border: `1px solid ${S.border}`,
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(18px)',
              boxShadow: '0 26px 60px rgba(17,17,17,0.12)',
              padding: '18px 16px 14px',
            }}>
              <div style={{ display: 'grid', justifyItems: 'center', gap: 8, paddingBottom: 14 }}>
                {profileEmail && <div style={{ fontSize: 13, color: S.text2 }}>{profileEmail}</div>}
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: S.black,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  fontWeight: 700,
                }}>
                  {profileInitials}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: S.text }}>Bonjour {profileName} !</div>
                {profileSubtitle && <div style={{ fontSize: 12, color: S.text3 }}>{profileSubtitle}</div>}
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogoClick?.();
                  }}
                  style={{
                    minHeight: 46,
                    borderRadius: 999,
                    border: `1px solid ${S.border2}`,
                    background: '#fff',
                    color: S.text,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Aller au site vitrine
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      minHeight: 44,
                      borderRadius: 14,
                      border: `1px solid ${S.border}`,
                      background: 'rgba(255,255,255,0.9)',
                      color: S.text,
                      cursor: 'pointer',
                    }}
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    style={{
                      minHeight: 44,
                      borderRadius: 14,
                      border: `1px solid ${S.locMid}`,
                      background: S.locLight,
                      color: S.loc,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── BottomNav ─────────────────────────────────────────────────────────
export function BottomNav({ items, active, onChange }) {
  const { isMobile } = useResponsive();
  const bottomHeight = isMobile ? 60 : 68;
  const bottomSpacing = isMobile ? 10 : 14;
  const iconSize = isMobile ? 16 : 20;
  const labelSize = isMobile ? 8 : 9.5;
  const itemPadding = isMobile ? '4px 8px' : '6px 14px';
  const iconWrapSize = isMobile ? 34 : 42;

  return (
    <div style={{
      position: 'fixed', bottom: bottomSpacing, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
      width: isMobile ? 'calc(100% - 20px)' : 'min(760px, calc(100% - 24px))',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      border: `1px solid ${S.border}`,
      borderRadius: isMobile ? 16 : 24,
      height: bottomHeight,
      maxWidth: isMobile ? '600px' : '760px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 8px',
      boxShadow: '0 18px 44px rgba(0,0,0,0.08)',
    }}>
      {items.map(item => {
        const isActive = active === item.key;
        return (
          <div key={item.key} onClick={() => onChange(item.key)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: itemPadding, cursor: 'pointer',
              borderRadius: 12, flex: 1, maxWidth: isMobile ? 60 : 72,
              background: 'transparent',
              transition: 'transform 0.2s ease',
              position: 'relative',
            }}>
            <NavIcon icon={item.icon} active={isActive} hasBadge={item.badge} size={iconSize} wrapSize={iconWrapSize} />
            <span style={{
              fontSize: labelSize, fontWeight: isActive ? 600 : 400,
              color: isActive ? S.black : S.text3,
              letterSpacing: '0.1px',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function NavIcon({ icon, active, hasBadge, size = 20, wrapSize = 40 }) {
  const color = active ? S.black : S.text3;
  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth={1.8} />,
    search: <><circle cx="11" cy="11" r="8" strokeWidth={1.8} /><path d="m21 21-4.35-4.35" strokeWidth={1.8} /></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth={1.8} /><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth={1.8} /></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth={1.8} /><circle cx="12" cy="7" r="4" strokeWidth={1.8} /></>,
    grid: <><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.8} /><line x1="3" y1="9" x2="21" y2="9" strokeWidth={1.8} /><line x1="9" y1="21" x2="9" y2="9" strokeWidth={1.8} /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth={1.8} /><circle cx="9" cy="7" r="4" strokeWidth={1.8} /><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth={1.8} /><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth={1.8} /></>,
    settings: <><circle cx="12" cy="12" r="3" strokeWidth={1.8} /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth={1.8} /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={1.8} /><line x1="16" y1="2" x2="16" y2="6" strokeWidth={1.8} /><line x1="8" y1="2" x2="8" y2="6" strokeWidth={1.8} /><line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.8} /></>,
  };
  return (
    <div style={{
      position: 'relative',
      width: wrapSize,
      height: wrapSize,
      borderRadius: active ? 16 : 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: active ? 'linear-gradient(180deg, #fff6ea 0%, #f7eadb 100%)' : 'linear-gradient(180deg, rgba(250,245,239,0.95) 0%, rgba(242,234,224,0.9) 100%)',
      border: active ? `1px solid ${S.border2}` : `1px solid ${S.border}`,
      boxShadow: active ? '0 10px 24px rgba(24,21,18,0.10)' : '0 6px 16px rgba(24,21,18,0.05)',
      transition: 'all 0.2s ease',
    }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}>{icons[icon]}</svg>
      {hasBadge && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 8, height: 8, borderRadius: '50%',
          background: S.loc, border: '1.5px solid #fff',
        }} />
      )}
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────────────────
export function PageHeader({ title, onBack, accent }) {
  const { isMobile } = useResponsive();
  const padding = isMobile ? '0 12px' : '0 16px';
  const headerHeight = isMobile ? 48 : 52;
  const fontSize = isMobile ? 13 : 14;

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `2px solid ${accent || S.black}`,
      padding, height: headerHeight,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, fontSize, color: S.text, padding: 0,
        }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={accent || S.black} strokeWidth={2}>
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {!isMobile && 'Retour'}
        </button>
      )}
      <span style={{ fontSize: 15, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {title}
      </span>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────
export function Hero({ eyebrow, title, subtitle, badge, accent }) {
  const { isMobile } = useResponsive();
  return (
    <div style={{
      margin: isMobile ? 12 : 16,
      background: 'linear-gradient(135deg, #101010 0%, #241b16 46%, #382419 100%)',
      borderRadius: 28, padding: isMobile ? '20px 16px' : '28px 22px',
      position: 'relative', overflow: 'hidden',
      border: `1px solid rgba(255,255,255,0.08)`,
      boxShadow: '0 26px 60px rgba(17,17,17,0.16)',
    }}>
      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '34px 34px',
      }} />
      {/* Accent glow */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        borderRadius: '50%', filter: 'blur(4px)',
        background: `radial-gradient(circle, ${accent || 'rgba(255,255,255,0.04)'} 0%, transparent 70%)`,
        opacity: 0.38,
      }} />
      {eyebrow && (
        <div style={{
          fontSize: isMobile ? 9 : 10, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.48)',
          textTransform: 'uppercase', marginBottom: 8, position: 'relative', fontWeight: 500,
        }}>
          {eyebrow}
        </div>
      )}
      <h2 style={{
        fontSize: isMobile ? 24 : 28, fontWeight: 800, color: '#fff',
        marginBottom: 8, position: 'relative', lineHeight: 1.02, maxWidth: 420,
      }}>
        {title}
      </h2>
      <p style={{ fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.68)', lineHeight: 1.7, position: 'relative', maxWidth: 460 }}>
        {subtitle}
      </p>
      {badge && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 14,
          border: `1px solid ${accent || 'rgba(255,255,255,0.18)'}`,
          borderRadius: 999, padding: '7px 14px', fontSize: isMobile ? 11 : 12,
          color: 'rgba(255,255,255,0.85)', position: 'relative',
          background: 'rgba(255,255,255,0.06)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent || '#fff', display: 'inline-block' }} />
          {badge}
        </div>
      )}
    </div>
  );
}

// ── SearchBox ─────────────────────────────────────────────────────────
export function SearchBox({ placeholder, value, onChange }) {
  const { isMobile } = useResponsive();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(255,255,255,0.72)', border: `1px solid ${S.border}`,
      borderRadius: S.radius, padding: isMobile ? '11px 14px' : '13px 16px',
      boxShadow: '0 10px 26px rgba(17,17,17,0.04)',
    }}>
      <svg width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke={S.text3} strokeWidth={2}>
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input type="text" placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        style={{ border: 'none', background: 'transparent', fontSize: isMobile ? 13 : 14, color: S.text, flex: 1, outline: 'none' }} />
    </div>
  );
}

// ── Tag ───────────────────────────────────────────────────────────────
export function Tag({ children, dark }) {
  const { isMobile } = useResponsive();
  return (
    <span style={{
      fontSize: isMobile ? 10 : 11, padding: isMobile ? '2px 6px' : '2px 8px', borderRadius: 999,
      border: `1px solid ${dark ? S.black : S.border2}`,
      color: dark ? '#fff' : S.text2,
      background: dark ? S.black : 'transparent',
    }}>
      {children}
    </span>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, trend, accent }) {
  const { isMobile } = useResponsive();
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${S.border}`,
      borderLeft: `3px solid ${accent || S.black}`,
      borderRadius: 12, padding: 14,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        fontSize: isMobile ? 9 : 10, letterSpacing: '0.6px', color: S.text3,
        textTransform: 'uppercase', marginBottom: 8, fontWeight: 500,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: isMobile ? 20 : 22, fontWeight: 600,
        fontFamily: 'DM Mono, monospace', color: S.text, letterSpacing: '-0.5px',
      }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, flexWrap: 'wrap' }}>
        {trend !== undefined && (
          <span style={{
            fontSize: isMobile ? 9 : 10, fontWeight: 600,
            color: trend >= 0 ? S.green : S.loc,
            background: trend >= 0 ? S.greenLight : S.locLight,
            padding: '1px 6px', borderRadius: 4,
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
        <span style={{ fontSize: isMobile ? 10 : 11, color: S.text3 }}>{sub}</span>
      </div>
    </div>
  );
}

// ── CarCard ───────────────────────────────────────────────────────────
export function CarCard({ vehicle, onClick, gridView, accent }) {
  const { isMobile } = useResponsive();
  const [hovered, setHovered] = useState(false);
  const haloColor = accent === S.loc ? 'rgba(212,5,17,0.12)' : 'rgba(255,204,0,0.18)';
  const borderHover = accent === S.loc ? S.locMid : S.vntMid;
  const vehicleImage = vehicle.image && vehicleImages[vehicle.image];

  const imageWidth = gridView ? '100%' : (isMobile ? 80 : 112);
  const imageHeight = gridView ? (isMobile ? 140 : 180) : (isMobile ? 70 : 92);
  const emojiSize = gridView ? (isMobile ? 30 : 36) : (isMobile ? 24 : 28);

  return (
    <div
      style={{
        display: 'flex', alignItems: gridView ? 'flex-start' : 'center',
        flexDirection: gridView ? 'column' : 'row',
        gap: gridView ? 10 : 13, background: 'rgba(255,255,255,0.82)',
        border: `1px solid ${hovered ? borderHover : S.border}`,
        borderRadius: 22, padding: gridView ? 14 : 15, cursor: 'pointer',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 24px 56px ${haloColor}, 0 10px 18px rgba(17,17,17,0.08)`
          : '0 10px 28px rgba(17,17,17,0.05)',
        transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s cubic-bezier(0.23,1,0.32,1), border-color 0.2s',
        position: 'relative',
        backdropFilter: 'blur(12px)',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: imageWidth, height: imageHeight,
        background: 'linear-gradient(180deg, #fffaf6 0%, #f1e8df 100%)', borderRadius: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: emojiSize, flexShrink: 0,
        border: `1px solid ${S.border}`,
        transform: hovered ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
        overflow: 'hidden',
      }}>
        {vehicleImage
          ? <img src={vehicleImage} alt={vehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : vehicle.emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0, width: gridView ? '100%' : 'auto' }}>
        <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 600, color: S.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: gridView ? 'normal' : 'nowrap' }}>
          {vehicle.name}
        </div>
        <div style={{ fontSize: isMobile ? 10 : 11, color: S.text3, marginTop: 1 }}>{vehicle.agency}</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
          {vehicle.tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
          <span style={{ fontSize: isMobile ? 11 : 12, color: accent || '#f59e0b' }}>{vehicle.stars}</span>
          <span style={{ fontSize: isMobile ? 10 : 11, color: S.text3 }}>{vehicle.rating}</span>
        </div>
      </div>

      {!gridView && (
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: S.text, fontFamily: 'DM Mono, monospace' }}>{vehicle.priceLabel}</div>
          <div style={{ fontSize: isMobile ? 10 : 11, color: S.text3, marginTop: 2 }}>{vehicle.priceUnit}</div>
        </div>
      )}
      {gridView && (
        <div style={{
          width: '100%', borderTop: `1px solid ${S.border}`,
          paddingTop: 8, marginTop: 2,
          display: 'flex', alignItems: 'baseline', gap: 4,
        }}>
          <span style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{vehicle.priceLabel}</span>
          <span style={{ fontSize: isMobile ? 9 : 10, color: S.text3 }}>{vehicle.priceUnit}</span>
        </div>
      )}
    </div>
  );
}

// ── ViewToggle ────────────────────────────────────────────────────────
export function ViewToggle({ view, onChange, count, accent }) {
  const btnStyle = (v) => ({
    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: `1px solid ${view === v ? (accent || S.black) : S.border2}`,
    borderRadius: S.radiusSm,
    background: view === v ? (accent || S.black) : '#fff',
    cursor: 'pointer', transition: 'all 0.15s',
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 12, color: S.text3 }}>{count} résultats</span>
      <div style={btnStyle('list')} onClick={() => onChange('list')}>
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={view === 'list' ? '#fff' : S.text2} strokeWidth={2}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      </div>
      <div style={btnStyle('grid')} onClick={() => onChange('grid')}>
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={view === 'grid' ? '#fff' : S.text2} strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      </div>
    </div>
  );
}

// ── SpecGrid ──────────────────────────────────────────────────────────
export function SpecGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
      {items.map((s, i) => (
        <div key={i} style={{ background: S.bg2, borderRadius: S.radiusSm, padding: '10px 12px', border: `1px solid ${S.border}` }}>
          <div style={{ fontSize: 10, color: S.text3, letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: 3 }}>{s.label}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>{s.val}</div>
        </div>
      ))}
    </div>
  );
}

// ── ReviewCard ────────────────────────────────────────────────────────
export function ReviewCard({ review }) {
  return (
    <div style={{ border: `1px solid ${S.border}`, borderRadius: 12, padding: 14, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{review.name}</div>
        <div style={{ fontSize: 11, color: S.text3 }}>{review.date}</div>
      </div>
      <div style={{ fontSize: 13, color: '#f59e0b', marginBottom: 6 }}>{review.stars}</div>
      <p style={{ fontSize: 13, color: S.text2, lineHeight: 1.55 }}>{review.text}</p>
    </div>
  );
}

// ── FormField ─────────────────────────────────────────────────────────
export function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 14, minWidth: 0 }}>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.6px', color: S.text3, textTransform: 'uppercase', marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function Input({ type = 'text', placeholder, value, onChange, style = {} }) {
  return (
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      className="ce-input"
      style={{
        width: '100%', boxSizing: 'border-box', minWidth: 0, padding: '11px 14px',
        border: `1px solid ${S.border}`, borderRadius: 14,
        fontSize: 14, color: S.text, background: 'rgba(255,255,255,0.84)',
        outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
        ...style,
      }}
    />
  );
}

export function Select({ value, onChange, children, style = {} }) {
  return (
    <select value={value} onChange={onChange}
      className="ce-select"
      style={{
        width: '100%', boxSizing: 'border-box', minWidth: 0, padding: '11px 14px',
        border: `1px solid ${S.border}`, borderRadius: 14,
        fontSize: 14, color: S.text, background: 'rgba(255,255,255,0.84)',
        outline: 'none', appearance: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...style,
      }}>
      {children}
    </select>
  );
}

// ── Button ────────────────────────────────────────────────────────────
export function Btn({ onClick, children, accent, outline, small, style = {} }) {
  const [hov, setHov] = useState(false);
  const { isMobile } = useResponsive();
  const bg = outline ? 'rgba(255,255,255,0.78)' : (accent || S.black);
  const color = outline
    ? (accent || S.text)
    : (accent === S.vnt ? S.vntText : '#fff');

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', padding: small ? (isMobile ? '9px 12px' : '11px 16px') : (isMobile ? '12px 14px' : '15px 18px'),
        border: `1px solid ${outline ? (accent || S.border2) : 'rgba(255,255,255,0.7)'}`,
        borderRadius: 16, background: bg, color,
        fontSize: small ? (isMobile ? 12 : 13) : (isMobile ? 14 : 15), fontWeight: 600, cursor: 'pointer',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hov
          ? (outline ? `0 14px 30px rgba(17,17,17,0.08)` : `0 18px 36px ${accent ? accent + '42' : 'rgba(17,17,17,0.18)'}`)
          : '0 8px 18px rgba(17,17,17,0.04)',
        transition: 'all 0.2s cubic-bezier(0.23,1,0.32,1)',
        ...style,
      }}>
      {children}
    </button>
  );
}

// ── SectionLabel ──────────────────────────────────────────────────────
export function SectionLabel({ children, dot }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 10, fontWeight: 600, letterSpacing: '0.8px',
      color: S.text3, textTransform: 'uppercase',
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block' }} />}
      {children}
    </div>
  );
}

// ── Notification overlay ──────────────────────────────────────────────
export function Notification({ notif, onClose }) {
  if (!notif) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 20,
      }}
      onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="animate-slide-up"
        style={{
          background: '#fff', borderRadius: 16, padding: '28px 24px',
          width: '100%', maxWidth: 380, textAlign: 'center',
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>{notif.icon}</div>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{notif.title}</div>
        <p style={{ fontSize: 13, color: S.text2, lineHeight: 1.6, marginBottom: 20 }}>{notif.msg}</p>
        <Btn onClick={onClose}>OK</Btn>
      </div>
    </div>
  );
}

// ── MapPlaceholder ────────────────────────────────────────────────────
export function MapPlaceholder({ address, accent }) {
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(address + ', Sénégal')}`;
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${S.border}` }}>
      <div style={{
        background: S.bg2, height: 160,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {['20%', '40%', '60%', '80%'].map(top => (
          <div key={top} style={{ position: 'absolute', top, left: 0, right: 0, height: 1, background: '#555', opacity: 0.06 }} />
        ))}
        {['25%', '50%', '75%'].map(left => (
          <div key={left} style={{ position: 'absolute', left, top: 0, bottom: 0, width: 1, background: '#555', opacity: 0.06 }} />
        ))}
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📍</div>
          <div style={{ fontSize: 12, color: S.text2 }}>{address}</div>
          <a href={mapsUrl} target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', marginTop: 8, fontSize: 11, color: accent || S.loc, textDecoration: 'underline' }}>
            Ouvrir dans Google Maps →
          </a>
        </div>
      </div>
    </div>
  );
}

// ── AgencyCard ────────────────────────────────────────────────────────
export function AgencyCard({ vehicle, accent, onClick }) {
  const agencyInfo = {
    'Agence Dakar Auto': { address: 'Dakar Plateau', stars: '★★★★☆', since: 'Depuis 2020' },
    'TransAfrica Location': { address: 'Almadies, Dakar', stars: '★★★★★', since: 'Depuis 2018' },
    'Premium Cars Dakar': { address: 'Mermoz, Dakar', stars: '★★★★☆', since: 'Depuis 2021' },
    'Dakar Auto Services': { address: 'Médina, Dakar', stars: '★★★★☆', since: 'Depuis 2019' },
    'Auto Plus SN · Dakar': { address: 'Sacré-Cœur, Dakar', stars: '★★★★☆', since: 'Depuis 2020' },
    'Élite Motors SN · Dakar': { address: 'Plateau, Dakar', stars: '★★★★★', since: 'Depuis 2017' },
    'AutoSud SN · Thiès': { address: 'Thiès Centre', stars: '★★★☆☆', since: 'Depuis 2022' },
    'MobileCar · Dakar': { address: 'Grand-Yoff, Dakar', stars: '★★★★★', since: 'Depuis 2019' },
  };
  const ag = agencyInfo[vehicle.agency] || { address: 'Dakar', stars: '★★★★☆', since: 'Depuis 2022' };
  const ini = vehicle.agency.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
        padding: 14, border: `1px solid ${S.border}`, borderRadius: 12,
        background: S.bg2, marginBottom: 12,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = accent || S.loc; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: S.black,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 600, color: '#fff', flexShrink: 0,
      }}>
        {ini}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{vehicle.agency}</div>
        <div style={{ fontSize: 12, color: S.text3, marginTop: 1 }}>{ag.address}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 12, color: accent || S.loc }}>{ag.stars}</span>
          <span style={{ fontSize: 11, color: S.text3 }}>{ag.since}</span>
        </div>
      </div>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={S.text3} strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
    </div>
  );
}

// ── ProfileMenuItem ───────────────────────────────────────────────────
export function ProfileMenuItem({ icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false);
  const icons = {
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    bag: <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    help: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    chart: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  };

  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 16px', borderBottom: `1px solid ${S.border}`,
        cursor: 'pointer',
        background: hov ? S.bg2 : 'transparent',
        transform: hov ? 'translateX(2px)' : 'translateX(0)',
        transition: 'all 0.15s',
      }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: danger ? '#FFF0F0' : S.bg2,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        border: `1px solid ${danger ? S.locMid : S.border}`,
      }}>
        <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={danger ? S.loc : S.text2} strokeWidth={1.8}>
          {icons[icon]}
        </svg>
      </div>
      <span style={{ fontSize: 14, color: danger ? S.loc : S.text, flex: 1, fontWeight: danger ? 500 : 400 }}>
        {label}
      </span>
      {!danger && (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={S.text3} strokeWidth={2}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </div>
  );
}

export const C = S;
