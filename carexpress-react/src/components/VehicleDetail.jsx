import { useState, useEffect } from "react";
import { PageHeader, SpecGrid, ReviewCard, AgencyCard, MapPlaceholder, Btn, Input, FormField, Select } from "./UI";
import { agencyInfo, unavailablePeriods } from "../data";
import { useResponsive } from "../hooks/useResponsive";
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
import { formatMoney, getPricingDetails } from "../utils/pricing";

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

function resolveVehicleImageSrc(image) {
  if (!image) return null;
  if (/^https?:\/\//i.test(image) || image.startsWith("blob:") || image.startsWith("/")) {
    return image;
  }
  if (vehicleImages[image]) {
    return vehicleImages[image];
  }

  try {
    return new URL(`../assets/${image}`, import.meta.url).href;
  } catch {
    return null;
  }
}

function parseDateOnly(value) {
  if (!value || typeof value !== "string") return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const S = {
  loc:'#D40511', locLight:'#FFF0F0', locMid:'#F5C6C6',
  vnt:'#FFCC00', vntLight:'#FFFBE0', vntMid:'#FFE066', vntText:'#7A5C00',
  black:'#111111', bg2:'#fffaf6', text:'#181512', text2:'#5f5750', text3:'#8f877f',
  border:'rgba(24,21,18,0.1)', border2:'rgba(24,21,18,0.18)',
};

// ── Gallery ───────────────────────────────────────────────────────────
function Gallery({ emoji, image, images, accent }) {
  const { isMobile } = useResponsive();
  const [photoIdx, setPhotoIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageSources = Array.isArray(images) && images.length > 0 ? images : [image];
  const vehiclePhotos = imageSources
    .map((item) => resolveVehicleImageSrc(item))
    .filter(Boolean);
  const photos = vehiclePhotos.length ? vehiclePhotos : [emoji, emoji, emoji, emoji];
  const isImage = () => vehiclePhotos.length > 0;
  const galleryHeight = isMobile ? 220 : 280;
  const thumbWidth = isMobile ? 60 : 72;
  const thumbHeight = isMobile ? 44 : 52;
  const canZoomOut = zoomLevel > 1;
  const canZoomIn = zoomLevel < 3;
  const [brokenPhotos, setBrokenPhotos] = useState({});

  useEffect(() => {
    if (!isFullscreen) {
      setZoomLevel(1);
    }
  }, [isFullscreen]);

  useEffect(() => {
    setZoomLevel(1);
  }, [photoIdx]);

  useEffect(() => {
    setBrokenPhotos({});
  }, [image, images]);

  const changeZoom = (direction) => {
    setZoomLevel((current) => {
      const next = direction === "in" ? current + 0.25 : current - 0.25;
      return Math.max(1, Math.min(3, Number(next.toFixed(2))));
    });
  };

  const getDisplayPhoto = (photo, index) => {
    if (!brokenPhotos[index]) {
      return photo;
    }

    return null;
  };

  return (
    <div style={{padding:'16px 16px 0'}}>
      <div
        onClick={() => setIsFullscreen(true)}
        style={{height:galleryHeight,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',borderRadius:28,overflow:'hidden',background:'linear-gradient(180deg, #fffaf6 0%, #efe6dd 100%)',boxShadow:'0 26px 60px rgba(17,17,17,0.08)',cursor:'zoom-in'}}
      >
        <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at top right, ${accent}22 0%, transparent 45%)`}} />
        {isImage() && getDisplayPhoto(photos[photoIdx], photoIdx) ? (
          <img
            src={getDisplayPhoto(photos[photoIdx], photoIdx)}
            alt="Vehicle"
            style={{width:'100%',height:'100%',objectFit:'cover'}}
            onError={() => setBrokenPhotos((current) => ({ ...current, [photoIdx]: true }))}
          />
        ) : (
          <span style={{fontSize:isMobile ? 60 : 80,transition:'transform 0.3s'}}>{photos[photoIdx]}</span>
        )}
        <div style={{position:'absolute',top:14,left:14,display:'inline-flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:999,background:'rgba(255,255,255,0.76)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.45)',fontSize:isMobile ? 9 : 11,fontWeight:600,color:S.text}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:accent,display:'inline-block'}} />
          Car Express Selection
        </div>
        <div style={{position:'absolute',bottom:14,right:14,background:'rgba(17,17,17,0.58)',backdropFilter:'blur(10px)',color:'#fff',fontSize:isMobile ? 9 : 11,padding:'5px 10px',borderRadius:20}}>
          {photoIdx+1} / {photos.length}
        </div>
      </div>
      <div style={{display:'flex',gap:8,padding:'12px 4px 2px',overflowX:'auto'}}>
        {photos.map((p,i)=>(
          <div key={i} onClick={()=>setPhotoIdx(i)}
            style={{width:thumbWidth,height:thumbHeight,background:'#e0e0e0',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile ? 18 : 22,flexShrink:0,border:`2px solid ${i===photoIdx?accent:'rgba(255,255,255,0.55)'}`,cursor:'pointer',overflow:'hidden',boxShadow:i===photoIdx?'0 12px 24px rgba(17,17,17,0.1)':'none'}}>
            {isImage() && getDisplayPhoto(p, i) ? (
              <img
                src={getDisplayPhoto(p, i)}
                alt="Vehicle"
                style={{width:'100%',height:'100%',objectFit:'cover'}}
                onError={() => setBrokenPhotos((current) => ({ ...current, [i]: true }))}
              />
            ) : (
              p
            )}
          </div>
        ))}
      </div>
      {isFullscreen && (
        <div
          onClick={() => setIsFullscreen(false)}
          style={{
            position:'fixed',
            inset:0,
            zIndex:1200,
            background:'rgba(12,10,9,0.92)',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            padding:isMobile ? 0 : 12,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width:'100vw',
              maxWidth:'100vw',
              display:'grid',
              gap:14,
            }}
          >
            <div
              style={{
                height:isMobile ? '62vh' : '86vh',
                position:'relative',
                borderRadius:isMobile ? 0 : 28,
                overflow:'hidden',
                background:'linear-gradient(180deg, #fffaf6 0%, #efe6dd 100%)',
                boxShadow:'0 30px 80px rgba(0,0,0,0.32)',
              }}
            >
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                style={{
                  position:'absolute',
                  top:16,
                  right:16,
                  width:42,
                  height:42,
                  border:'none',
                  borderRadius:'50%',
                  background:'rgba(17,17,17,0.68)',
                  color:'#fff',
                  cursor:'pointer',
                  fontSize:20,
                  zIndex:2,
                }}
              >
                ×
              </button>
              <div style={{position:'absolute',top:16,left:16,display:'inline-flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:999,background:'rgba(255,255,255,0.78)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.45)',fontSize:isMobile ? 10 : 12,fontWeight:600,color:S.text,zIndex:1}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:accent,display:'inline-block'}} />
                Car Express Selection
              </div>
              <div style={{position:'absolute',top:16,right:isMobile ? 68 : 74,display:'flex',alignItems:'center',gap:8,zIndex:2}}>
                <ZoomControlButton label="-" onClick={() => changeZoom('out')} disabled={!canZoomOut} />
                <div style={{minWidth:isMobile ? 52 : 58,textAlign:'center',padding:'10px 12px',borderRadius:999,background:'rgba(17,17,17,0.68)',color:'#fff',fontSize:isMobile ? 10 : 12,fontWeight:700}}>
                  {Math.round(zoomLevel * 100)}%
                </div>
                <ZoomControlButton label="+" onClick={() => changeZoom('in')} disabled={!canZoomIn} />
              </div>
              {isImage() && getDisplayPhoto(photos[photoIdx], photoIdx) ? (
                <div style={{width:'100%',height:'100%',overflow:'auto',cursor:zoomLevel > 1 ? 'grab' : 'default'}}>
                  <img
                    src={getDisplayPhoto(photos[photoIdx], photoIdx)}
                    alt="Vehicle"
                    style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${zoomLevel})`,transformOrigin:'center center',transition:'transform 0.2s ease'}}
                    onError={() => setBrokenPhotos((current) => ({ ...current, [photoIdx]: true }))}
                  />
                </div>
              ) : (
                <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile ? 120 : 220,transform:`scale(${zoomLevel})`,transformOrigin:'center center',transition:'transform 0.2s ease'}}>
                  {photos[photoIdx]}
                </div>
              )}
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                disabled={zoomLevel === 1}
                style={{
                  position:'absolute',
                  bottom:16,
                  left:16,
                  minHeight:40,
                  padding:'0 14px',
                  border:'1px solid rgba(255,255,255,0.18)',
                  borderRadius:999,
                  background:zoomLevel === 1 ? 'rgba(255,255,255,0.28)' : 'rgba(17,17,17,0.68)',
                  color:'#fff',
                  cursor:zoomLevel === 1 ? 'not-allowed' : 'pointer',
                  fontSize:isMobile ? 11 : 12,
                  fontWeight:700,
                  zIndex:2,
                }}
              >
                Reinitialiser
              </button>
              <div style={{position:'absolute',bottom:16,right:16,background:'rgba(17,17,17,0.58)',backdropFilter:'blur(10px)',color:'#fff',fontSize:isMobile ? 10 : 12,padding:'6px 12px',borderRadius:20}}>
                {photoIdx+1} / {photos.length}
              </div>
            </div>
            <div style={{display:'flex',gap:10,overflowX:'auto',padding:'0 4px 4px',justifyContent:isMobile ? 'flex-start' : 'center'}}>
              {photos.map((p,i)=>(
                <div
                  key={`fullscreen-${i}`}
                  onClick={() => setPhotoIdx(i)}
                  style={{width:isMobile ? 76 : 96,height:isMobile ? 56 : 72,background:'#e0e0e0',borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile ? 18 : 22,flexShrink:0,border:`2px solid ${i===photoIdx?accent:'rgba(255,255,255,0.25)'}`,cursor:'pointer',overflow:'hidden',boxShadow:i===photoIdx?'0 12px 24px rgba(0,0,0,0.18)':'none'}}
                >
                  {isImage() && getDisplayPhoto(p, i) ? (
                    <img
                      src={getDisplayPhoto(p, i)}
                      alt="Vehicle"
                      style={{width:'100%',height:'100%',objectFit:'cover'}}
                      onError={() => setBrokenPhotos((current) => ({ ...current, [i]: true }))}
                    />
                  ) : (
                    p
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ZoomControlButton({ label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width:42,
        height:42,
        border:'1px solid rgba(255,255,255,0.18)',
        borderRadius:'50%',
        background:disabled ? 'rgba(255,255,255,0.28)' : 'rgba(17,17,17,0.68)',
        color:'#fff',
        cursor:disabled ? 'not-allowed' : 'pointer',
        fontSize:22,
        lineHeight:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
      }}
    >
      {label}
    </button>
  );
}

// ── Confirmation Success Screen ───────────────────────────────────────
function ConfirmationSuccessScreen({ type, vehicle, onClose, onContactAgency }) {
  const accent = type === 'location' ? S.loc : S.vntText;
  const accentLight = type === 'location' ? S.locLight : S.vntLight;
  const accentMid = type === 'location' ? S.locMid : S.vntMid;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(180deg, #f8f4ef 0%, #fbf9f6 100%)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 520, width: '100%', background: 'rgba(255,255,255,0.98)', borderRadius: 32, border: `1px solid ${accentMid}`, boxShadow: '0 32px 80px rgba(17,17,17,0.12)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${accentLight} 0%, rgba(255,255,255,0.98) 100%)`, padding: '32px 28px 24px', textAlign: 'center', borderBottom: `1px solid ${accentMid}` }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{type === 'location' ? '✅' : '🎉'}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: S.text, marginBottom: 8 }}>
            {type === 'location' ? 'Réservation confirmée !' : "Demande d'achat enregistrée !"}
          </div>
          <div style={{ fontSize: 14, color: S.text2, lineHeight: 1.7, maxWidth: 380, margin: '0 auto' }}>
            {type === 'location'
              ? `Votre réservation pour ${vehicle.name} est bien enregistrée. L'agence vous contactera sous 30 minutes.`
              : `Votre dossier pour ${vehicle.name} a été transmis à l'agence. Elle vous contactera sous 24h.`}
          </div>
        </div>

        {/* Agency info */}
        <div style={{ padding: '20px 28px', borderBottom: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
            {(vehicle.agency || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: S.text }}>{vehicle.agency || 'Agence partenaire'}</div>
            <div style={{ fontSize: 13, color: S.text3, marginTop: 2 }}>
              {type === 'location' ? 'Votre demande de location a bien été transmise' : "Votre demande d'achat a bien été transmise"}
            </div>
          </div>
        </div>

        {/* Notification info */}
        <div style={{ padding: '16px 28px', borderBottom: `1px solid ${S.border}`, background: 'rgba(24,21,18,0.025)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🔔</span>
            <div style={{ fontSize: 13, color: S.text2, lineHeight: 1.65 }}>
              L'agence a été notifiée et recevra votre message dès que vous cliquez sur <strong>Contacter l'agence</strong>. Vous pouvez aussi échanger depuis l'onglet <strong>Messages</strong>.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '20px 28px', display: 'grid', gap: 10 }}>
          <button
            type="button"
            onClick={onContactAgency}
            style={{
              width: '100%',
              padding: '15px 20px',
              border: 'none',
              borderRadius: 16,
              background: accent,
              color: type === 'location' ? '#fff' : S.vntText,
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: `0 14px 28px ${accent}33`,
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contacter l'agence
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '13px 20px',
              border: `1px solid ${S.border}`,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.8)',
              color: S.text2,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Location Detail ───────────────────────────────────────────────────
export function LocDetail({ vehicle, user, onClose, onGoToSale, onOpenAgency, onNotif, onCheckAvailability, onCreateReservation, canReview, onSubmitReview, onContactAgency }) {
  const { isMobile } = useResponsive();
  const [lieu, setLieu] = useState('');
  const [depDate, setDepDate] = useState('');
  const [retDate, setRetDate] = useState('');
  const [depHeure, setDepHeure] = useState('08:00');
  const [retHeure, setRetHeure] = useState('18:00');
  const [availability, setAvailability] = useState(null); // null | 'ok' | 'unavail' | 'date-error'
  const [days, setDays] = useState(0);
  const [total, setTotal] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const availabilitySpecs = vehicle.raw?.specifications && typeof vehicle.raw.specifications === "object"
    ? vehicle.raw.specifications
    : (vehicle.specifications && typeof vehicle.specifications === "object" ? vehicle.specifications : {});
  const availableFrom = parseDateOnly(availabilitySpecs.available_from);
  const availableTo = parseDateOnly(availabilitySpecs.available_to);
  const availableFromValue = availabilitySpecs.available_from || "";
  const availableToValue = availabilitySpecs.available_to || "";

  const heures = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

  useEffect(()=>{
    if(!depDate||!retDate) { setAvailability(null); setDays(0); setTotal(0); return; }
    const d1 = parseDateOnly(depDate);
    const d2 = parseDateOnly(retDate);

    if(!d1 || !d2 || d2<=d1){ setAvailability('date-error'); setDays(0); setTotal(0); return; }

    if ((availableFrom && d1 < availableFrom) || (availableTo && d2 > availableTo)) {
      setAvailability('unavail');
      setDays(0);
      setTotal(0);
      return;
    }

    const d=Math.ceil((d2-d1)/86400000);
    setDays(d);
    setTotal(vehicle.price * d);

    if (!vehicle.backendId || !onCheckAvailability) {
      const unavail = unavailablePeriods.some(p=>d1<new Date(p.to)&&d2>new Date(p.from));
      if(unavail){ setAvailability('unavail'); setDays(0); setTotal(0); return; }
      setAvailability('ok');
      return;
    }

    let cancelled = false;

    onCheckAvailability(vehicle.backendId, depDate, retDate)
      .then((data) => {
        if (cancelled) return;
        setAvailability(data.available ? "ok" : "unavail");
      })
      .catch(() => {
        if (!cancelled) setAvailability("unavail");
      });

    return () => {
      cancelled = true;
    };
  },[depDate,retDate,vehicle.price,vehicle.backendId,onCheckAvailability,availableFrom,availableTo]);

  const ag = agencyInfo[vehicle.agency]||{address:'Dakar',stars:'★★★★☆',since:'Depuis 2022'};

  if(showPayment) return (
    <LocPayment vehicle={vehicle} lieu={lieu} depDate={depDate} depHeure={depHeure} retDate={retDate} retHeure={retHeure} days={days} total={total}
      user={user}
      onBack={()=>setShowPayment(false)} onClose={onClose} onNotif={onNotif} onCreateReservation={onCreateReservation} onContactAgency={onContactAgency}/>
  );

  return (
    <div style={{position:'fixed',inset:0,background:'linear-gradient(180deg, #f8f4ef 0%, #fbf9f6 100%)',zIndex:999,overflowY:'auto',paddingBottom:132}}>
      <PageHeader title={vehicle.name} onBack={onClose} accent={S.loc}/>
      <div style={{maxWidth:1360,margin:'0 auto',paddingBottom:24}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(360px,1fr))',gap:18,alignItems:'start',padding:'0 16px'}}>
          <div>
            <Gallery emoji={vehicle.emoji} image={vehicle.image} images={vehicle.images} accent={S.loc}/>
            <div style={{margin:'12px 0 0',padding:'20px 20px',border:`1px solid ${S.border}`,borderRadius:28,display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.82)',backdropFilter:'blur(12px)',boxShadow:'0 20px 44px rgba(17,17,17,0.06)'}}>
              <div>
                <div style={{fontSize:isMobile ? 28 : 32,fontWeight:700,color:S.loc}}>{vehicle.priceLabel}</div>
                <div style={{fontSize:isMobile ? 11 : 12,color:S.text3,letterSpacing:'0.12em',textTransform:'uppercase'}}>F CFA / jour</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:isMobile ? 14 : 15,color:S.loc}}>{vehicle.stars}</div>
                <div style={{fontSize:isMobile ? 10 : 11,color:S.text3,marginTop:2}}>{vehicle.rating}</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginTop:12}}>
              <QuickStat value={vehicle.specs[0]?.val || '—'} label="Places" />
              <QuickStat value={vehicle.specs[3]?.val || '—'} label="Transmission" />
              <QuickStat value={vehicle.specs[4]?.val || '—'} label="Annee" />
            </div>
          </div>

          <div style={{paddingTop:16}}>
            <div style={{padding:'20px',border:`1px solid ${S.locMid}`,borderRadius:28,background:'linear-gradient(180deg, rgba(255,240,240,0.95), rgba(255,255,255,0.92))',boxShadow:'0 22px 46px rgba(212,5,17,0.08)'}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.16em',color:S.loc,textTransform:'uppercase',marginBottom:14}}>Votre réservation</div>
        {(availableFromValue || availableToValue) && (
          <div style={{marginBottom:12,background:'rgba(255,255,255,0.94)',border:`1px solid ${S.locMid}`,borderRadius:18,padding:'10px 12px',fontSize:12,color:S.text2,lineHeight:1.6}}>
            Disponibilite definie par l'agence:
            {" "}
            <strong>
              {availableFromValue || "debut libre"} {availableToValue ? `au ${availableToValue}` : ""}
            </strong>
          </div>
        )}
        {/* Lieu */}
        <div style={{background:'rgba(255,255,255,0.92)',border:`1px solid ${S.border}`,borderRadius:18,padding:'12px 14px',marginBottom:12,display:'flex',alignItems:'center',gap:10}}>
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={S.loc} strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div style={{flex:1}}>
            <div style={{fontSize:10,fontWeight:500,color:S.text3,textTransform:'uppercase',letterSpacing:'0.4px',marginBottom:2}}>Lieu de prise en charge</div>
            <input placeholder="Ville, adresse, aéroport…" value={lieu} onChange={e=>setLieu(e.target.value)}
              style={{border:'none',background:'transparent',fontSize:13,color:S.text,width:'100%',outline:'none',padding:0}}/>
          </div>
        </div>
        {/* Dates et heures */}
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(2, minmax(0,1fr))',gap:10,marginBottom:10}}>
          {[
            { label: 'Date départ', type: 'date', value: depDate, setValue: setDepDate, min: availableFromValue || undefined, max: availableToValue || undefined },
            { label: 'Heure départ', type: 'time', value: depHeure, setValue: setDepHeure },
            { label: 'Date retour', type: 'date', value: retDate, setValue: setRetDate, min: depDate || availableFromValue || undefined, max: availableToValue || undefined },
            { label: 'Heure retour', type: 'time', value: retHeure, setValue: setRetHeure },
          ].map(({ label, type, value, setValue, min, max }) => (
            <div key={label} style={{background:'rgba(255,255,255,0.92)',border:`1px solid ${S.border}`,borderRadius:18,padding:'12px 12px'}}>
              <div style={{fontSize:10,fontWeight:500,color:S.text3,textTransform:'uppercase',marginBottom:6}}>{label}</div>
              <input
                type={type}
                value={value}
                onChange={e=>setValue(e.target.value)}
                step={type === 'time' ? 3600 : undefined}
                list={type === 'time' ? 'reservation-hours' : undefined}
                min={type === 'date' ? min : undefined}
                max={type === 'date' ? max : undefined}
                style={{border:'none',background:'transparent',fontSize:12,color:S.text,outline:'none',width:'100%'}}
              />
            </div>
          ))}
        </div>
        <datalist id="reservation-hours">
          {heures.map((h) => <option key={h} value={h} />)}
        </datalist>

        {/* Summary */}
        <div style={{background:'rgba(255,255,255,0.96)',border:`1px solid ${S.locMid}`,borderRadius:20,padding:'14px 16px',boxShadow:'0 14px 28px rgba(17,17,17,0.04)'}}>
          {availability==='date-error' && <div style={{fontSize:12,color:S.loc,marginBottom:8}}>⚠️ La date de retour doit être après le départ</div>}
          {availability==='unavail' && <div style={{fontSize:12,color:S.loc,fontWeight:500,marginBottom:8}}>⛔ Véhicule indisponible sur ces dates</div>}
          {availability==='ok' && <div style={{fontSize:12,color:'#1a7a2e',fontWeight:500,marginBottom:8}}>✓ Véhicule disponible sur ces dates</div>}
          {!availability && <div style={{fontSize:12,color:S.text3,marginBottom:8}}>Choisissez vos dates pour voir le total</div>}
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:S.text2}}>{days>0?`${days} jour${days>1?'s':''} × ${vehicle.price.toLocaleString('fr-FR')} F`:'—'}</span>
            <span style={{fontSize:13,color:S.text2}}>{days>0?total.toLocaleString('fr-FR')+' F':'—'}</span>
          </div>
          <div style={{borderTop:`1px dashed ${S.locMid}`,paddingTop:8,marginTop:4,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <span style={{fontSize:12,fontWeight:500,color:S.text3,letterSpacing:'0.5px'}}>TOTAL</span>
            <span style={{fontSize:24,fontWeight:700,color:S.loc}}>{total>0?total.toLocaleString('fr-FR')+' F':'—'}</span>
          </div>
        </div>

        {/* Also for sale */}
        {vehicle.alsoForSale && (
          <div style={{marginTop:12,background:'rgba(255,255,255,0.94)',border:`1px solid ${S.vntMid}`,borderRadius:18,padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:16}}>🏷️</span>
            <div>
              <div style={{fontSize:12,fontWeight:500,color:S.vntText}}>Ce véhicule est aussi disponible à l'achat</div>
              <div onClick={onGoToSale} style={{fontSize:12,color:S.loc,textDecoration:'underline',cursor:'pointer',marginTop:2}}>Voir l'offre d'achat →</div>
            </div>
          </div>
        )}
            </div>
          </div>
        </div>
      </div>

      {/* Specs / Motor / Equip / Desc */}
      <div style={{maxWidth:1360,margin:'0 auto'}}>
        <Section title="Caractéristiques"><SpecGrid items={vehicle.specs}/></Section>
        <Section title="Motorisation"><SpecGrid items={vehicle.motor}/></Section>
        <Section title="Équipements">
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {vehicle.equip.map((e,i)=><EquipTag key={i}>{e}</EquipTag>)}
          </div>
        </Section>
        <Section title="Description"><p style={{fontSize:13,color:S.text2,lineHeight:1.7}}>{vehicle.desc}</p></Section>
        <Section title="L'agence">
          <AgencyCard vehicle={vehicle} accent={S.loc} onClick={onOpenAgency}/>
          <MapPlaceholder address={ag.address} accent={S.loc}/>
        </Section>
        <Section title="Avis clients">
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {vehicle.reviews?.length
              ? vehicle.reviews.map((r,i)=><ReviewCard key={i} review={r}/>)
              : <div style={{fontSize:13,color:S.text3,lineHeight:1.7}}>Aucun avis client pour le moment.</div>}
          </div>
          <ReviewComposer canReview={canReview} onSubmitReview={onSubmitReview} />
        </Section>
      </div>

      <FixedActionBar
        accent={S.loc}
        accentText="#fff"
        primaryLabel="Valider ma réservation"
        primaryIcon={
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        }
        onPrimaryClick={()=>{
          if(availability==='ok') setShowPayment(true);
          else if(!depDate||!retDate) onNotif({icon:'📅',title:'Dates manquantes',msg:'Veuillez sélectionner vos dates de départ et de retour.'});
        }}
      />
    </div>
  );
}

// ── Location Payment ──────────────────────────────────────────────────
function LocPayment({ vehicle, lieu, depDate, depHeure, retDate, retHeure, days, total, user, onBack, onClose, onNotif, onCreateReservation, onContactAgency }) {
  const { isMobile } = useResponsive();
  const [confirmed, setConfirmed] = useState(false);
  const [cgu, setCgu] = useState(false);
  const [cga, setCga] = useState(false);
  const [payMethod, setPayMethod] = useState(null);
  const [mobileProvider, setMobileProvider] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [cni, setCni] = useState('');
  const [permis, setPermis] = useState('');

  const confirm = async () => {
    if(!cgu||!cga){onNotif({icon:'⚠️',title:'Conditions requises',msg:"Veuillez accepter les conditions d'utilisation et celles de l'agence."});return;}
    if(!payMethod){onNotif({icon:'💳',title:'Paiement requis',msg:'Choisissez un mode de paiement pour continuer.'});return;}
    if(payMethod==='mobile' && (!mobileProvider || !mobileNumber)){onNotif({icon:'📱',title:'Informations manquantes',msg:'Choisissez Wave ou Orange Money puis entrez le numero associe.'});return;}
    if(payMethod==='carte' && (!cardName || !cardNumber || !cardExpiry || !cardCvv)){onNotif({icon:'💳',title:'Carte incomplète',msg:'Entrez le nom, le numero, la date d’expiration et le code de securite.'});return;}
    if(!nom || !tel || !cni || !permis){onNotif({icon:'📝',title:'Informations requises',msg:'Renseignez votre nom, telephone, piece d identite et numero de permis.'});return;}

    if (vehicle.backendId && onCreateReservation) {
      try {
        await onCreateReservation({
          vehicle_id: vehicle.backendId,
          pickup_location: lieu || vehicle.city || "Dakar",
          pickup_date: depDate,
          pickup_time: depHeure || "08:00",
          return_date: retDate,
          return_time: retHeure || "18:00",
          payment_method: payMethod === "mobile" ? "mobile_money" : "card",
          client_name: nom,
          client_phone: tel,
          identity_number: cni,
          driver_license_number: permis,
          accepted_terms: true,
          accepted_agency_terms: true,
        });
      } catch (error) {
        onNotif({ icon: "⚠️", title: "Reservation impossible", msg: error.message || "La reservation n'a pas pu etre enregistree." });
        return;
      }
    }

    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <ConfirmationSuccessScreen
        type="location"
        vehicle={vehicle}
        onClose={onClose}
        onContactAgency={() => {
          onClose();
          if (onContactAgency) onContactAgency(vehicle);
        }}
      />
    );
  }

  return (
    <div style={{position:'fixed',inset:0,background:'linear-gradient(180deg, #f8f4ef 0%, #fbf9f6 100%)',zIndex:1000,overflowY:'auto',paddingBottom:132}}>
      <PageHeader title="Finaliser la réservation" onBack={onBack} accent={S.loc}/>
      <div style={{maxWidth:1200,margin:'0 auto',padding:isMobile ? '12px' : '16px'}}>
      <div style={paymentHeroStyle(S.loc, S.locLight, S.locMid)}>
        <div style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'flex-start',flexWrap:'wrap'}}>
          <div style={{maxWidth:620}}>
            <div style={paymentEyebrowStyle(S.loc)}>Finalisation</div>
            <div style={{fontSize:isMobile ? 24 : 30,fontWeight:800,color:S.text,lineHeight:1.05}}>Un dernier pas avant de prendre la route</div>
            <div style={{fontSize:13,color:S.text2,lineHeight:1.7,marginTop:10,maxWidth:560}}>
              Renseignez vos informations, choisissez votre mode de paiement et nous transmettons aussitôt votre demande a l'agence.
            </div>
          </div>
          <div style={paymentAmountBadgeStyle(S.loc, '#fff')}>
            <span style={{fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',opacity:0.8}}>Montant total</span>
            <strong style={{fontSize:isMobile ? 20 : 24}}>{total.toLocaleString('fr-FR')} F CFA</strong>
          </div>
        </div>
        <div style={{marginTop:18,background:'rgba(255,255,255,0.74)',border:`1px solid ${S.locMid}`,borderRadius:24,padding:isMobile ? 16 : 18,boxShadow:'0 18px 38px rgba(212,5,17,0.08)'}}>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:'0.08em',color:S.loc,textTransform:'uppercase',marginBottom:10}}>Récapitulatif</div>
        <div style={{fontSize:13,color:S.text2,lineHeight:1.8}}>
          <div>🚗 <strong>{vehicle.name}</strong> {resolveVehicleImageSrc(vehicle.image) && <img src={resolveVehicleImageSrc(vehicle.image)} alt="" style={{width:20,height:20,objectFit:'cover',marginLeft:5,borderRadius:4,verticalAlign:'middle'}}/>}</div>
          <div>📍 {lieu||'Lieu non précise'}</div>
          <div>📅 Du {depDate} a {depHeure || '08:00'} au {retDate} a {retHeure || '18:00'} ({days} jour{days>1?'s':''})</div>
          <div>🏢 {vehicle.agency}</div>
        </div>
        <div style={{borderTop:`1px dashed ${S.locMid}`,marginTop:12,paddingTop:12,display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:12}}>
          <span style={{fontSize:12,fontWeight:500,color:S.text3}}>TOTAL À PAYER</span>
          <span style={{fontSize:22,fontWeight:600,color:S.loc}}>{total.toLocaleString('fr-FR')} F CFA</span>
        </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:18}}>
      <div>
      <FormCard title="Informations complémentaires" tone="loc" subtitle="Ces informations servent a confirmer votre dossier avec l'agence.">
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(2, minmax(0, 1fr))',columnGap:isMobile?12:32,rowGap:10}}>
          <FormField label="Nom complet *"><Input placeholder="Prénom et nom" value={nom} onChange={e=>setNom(e.target.value)} style={paymentInputStyle()}/><FieldHint>Le nom figurant sur votre piece d'identite.</FieldHint></FormField>
          <FormField label="Téléphone *"><Input type="tel" placeholder="+221 77 000 00 00" value={tel} onChange={e=>setTel(e.target.value)} style={paymentInputStyle()}/><FieldHint>Numero joignable pour le rappel de confirmation.</FieldHint></FormField>
          <FormField label="CNI / Passeport *"><Input placeholder="Numéro de pièce d'identité" value={cni} onChange={e=>setCni(e.target.value)} style={paymentInputStyle()}/><FieldHint>Le document sera verifie lors de la remise.</FieldHint></FormField>
          <FormField label="Permis de conduire *"><Input placeholder="Numéro de permis" value={permis} onChange={e=>setPermis(e.target.value)} style={paymentInputStyle()}/><FieldHint>Permis valide correspondant au vehicule reserve.</FieldHint></FormField>
        </div>
      </FormCard>
      <FormCard title="Conditions d'utilisation" tone="neutral" subtitle="La validation des conditions est necessaire avant confirmation.">
        <CheckRow checked={cgu} onChange={setCgu} label={<>J'accepte les <u>conditions générales</u> de Car Express</>}/>
        <CheckRow checked={cga} onChange={setCga} label={<>J'accepte les <u>conditions de l'agence</u> (responsabilité, caution, état du véhicule)</>}/>
      </FormCard>
      </div>
      <div>
      <FormCard title="Mode de paiement" tone="loc" subtitle="Choisissez le mode le plus pratique pour vous.">
        {[{key:'carte',icon:'💳',label:'Carte bancaire',sub:'Visa, Mastercard'},
          {key:'mobile',icon:'📱',label:'Mobile Money',sub:'Wave ou Orange Money'}
        ].map(m=>(
          <PayOption key={m.key} {...m} selected={payMethod===m.key} onClick={()=>{
            setPayMethod(m.key);
            if(m.key!=='mobile'){setMobileProvider('');setMobileNumber('');}
            if(m.key!=='carte'){setCardName('');setCardNumber('');setCardExpiry('');setCardCvv('');}
          }} accent={S.loc}/>
        ))}
        {payMethod==='mobile' && (
          <PaymentDetailsCard title="Mobile Money" subtitle="Choisissez votre portefeuille puis confirmez le numero qui sera debite.">
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(2, minmax(0, 1fr))',columnGap:isMobile?12:20,rowGap:10}}>
              <ProviderOption label="Wave" selected={mobileProvider==='wave'} onClick={()=>setMobileProvider('wave')} accent={S.loc} />
              <ProviderOption label="Orange Money" selected={mobileProvider==='orange'} onClick={()=>setMobileProvider('orange')} accent={S.loc} />
            </div>
            <div style={{marginTop:12,display:'grid',gap:10}}>
              <FormField label="Numéro mobile *"><Input type="tel" placeholder="+221 77 000 00 00" value={mobileNumber} onChange={e=>setMobileNumber(e.target.value)} style={paymentInputStyle()}/></FormField>
              <FormField label="Montant"><Input value={`${total.toLocaleString('fr-FR')} F CFA`} onChange={()=>{}} style={{...paymentInputStyle(), background:'rgba(24,21,18,0.04)', color:S.text2}}/></FormField>
            </div>
            <FieldHint>Le client confirme generalement le paiement depuis l'application ou le menu de son operateur.</FieldHint>
          </PaymentDetailsCard>
        )}
        {payMethod==='carte' && (
          <PaymentDetailsCard title="Carte bancaire" subtitle="Pour un paiement carte, on saisit habituellement les informations de la carte puis une verification 3D Secure peut etre demandee.">
            <div style={{display:'grid',gap:10}}>
              <FormField label="Nom sur la carte *"><Input placeholder="Prénom et nom" value={cardName} onChange={e=>setCardName(e.target.value)} style={paymentInputStyle()}/></FormField>
              <FormField label="Numéro de carte *"><Input placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e=>setCardNumber(e.target.value)} style={paymentInputStyle()}/></FormField>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'minmax(0,1fr) minmax(0,0.8fr) minmax(0,0.7fr)',columnGap:isMobile?12:20,rowGap:10}}>
                <FormField label="Expiration *"><Input placeholder="MM/AA" value={cardExpiry} onChange={e=>setCardExpiry(e.target.value)} style={paymentInputStyle()}/></FormField>
                <FormField label="CVV *"><Input placeholder="123" value={cardCvv} onChange={e=>setCardCvv(e.target.value)} style={paymentInputStyle()}/></FormField>
                <FormField label="Montant"><Input value={`${total.toLocaleString('fr-FR')} F CFA`} onChange={()=>{}} style={{...paymentInputStyle(), background:'rgba(24,21,18,0.04)', color:S.text2}}/></FormField>
              </div>
            </div>
            <FieldHint>Le montant est fixe ici et une verification de type 3D Secure peut s'afficher selon la banque.</FieldHint>
          </PaymentDetailsCard>
        )}
      </FormCard>
      <FormCard title="Etapes suivantes" tone="neutral" subtitle="Ce qui se passe juste apres votre validation.">
        <div style={{display:'grid',gap:10}}>
          <MiniStep>Validation de vos informations et des conditions.</MiniStep>
          <MiniStep>Choix du mode de paiement.</MiniStep>
          <MiniStep>Confirmation immediate puis rappel agence sous 30 minutes.</MiniStep>
        </div>
      </FormCard>
      </div>
      </div>
      <BottomCtaBar>
        <div style={{width:'100%',maxWidth:420}}>
          <Btn onClick={confirm} accent={S.loc}>Confirmer et payer</Btn>
        </div>
      </BottomCtaBar>
      </div>
    </div>
  );
}

// ── Achat Detail ──────────────────────────────────────────────────────
export function VntDetail({ vehicle, user, onClose, onOpenAgency, onNotif, onCreatePurchaseRequest, canReview, onSubmitReview, onContactAgency }) {
  const { isMobile } = useResponsive();
  const [queue] = useState(Math.floor(Math.random()*4));
  const [lieu, setLieu] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const ag = agencyInfo[vehicle.agency]||{address:'Dakar',stars:'★★★★☆',since:'Depuis 2021',sales:0};

  if(showPayment) return (
    <VntPayment vehicle={vehicle} user={user} onBack={()=>setShowPayment(false)} onClose={onClose} onNotif={onNotif} onCreatePurchaseRequest={onCreatePurchaseRequest} onContactAgency={onContactAgency}/>
  );

  return (
    <div style={{position:'fixed',inset:0,background:'linear-gradient(180deg, #f8f4ef 0%, #fbf9f6 100%)',zIndex:999,overflowY:'auto',paddingBottom:132}}>
      <PageHeader title={vehicle.name} onBack={onClose} accent={S.vnt}/>
      <div style={{maxWidth:1360,margin:'0 auto',paddingBottom:24}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(360px,1fr))',gap:18,alignItems:'start',padding:'0 16px'}}>
      <div>
      <Gallery emoji={vehicle.emoji} image={vehicle.image} images={vehicle.images} accent={S.vnt}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginTop:12}}>
        <QuickStat value={vehicle.specs[0]?.val || '—'} label="Places" />
        <QuickStat value={vehicle.specs[4]?.val || '—'} label="Kilometrage" />
        <QuickStat value={vehicle.specs[5]?.val || '—'} label="Classe" />
      </div>
      </div>
      <div style={{paddingTop:16}}>
      <div style={{margin:'0',padding:'20px',border:`1px solid ${S.vntMid}`,borderRadius:28,background:'linear-gradient(180deg, rgba(255,248,214,0.95), rgba(255,255,255,0.92))',boxShadow:'0 22px 48px rgba(255,204,0,0.12)'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
          <div>
            <div style={{fontSize:isMobile ? 28 : 32,fontWeight:700,color:S.vntText}}>{vehicle.priceLabel}</div>
            <div style={{fontSize:isMobile ? 11 : 12,color:S.text3,letterSpacing:'0.12em',textTransform:'uppercase'}}>F CFA — Prix fixe</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:isMobile ? 13 : 14,color:S.vntText}}>{vehicle.stars}</div>
            <div style={{fontSize:isMobile ? 10 : 11,color:S.text3,marginTop:2}}>{vehicle.rating}</div>
          </div>
        </div>
        {queue>0 && (
          <div style={{background:'rgba(255,255,255,0.94)',border:`1px solid ${S.vntMid}`,borderRadius:18,padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:20}}>⏳</span>
            <div>
              <div style={{fontSize:12,fontWeight:500,color:S.vntText}}>{queue} acheteur{queue>1?'s':''} en négociation</div>
              <div style={{fontSize:11,color:S.text3}}>Soyez réactif — ce véhicule est très demandé</div>
            </div>
          </div>
        )}
        <div style={{marginTop:12,background:'rgba(255,255,255,0.94)',border:`1px solid ${S.border}`,borderRadius:18,padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={S.vntText} strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div style={{flex:1}}>
            <div style={{fontSize:10,fontWeight:500,color:S.text3,textTransform:'uppercase',marginBottom:2}}>Votre localisation (optionnel)</div>
            <input placeholder="Ville ou quartier…" value={lieu} onChange={e=>setLieu(e.target.value)}
              style={{border:'none',background:'transparent',fontSize:13,color:S.text,width:'100%',outline:'none',padding:0}}/>
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>

      <div style={{maxWidth:1360,margin:'0 auto'}}>
        <Section title="Caractéristiques"><SpecGrid items={vehicle.specs}/></Section>
        <Section title="Motorisation"><SpecGrid items={vehicle.motor}/></Section>
        <Section title="Équipements">
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>{vehicle.equip.map((e,i)=><EquipTag key={i}>{e}</EquipTag>)}</div>
        </Section>
        <Section title="Description"><p style={{fontSize:13,color:S.text2,lineHeight:1.7}}>{vehicle.desc}</p></Section>
        <Section title="Le concessionnaire">
          <AgencyCard vehicle={vehicle} accent={S.vnt} onClick={onOpenAgency}/>
          <MapPlaceholder address={ag.address} accent={S.vntText}/>
        </Section>
        <Section title="Avis d'acheteurs">
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {vehicle.reviews?.length
              ? vehicle.reviews.map((r,i)=><ReviewCard key={i} review={r}/>)
              : <div style={{fontSize:13,color:S.text3,lineHeight:1.7}}>Aucun avis client pour le moment.</div>}
          </div>
          <ReviewComposer canReview={canReview} onSubmitReview={onSubmitReview} />
        </Section>
      </div>

      <FixedActionBar
        accent="#ff8a00"
        accentText="#fff"
        primaryLabel="Procéder à l'achat"
        primaryIcon={
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        }
        onPrimaryClick={() => setShowPayment(true)}
      />
    </div>
  );
}

// ── Achat Payment ─────────────────────────────────────────────────────
function VntPayment({ vehicle, user, onBack, onClose, onNotif, onCreatePurchaseRequest, onContactAgency }) {
  const { isMobile } = useResponsive();
  const [confirmed, setConfirmed] = useState(false);
  const [cgu, setCgu] = useState(false);
  const [fraisAck, setFraisAck] = useState(false);
  const [payMethod, setPayMethod] = useState(null);
  const [mobileProvider, setMobileProvider] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [cni, setCni] = useState('');

  const pricing = getPricingDetails("sale", vehicle.price);
  const frais = pricing?.adminShare || 0;
  const totalAvecCommission = Number(vehicle.price || 0) + frais;

  const confirm = async () => {
    if(!cgu||!fraisAck){onNotif({icon:'⚠️',title:'Conditions requises',msg:'Veuillez accepter toutes les conditions avant de procéder.'});return;}
    if(!payMethod){onNotif({icon:'💳',title:'Paiement requis',msg:'Choisissez un moyen de paiement pour regler les frais de service.'});return;}
    if(payMethod==='mobile' && (!mobileProvider || !mobileNumber)){onNotif({icon:'📱',title:'Informations manquantes',msg:'Choisissez Wave ou Orange Money puis entrez le numero associe.'});return;}
    if(payMethod==='carte' && (!cardName || !cardNumber || !cardExpiry || !cardCvv)){onNotif({icon:'💳',title:'Carte incomplète',msg:'Entrez le nom, le numero, la date d’expiration et le code de securite.'});return;}
    if(!nom || !tel || !cni){onNotif({icon:'📝',title:'Informations requises',msg:'Renseignez votre nom, telephone et piece d identite.'});return;}

    if (vehicle.backendId && onCreatePurchaseRequest) {
      try {
        await onCreatePurchaseRequest({
          vehicle_id: vehicle.backendId,
          payment_method: payMethod === "mobile" ? "mobile_money" : "card",
          client_name: nom,
          client_phone: tel,
          client_email: user?.email || "",
          identity_number: cni,
          accepted_terms: true,
          accepted_non_refundable: true,
        });
      } catch (error) {
        onNotif({ icon: "⚠️", title: "Demande impossible", msg: error.message || "La demande d'achat n'a pas pu etre enregistree." });
        return;
      }
    }

    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <ConfirmationSuccessScreen
        type="achat"
        vehicle={vehicle}
        onClose={onClose}
        onContactAgency={() => {
          onClose();
          if (onContactAgency) onContactAgency(vehicle);
        }}
      />
    );
  }

  return (
    <div style={{position:'fixed',inset:0,background:'linear-gradient(180deg, #f8f4ef 0%, #fbf9f6 100%)',zIndex:1000,overflowY:'auto',paddingBottom:132}}>
      <PageHeader title="Procéder à l'achat" onBack={onBack} accent={S.vnt}/>
      <div style={{maxWidth:1200,margin:'0 auto',padding:isMobile ? '12px' : '16px'}}>
      <div style={paymentHeroStyle(S.vntText, S.vntLight, S.vntMid)}>
        <div style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'flex-start',flexWrap:'wrap'}}>
          <div style={{maxWidth:620}}>
            <div style={paymentEyebrowStyle(S.vntText)}>Reservation d'achat</div>
            <div style={{fontSize:isMobile ? 24 : 30,fontWeight:800,color:S.text,lineHeight:1.05}}>Sécurisez votre dossier avant la prise de contact</div>
            <div style={{fontSize:13,color:S.text2,lineHeight:1.7,marginTop:10,maxWidth:560}}>
              La commission plateforme est calculee automatiquement selon la grille Car Express. Le reste de la transaction se poursuit directement avec le concessionnaire.
            </div>
          </div>
          <div style={paymentAmountBadgeStyle(S.vntText, S.vntLight)}>
            <span style={{fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',opacity:0.8}}>Commission plateforme</span>
            <strong style={{fontSize:isMobile ? 20 : 24}}>{formatMoney(frais)} F CFA</strong>
          </div>
        </div>
        <div style={{marginTop:18,background:'rgba(255,255,255,0.78)',border:`1px solid ${S.vntMid}`,borderRadius:24,padding:isMobile ? 16 : 18,boxShadow:'0 18px 38px rgba(122,92,0,0.08)'}}>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:'0.08em',color:S.vntText,textTransform:'uppercase',marginBottom:10}}>Véhicule sélectionné</div>
        <div style={{fontSize:13,color:S.text2,lineHeight:1.8}}>
          <div>🚘 <strong>{vehicle.name}</strong> {resolveVehicleImageSrc(vehicle.image) && <img src={resolveVehicleImageSrc(vehicle.image)} alt="" style={{width:20,height:20,objectFit:'cover',marginLeft:5,borderRadius:4,verticalAlign:'middle'}}/>}</div>
          <div>🏢 {vehicle.agency}</div>
        </div>
        <div style={{borderTop:`1px dashed ${S.vntMid}`,marginTop:10,paddingTop:10}}>
          <Row label="Prix du véhicule" val={formatMoney(vehicle.price)+' F CFA'}/>
          <Row label={`Commission Car Express${pricing ? ` (${pricing.percentage}%)` : ''}`} val={formatMoney(frais)+' F CFA'} accent={S.vntText}/>
          <div style={{background:S.vntLight,border:`1px solid ${S.vntMid}`,borderRadius:8,padding:'8px 10px',margin:'8px 0',fontSize:11,color:S.vntText,lineHeight:1.5}}>
            ⚠️ La commission plateforme est <strong>non remboursable</strong> après validation.
          </div>
          <div style={{borderTop:`1px dashed ${S.vntMid}`,paddingTop:10,marginTop:6,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <span style={{fontSize:12,fontWeight:500,color:S.text3}}>TOTAL AVEC COMMISSION</span>
            <span style={{fontSize:22,fontWeight:600,color:S.vntText}}>{formatMoney(totalAvecCommission)} F CFA</span>
          </div>
          <div style={{fontSize:11,color:S.text3,marginTop:4,fontStyle:'italic'}}>Prix du vehicule: {formatMoney(vehicle.price)} F CFA. Commission plateforme a regler ici: {formatMoney(frais)} F CFA.</div>
        </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:18}}>
      <div>
      <FormCard title="Informations acheteur" tone="vnt" subtitle="Utilisees pour constituer votre dossier d'achat.">
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(2, minmax(0, 1fr))',columnGap:isMobile?12:32,rowGap:10}}>
          <FormField label="Nom complet *"><Input placeholder="Prénom et nom" value={nom} onChange={e=>setNom(e.target.value)} style={paymentInputStyle()}/><FieldHint>Le nom exact pour preparer vos documents.</FieldHint></FormField>
          <FormField label="Téléphone *"><Input type="tel" placeholder="+221 77 000 00 00" value={tel} onChange={e=>setTel(e.target.value)} style={paymentInputStyle()}/><FieldHint>Le vendeur pourra vous joindre rapidement.</FieldHint></FormField>
          <FormField label="CNI / Passeport *"><Input placeholder="Numéro de pièce d'identité" value={cni} onChange={e=>setCni(e.target.value)} style={{...paymentInputStyle(), gridColumn:isMobile?'auto':'1 / -1'}}/><FieldHint>Document demande pour l'ouverture et le suivi du dossier.</FieldHint></FormField>
        </div>
      </FormCard>
      <FormCard title="Conditions de vente" tone="neutral" subtitle="Merci de lire et confirmer les engagements ci-dessous.">
        <div style={{background:S.bg2,borderRadius:8,padding:10,fontSize:12,color:S.text2,lineHeight:1.6,maxHeight:80,overflowY:'auto',marginBottom:12}}>
          Le concessionnaire s'engage à fournir un véhicule conforme à la description. L'acheteur dispose d'un délai d'inspection de 48h après prise en main.
        </div>
        <CheckRow checked={cgu} onChange={setCgu} label={<>J'accepte les <u>CGU Car Express</u> et les <u>conditions du concessionnaire</u></>}/>
        <CheckRow checked={fraisAck} onChange={setFraisAck} label={<>Je reconnais que la <strong>commission plateforme est non remboursable</strong></>}/>
      </FormCard>
      </div>
      <div>
      <FormCard title="Paiement de la commission plateforme" tone="vnt" subtitle="Une fois validee, la commission est immediatement enregistree.">
        {[{key:'carte',icon:'💳',label:'Carte bancaire',sub:'Visa, Mastercard'},
          {key:'mobile',icon:'📱',label:'Mobile Money',sub:'Wave ou Orange Money'}
        ].map(m=>(
          <PayOption key={m.key} {...m} selected={payMethod===m.key} onClick={()=>{
            setPayMethod(m.key);
            if(m.key!=='mobile'){setMobileProvider('');setMobileNumber('');}
            if(m.key!=='carte'){setCardName('');setCardNumber('');setCardExpiry('');setCardCvv('');}
          }} accent={S.vnt} accentText={S.vntText}/>
        ))}
        {payMethod==='mobile' && (
          <PaymentDetailsCard title="Mobile Money" subtitle="La commission plateforme est payee depuis votre portefeuille mobile.">
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(2, minmax(0, 1fr))',columnGap:isMobile?12:20,rowGap:10}}>
              <ProviderOption label="Wave" selected={mobileProvider==='wave'} onClick={()=>setMobileProvider('wave')} accent={S.vntText} light={S.vntLight} />
              <ProviderOption label="Orange Money" selected={mobileProvider==='orange'} onClick={()=>setMobileProvider('orange')} accent={S.vntText} light={S.vntLight} />
            </div>
            <div style={{marginTop:12,display:'grid',gap:10}}>
              <FormField label="Numéro mobile *"><Input type="tel" placeholder="+221 77 000 00 00" value={mobileNumber} onChange={e=>setMobileNumber(e.target.value)} style={paymentInputStyle()}/></FormField>
              <FormField label="Montant"><Input value={`${formatMoney(frais)} F CFA`} onChange={()=>{}} style={{...paymentInputStyle(), background:'rgba(24,21,18,0.04)', color:S.text2}}/></FormField>
            </div>
          </PaymentDetailsCard>
        )}
        {payMethod==='carte' && (
          <PaymentDetailsCard title="Carte bancaire" subtitle="La commission plateforme est payee en ligne. Une verification supplementaire peut etre demandee par la banque.">
            <div style={{display:'grid',gap:10}}>
              <FormField label="Nom sur la carte *"><Input placeholder="Prénom et nom" value={cardName} onChange={e=>setCardName(e.target.value)} style={paymentInputStyle()}/></FormField>
              <FormField label="Numéro de carte *"><Input placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e=>setCardNumber(e.target.value)} style={paymentInputStyle()}/></FormField>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'minmax(0,1fr) minmax(0,0.8fr) minmax(0,0.7fr)',columnGap:isMobile?12:20,rowGap:10}}>
                <FormField label="Expiration *"><Input placeholder="MM/AA" value={cardExpiry} onChange={e=>setCardExpiry(e.target.value)} style={paymentInputStyle()}/></FormField>
                <FormField label="CVV *"><Input placeholder="123" value={cardCvv} onChange={e=>setCardCvv(e.target.value)} style={paymentInputStyle()}/></FormField>
                <FormField label="Montant"><Input value={`${formatMoney(frais)} F CFA`} onChange={()=>{}} style={{...paymentInputStyle(), background:'rgba(24,21,18,0.04)', color:S.text2}}/></FormField>
              </div>
            </div>
          </PaymentDetailsCard>
        )}
      </FormCard>
      <FormCard title="Apres validation" tone="neutral" subtitle="Les prochaines etapes de votre achat.">
        <div style={{display:'grid',gap:10}}>
          <MiniStep>La commission plateforme est reglee dans l'application.</MiniStep>
          <MiniStep>Le dossier est transmis au concessionnaire.</MiniStep>
          <MiniStep>Le solde du vehicule est traite directement avec le vendeur.</MiniStep>
        </div>
      </FormCard>
      </div>
      </div>
      <BottomCtaBar>
        <div style={{width:'100%',maxWidth:460}}>
          <Btn onClick={confirm} accent={S.vnt} style={{color:S.vntText}}>Confirmer la réservation d'achat</Btn>
        </div>
      </BottomCtaBar>
      </div>
    </div>
  );
}

function FixedActionBar({ accent, accentText, primaryLabel, primaryIcon, onPrimaryClick }) {
  return (
    <div style={{position:'fixed',left:0,right:0,bottom:0,zIndex:1100,background:'rgba(251,249,246,0.92)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',borderTop:`1px solid ${S.border}`,boxShadow:'0 -16px 36px rgba(17,17,17,0.08)',padding:'14px 14px calc(12px + env(safe-area-inset-bottom, 0px))'}}>
      <div style={{maxWidth:1360,margin:'0 auto',display:'flex',alignItems:'center'}}>
        <button
          type="button"
          onClick={onPrimaryClick}
          style={{
            flex:1,
            minHeight:52,
            border:'none',
            borderRadius:16,
            background:accent,
            color:accentText,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            gap:10,
            fontSize:15,
            fontWeight:700,
            cursor:'pointer',
            boxShadow:'0 14px 28px rgba(17,17,17,0.12)',
          }}
        >
          {primaryIcon}
          <span>{primaryLabel}</span>
        </button>
      </div>
    </div>
  );
}

function BottomCtaBar({ children }) {
  return (
    <div style={{position:'fixed',left:0,right:0,bottom:0,zIndex:1100,background:'rgba(251,249,246,0.92)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',borderTop:`1px solid ${S.border}`,boxShadow:'0 -16px 36px rgba(17,17,17,0.08)',padding:'14px 16px calc(12px + env(safe-area-inset-bottom, 0px))'}}>
      <div style={{maxWidth:1200,margin:'0 auto',display:'flex',justifyContent:'flex-start'}}>
        {children}
      </div>
    </div>
  );
}

// ── Agency Profile Page ───────────────────────────────────────────────
export function AgencyProfilePage({ vehicle, vehicles = [], onClose, getVehicleAction, vehicleActionLoadingId = null }) {
  const { isMobile } = useResponsive();
  const publishedVehicles = (Array.isArray(vehicles) ? vehicles : []).filter((item) => item?.agency === vehicle?.agency);
  const hasLocation = publishedVehicles.some((item) => String(item.id || "").startsWith("loc-"));
  const hasSale = publishedVehicles.some((item) => String(item.id || "").startsWith("vnt-"));
  const defaultFleetTab = hasLocation ? 'loc' : (hasSale ? 'vnt' : 'loc');
  const [fleetTab, setFleetTab] = useState(defaultFleetTab);
  const fallbackInfo = agencyInfo[vehicle?.agency] || {address:'Dakar',stars:'★★★★☆',since:'Depuis 2022',sales:0,nbLoc:0,nbVnt:0};
  const ag = {
    ...fallbackInfo,
    nbLoc: publishedVehicles.filter((item) => String(item.id || "").startsWith("loc-")).length,
    nbVnt: publishedVehicles.filter((item) => String(item.id || "").startsWith("vnt-")).length,
  };
  const ini = (vehicle?.agency||'').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
  const fleets = {
    loc: publishedVehicles.filter((item) => String(item.id || "").startsWith("loc-")).map((item) => ({
      source: item,
      image: item.image,
      name: item.name,
      detail: item.tags?.[0] || item.detail || "",
      price: `${item.priceLabel} ${item.priceUnit || ""}`.trim(),
      avail: item.statusLabel !== 'pending' && item.statusLabel !== 'rented' && item.statusLabel !== 'maintenance' && item.status !== 'Loue' && item.status !== 'Maintenance',
    })),
    vnt: publishedVehicles.filter((item) => String(item.id || "").startsWith("vnt-")).map((item) => ({
      source: item,
      image: item.image,
      name: item.name,
      detail: item.tags?.[0] || item.detail || "",
      price: `${item.priceLabel} ${item.priceUnit || ""}`.trim(),
      avail: item.statusLabel !== 'pending' && item.statusLabel !== 'sold' && item.status !== 'Vendu',
    })),
    both: publishedVehicles.map((item) => ({
      source: item,
      image: item.image,
      name: item.name,
      detail: item.tags?.[0] || item.detail || "",
      price: `${item.priceLabel} ${item.priceUnit || ""}`.trim(),
      avail: item.statusLabel !== 'pending' && item.status !== 'Vendu' && item.status !== 'Maintenance' && item.status !== 'Loue',
    })),
  };
  const availableTabs = [
    hasLocation ? 'loc' : null,
    hasSale ? 'vnt' : null,
    hasLocation && hasSale ? 'both' : null,
  ].filter(Boolean);

  useEffect(() => {
    if (!availableTabs.includes(fleetTab)) {
      setFleetTab(defaultFleetTab);
    }
  }, [fleetTab, availableTabs, defaultFleetTab]);

  const avatarSize = isMobile ? 56 : 68;
  const fleetImageWidth = isMobile ? 64 : 78;
  const fleetImageHeight = isMobile ? 46 : 56;

  return (
    <div style={{position:'fixed',inset:0,background:'linear-gradient(180deg, #f8f4ef 0%, #fbf9f6 100%)',zIndex:1500,overflowY:'auto',paddingBottom:80}}>
      <PageHeader title="Profil agence" onBack={onClose}/>
      <div style={{margin:'16px',padding:'22px 18px',border:`1px solid ${S.border}`,borderRadius:28,display:'flex',gap:14,alignItems:'center',background:'rgba(255,255,255,0.82)',backdropFilter:'blur(12px)',boxShadow:'0 20px 44px rgba(17,17,17,0.06)'}}>
        <div style={{width:avatarSize,height:avatarSize,borderRadius:20,background:S.black,display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile ? 18 : 22,fontWeight:700,color:'#fff',boxShadow:'0 18px 30px rgba(17,17,17,0.14)'}}>{ini}</div>
        <div>
          <div style={{fontSize:isMobile ? 18 : 21,fontWeight:700}}>{vehicle?.agency}</div>
          <div style={{fontSize:isMobile ? 11 : 12,color:S.text3,marginTop:2}}>{ag.nbLoc>0&&ag.nbVnt>0?'Location & Vente':ag.nbLoc>0?'Location':ag.nbVnt>0?'Vente':'Aucune annonce'}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
            <span style={{fontSize:isMobile ? 12 : 13}}>{ag.stars}</span>
            <span style={{fontSize:isMobile ? 10 : 11,color:S.text3}}>{ag.address} · {ag.since}</span>
          </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,padding:'0 16px 16px'}}>
        {[{label:'En location',val:ag.nbLoc},{label:'En vente',val:ag.nbVnt},{label:'Vendus',val:ag.sales}].map(s=>(
          <div key={s.label} style={{background:'rgba(255,255,255,0.78)',border:`1px solid ${S.border}`,borderRadius:18,padding:14,textAlign:'center',boxShadow:'0 12px 26px rgba(17,17,17,0.04)'}}>
            <div style={{fontSize:isMobile ? 18 : 22,fontWeight:700,fontFamily:'JetBrains Mono,monospace'}}>{s.val}</div>
            <div style={{fontSize:isMobile ? 9 : 10,color:S.text3,marginTop:3}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',borderBottom:`1px solid ${S.border}`,padding:'0 16px'}}>
        {availableTabs.map(t=>(
          <div key={t} onClick={()=>setFleetTab(t)}
            style={{flex:1,padding:'10px 0',textAlign:'center',fontSize:isMobile ? 12 : 13,fontWeight:500,cursor:'pointer',color:fleetTab===t?S.black:S.text3,borderBottom:`2px solid ${fleetTab===t?S.black:'transparent'}`,transition:'all 0.2s'}}>
            {t==='loc'?'Location':t==='vnt'?'Vente':'Les deux'}
          </div>
        ))}
      </div>
      <div style={{padding:16,display:'flex',flexDirection:'column',gap:12}}>
        {(fleets[fleetTab]||[]).map((f,i)=>{
          const action = getVehicleAction ? getVehicleAction(f.source) : null;

          return (
          <div key={i} style={{display:'flex',alignItems:'center',gap:12,background:'rgba(255,255,255,0.82)',border:`1px solid ${S.border}`,borderRadius:20,padding:14,boxShadow:'0 12px 28px rgba(17,17,17,0.04)'}}>
            <div style={{width:fleetImageWidth,height:fleetImageHeight,background:S.bg2,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile ? 20 : 24,overflow:'hidden',flexShrink:0}}>
              {f.image ? (
                <img src={resolveVehicleImageSrc(f.image)} alt={f.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
              ) : (
                f.emoji
              )}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:isMobile ? 12 : 13,fontWeight:500}}>{f.name}</div>
              <div style={{fontSize:isMobile ? 10 : 11,color:S.text3}}>{f.detail}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:isMobile ? 11 : 12,fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>{f.price}</div>
              <div style={{fontSize:isMobile ? 9 : 10,marginTop:4,padding:'4px 8px',borderRadius:999,background:f.avail?'#e6f4ea':'#FFF0F0',color:f.avail?'#1a7a2e':S.loc}}>{f.avail?'Disponible':'Indisponible'}</div>
              {action ? (
                <button
                  type="button"
                  onClick={action.onClick}
                  disabled={action.disabled || vehicleActionLoadingId === f.source?.backendId}
                  style={{
                    marginTop: 8,
                    border: 'none',
                    borderRadius: 999,
                    background: action.tone === 'success' ? '#1a7a2e' : S.black,
                    color: '#fff',
                    padding: '7px 12px',
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: action.disabled ? 'not-allowed' : 'pointer',
                    opacity: action.disabled || vehicleActionLoadingId === f.source?.backendId ? 0.7 : 1,
                  }}
                >
                  {vehicleActionLoadingId === f.source?.backendId ? 'Validation...' : action.label}
                </button>
              ) : null}
            </div>
          </div>
        )})}
        {(fleets[fleetTab] || []).length === 0 && (
          <div style={{background:'rgba(255,255,255,0.82)',border:`1px solid ${S.border}`,borderRadius:20,padding:18,color:S.text3}}>
            Aucune annonce publiee dans cette section pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminVehicleModerationPage({ vehicle, onClose, onApprove, approving = false, onOpenAgency }) {
  const { isMobile } = useResponsive();
  const accent = vehicle?.type === "Vente" ? S.vntText : S.loc;
  const accentLight = vehicle?.type === "Vente" ? S.vntLight : S.locLight;
  const accentMid = vehicle?.type === "Vente" ? S.vntMid : S.locMid;
  const agencyMeta = agencyInfo[vehicle?.agency] || { address: vehicle?.city || "Dakar", stars: "★★★★☆", since: "Depuis 2022" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "linear-gradient(180deg, #f8f4ef 0%, #fbf9f6 100%)", zIndex: 1600, overflowY: "auto", paddingBottom: 120 }}>
      <PageHeader title="Moderation annonce" onBack={onClose} />
      <div style={{ maxWidth: 1360, margin: "0 auto", paddingBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: 18, alignItems: "start", padding: "0 16px" }}>
          <div>
            <Gallery emoji={vehicle.emoji} image={vehicle.image} images={vehicle.images} accent={accent} />
            <div style={{ marginTop: 12, padding: "20px", border: `1px solid ${S.border}`, borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.82)", boxShadow: "0 20px 44px rgba(17,17,17,0.06)" }}>
              <div>
                <div style={{ fontSize: isMobile ? 28 : 32, fontWeight: 700, color: accent }}>{vehicle.priceLabel}</div>
                <div style={{ fontSize: isMobile ? 11 : 12, color: S.text3, letterSpacing: "0.12em", textTransform: "uppercase" }}>{vehicle.priceUnit}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: S.text3, textTransform: "uppercase", letterSpacing: "0.12em" }}>Statut</div>
                <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: accent }}>
                  {vehicle.statusLabel === "pending" ? "En attente admin" : vehicle.status || vehicle.statusLabel}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10, marginTop: 12 }}>
              <QuickStat value={vehicle.specs?.[0]?.val || "—"} label="Places" />
              <QuickStat value={vehicle.transmission || vehicle.specs?.[3]?.val || "—"} label="Transmission" />
              <QuickStat value={vehicle.specs?.[4]?.val || vehicle.specs?.[5]?.val || "—"} label={vehicle.type === "Vente" ? "Kilometrage" : "Annee"} />
            </div>
          </div>

          <div style={{ paddingTop: 16 }}>
            <div style={{ padding: "20px", border: `1px solid ${accentMid}`, borderRadius: 28, background: `linear-gradient(180deg, ${accentLight}, rgba(255,255,255,0.94))`, boxShadow: "0 22px 46px rgba(17,17,17,0.06)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: accent, textTransform: "uppercase", marginBottom: 14 }}>Publication complete</div>
              <div style={{ display: "grid", gap: 10 }}>
                <ModerationRow label="Annonce" value={vehicle.name} />
                <ModerationRow label="Type" value={vehicle.type} />
                <ModerationRow label="Agence" value={vehicle.agency} />
                <ModerationRow label="Ville" value={vehicle.city || "Dakar"} />
                <ModerationRow label="Prix" value={`${vehicle.priceLabel} ${vehicle.priceUnit || ""}`.trim()} />
                <ModerationRow label="Resume commercial" value={vehicle.commercialDetail || vehicle.detail || "Aucun resume fourni."} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        <Section title="Caracteristiques"><SpecGrid items={vehicle.specs || []} /></Section>
        <Section title="Motorisation"><SpecGrid items={vehicle.motor || []} /></Section>
        <Section title="Equipements">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {(vehicle.equip || []).map((item, index) => <EquipTag key={index}>{item}</EquipTag>)}
          </div>
        </Section>
        <Section title="Description">
          <p style={{ fontSize: 13, color: S.text2, lineHeight: 1.7 }}>{vehicle.desc || "Description non renseignee pour le moment."}</p>
        </Section>
        <Section title="Agence">
          <AgencyCard vehicle={vehicle} accent={accent} onClick={onOpenAgency} />
          <MapPlaceholder address={agencyMeta.address} accent={accent} />
        </Section>
      </div>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1700, background: "rgba(251,249,246,0.94)", backdropFilter: "blur(18px)", borderTop: `1px solid ${S.border}`, boxShadow: "0 -16px 36px rgba(17,17,17,0.08)", padding: "14px 16px calc(12px + env(safe-area-inset-bottom, 0px))" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 12, justifyContent: "flex-start", flexWrap: "wrap" }}>
          <button type="button" onClick={onClose} style={{ minHeight: 50, borderRadius: 16, border: `1px solid ${S.borderStrong}`, background: "rgba(255,255,255,0.86)", color: S.text, padding: "0 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Laisser en attente
          </button>
          <button
            type="button"
            onClick={onApprove}
            disabled={approving || vehicle.statusLabel !== "pending"}
            style={{ minHeight: 50, borderRadius: 16, border: "none", background: accent, color: vehicle?.type === "Vente" ? S.text : "#fff", padding: "0 20px", fontSize: 14, fontWeight: 700, cursor: approving || vehicle.statusLabel !== "pending" ? "not-allowed" : "pointer", opacity: approving || vehicle.statusLabel !== "pending" ? 0.7 : 1 }}
          >
            {approving ? "Validation..." : (vehicle.statusLabel === "pending" ? "Valider l'annonce" : "Annonce deja validee")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{padding:'16px'}}>
      <div style={{padding:'18px',border:`1px solid ${S.border}`,borderRadius:26,background:'rgba(255,255,255,0.82)',backdropFilter:'blur(10px)',boxShadow:'0 16px 32px rgba(17,17,17,0.05)'}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.16em',color:S.text3,textTransform:'uppercase',marginBottom:14}}>{title}</div>
      {children}
      </div>
    </div>
  );
}

function EquipTag({ children }) {
  return <span style={{fontSize:12,padding:'7px 12px',borderRadius:999,border:`1px solid ${S.border2}`,color:S.text2,background:'linear-gradient(180deg, #ffffff 0%, #fff8f3 100%)',boxShadow:'0 8px 18px rgba(17,17,17,0.04)'}}>{children}</span>;
}

function ModerationRow({ label, value }) {
  return (
    <div style={{ display: "grid", gap: 4, padding: "12px 14px", borderRadius: 16, background: "rgba(255,255,255,0.9)", border: `1px solid ${S.border}` }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: S.text3 }}>{label}</div>
      <div style={{ fontSize: 14, color: S.text, lineHeight: 1.6 }}>{value}</div>
    </div>
  );
}

function ReviewComposer({ canReview, onSubmitReview }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const activeRating = hoverRating || rating;

  const ratingLabels = { 1: "Mauvais", 2: "Passable", 3: "Correct", 4: "Bien", 5: "Excellent" };

  const submit = async () => {
    if (!canReview || !onSubmitReview) return;
    if (rating < 1) {
      setMessage("Choisissez une note avant de publier votre avis.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await onSubmitReview({ rating, comment });
      setComment("");
      setRating(0);
      setHoverRating(0);
      setSubmitted(true);
      setMessage("Votre avis a ete publie avec succes.");
    } catch (error) {
      setMessage(error?.message || "Impossible d'enregistrer votre avis pour le moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{marginTop:14,padding:'16px',border:`1px solid ${S.border}`,borderRadius:18,background:'rgba(255,255,255,0.72)',display:'grid',gap:12}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:16}}>✍️</span>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:S.text3}}>Laisser un avis</div>
      </div>
      {canReview ? (
        submitted ? (
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 16px',borderRadius:14,background:'#e6f4ea',border:'1px solid #b7dfbc'}}>
            <span style={{fontSize:20}}>⭐</span>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:'#1a7a2e'}}>Merci pour votre avis !</div>
              <div style={{fontSize:12,color:'#2d6a35',marginTop:2}}>
                Vous pouvez le modifier en soumettant un nouvel avis.{" "}
                <span style={{textDecoration:'underline',cursor:'pointer'}} onClick={() => setSubmitted(false)}>Modifier</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Star picker */}
            <div>
              <div style={{fontSize:11,color:S.text3,marginBottom:8}}>Votre note</div>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                {[1,2,3,4,5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background:'transparent',
                      border:'none',
                      padding:'2px',
                      cursor:'pointer',
                      fontSize:28,
                      color: value <= activeRating ? '#f59e0b' : S.border2,
                      transition:'color 0.1s, transform 0.1s',
                      transform: value <= activeRating ? 'scale(1.15)' : 'scale(1)',
                      lineHeight:1,
                    }}
                    aria-label={`${value} étoile${value > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
                {activeRating > 0 && (
                  <span style={{fontSize:12,color:S.text2,marginLeft:4,fontWeight:600}}>
                    {ratingLabels[activeRating]}
                  </span>
                )}
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Partagez votre expérience avec ce véhicule (optionnel)..."
              style={{minHeight:88,border:`1px solid ${S.border}`,borderRadius:14,padding:'12px 14px',resize:'vertical',fontSize:13,color:S.text,background:'#fff',outline:'none',fontFamily:'inherit'}}
            />
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{fontSize:14,color:'#1a7a2e'}}>✓</span>
                <div style={{fontSize:12,color:S.text3}}>Vous avez déjà utilisé ce véhicule.</div>
              </div>
              <button
                type="button"
                onClick={submit}
                disabled={isLoading || rating < 1}
                style={{
                  border:'none',
                  borderRadius:999,
                  padding:'10px 20px',
                  background: rating < 1 ? 'rgba(24,21,18,0.12)' : S.black,
                  color: rating < 1 ? S.text3 : '#fff',
                  fontWeight:700,
                  cursor: isLoading || rating < 1 ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  fontSize:13,
                  transition:'all 0.2s',
                }}
              >
                {isLoading ? "Publication..." : "Publier mon avis"}
              </button>
            </div>
          </>
        )
      ) : (
        <div style={{display:'flex',alignItems:'flex-start',gap:10,padding:'12px 14px',borderRadius:14,background:S.bg2,border:`1px solid ${S.border}`}}>
          <span style={{fontSize:16,marginTop:1}}>🔒</span>
          <div style={{fontSize:13,color:S.text3,lineHeight:1.65}}>
            Vous pourrez laisser un avis après avoir <strong>terminé une location</strong> ou <strong>finalisé un achat</strong> pour ce véhicule.
          </div>
        </div>
      )}
      {message ? (
        <div style={{
          fontSize:12,
          color: message.includes("succes") ? '#1a7a2e' : S.loc,
          padding:'10px 12px',
          borderRadius:10,
          background: message.includes("succes") ? '#e6f4ea' : S.locLight,
          border: `1px solid ${message.includes("succes") ? '#b7dfbc' : S.locMid}`,
        }}>
          {message}
        </div>
      ) : null}
    </div>
  );
}

function paymentInputStyle() {
  return {
    width: '100%',
    boxSizing: 'border-box',
    minWidth: 0,
    minHeight: 38,
    padding: '6px 10px',
    borderRadius: 10,
    border: `1px solid rgba(24,21,18,0.14)`,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(252,249,246,0.98) 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.88), 0 12px 26px rgba(17,17,17,0.04)',
    fontSize: 12,
  };
}

function paymentHeroStyle(accentText, accentLight, accentMid) {
  return {
    margin:'0 0 18px',
    background:`linear-gradient(135deg, ${accentLight} 0%, rgba(255,255,255,0.98) 58%, #fff9f5 100%)`,
    border:`1px solid ${accentMid}`,
    borderRadius:30,
    padding:20,
    position:'relative',
    overflow:'hidden',
    boxShadow:'0 26px 60px rgba(17,17,17,0.08)',
  };
}

function paymentEyebrowStyle(color) {
  return {
    display:'inline-flex',
    alignItems:'center',
    gap:8,
    padding:'8px 12px',
    borderRadius:999,
    border:`1px solid ${color}22`,
    background:'rgba(255,255,255,0.72)',
    fontSize:10,
    fontWeight:700,
    letterSpacing:'0.14em',
    textTransform:'uppercase',
    color,
    marginBottom:12,
  };
}

function paymentAmountBadgeStyle(color, background) {
  return {
    minWidth:170,
    display:'grid',
    gap:6,
    padding:'14px 16px',
    borderRadius:22,
    background,
    color,
    border:`1px solid ${color}26`,
    boxShadow:'0 16px 34px rgba(17,17,17,0.07)',
  };
}

function FormCard({ title, subtitle, children, tone = 'neutral' }) {
  const toneStyles = {
    loc: { border: S.locMid, bg: 'linear-gradient(180deg, rgba(255,240,240,0.9) 0%, rgba(255,255,255,0.98) 100%)', title: S.loc },
    vnt: { border: S.vntMid, bg: 'linear-gradient(180deg, rgba(255,251,224,0.92) 0%, rgba(255,255,255,0.98) 100%)', title: S.vntText },
    neutral: { border: S.border, bg: 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(250,246,241,0.98) 100%)', title: S.text },
  };
  const config = toneStyles[tone] || toneStyles.neutral;
  return (
    <div style={{margin:'0 0 16px',border:`1px solid ${config.border}`,borderRadius:28,overflow:'hidden',background:config.bg,backdropFilter:'blur(12px)',boxShadow:'0 22px 44px rgba(17,17,17,0.06)'}}>
      <div style={{padding:'18px 18px 14px',borderBottom:`1px solid ${config.border}`}}>
        <div style={{fontSize:14,fontWeight:800,color:config.title}}>{title}</div>
        {subtitle && <div style={{fontSize:12,color:S.text3,lineHeight:1.6,marginTop:6,maxWidth:460}}>{subtitle}</div>}
      </div>
      <div style={{padding:18, minWidth:0, overflow:'hidden'}}>{children}</div>
    </div>
  );
}

function CheckRow({ checked, onChange, label }) {
  return (
    <label style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:12,cursor:'pointer',padding:'14px 15px',border:`1px solid ${S.border}`,borderRadius:18,background:'rgba(255,255,255,0.74)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.8)'}}>
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{marginTop:3,width:16,height:16,flexShrink:0,accentColor:S.loc}}/>
      <span style={{fontSize:12,color:S.text2,lineHeight:1.55}}>{label}</span>
    </label>
  );
}

function PayOption({ icon, label, sub, selected, onClick, accent, accentText }) {
  return (
    <div onClick={onClick}
      style={{display:'flex',alignItems:'center',gap:14,padding:'15px 16px',border:`2px solid ${selected?(accent||S.loc):S.border}`,borderRadius:18,cursor:'pointer',marginBottom:10,background:selected?(accent==='#FFCC00'?S.vntLight:S.locLight):'rgba(255,255,255,0.92)',transition:'all 0.2s',boxShadow:selected?'0 16px 30px rgba(17,17,17,0.06)':'0 8px 18px rgba(17,17,17,0.03)'}}>
      <span style={{fontSize:22,width:46,height:46,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.92)',border:`1px solid ${S.border}`}}>{icon}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:600}}>{label}</div>
        <div style={{fontSize:11,color:S.text3}}>{sub}</div>
      </div>
      <div style={{width:18,height:18,borderRadius:'50%',border:`2px solid ${selected?(accent||S.loc):S.border2}`,background:selected?(accent||S.loc):'transparent',boxShadow:selected?'0 0 0 3px rgba(255,255,255,0.9) inset':'none',flexShrink:0}} />
    </div>
  );
}

function PaymentDetailsCard({ title, subtitle, children }) {
  return (
    <div style={{marginTop:12,padding:'14px',minWidth:0,overflow:'hidden',border:`1px solid ${S.border}`,borderRadius:18,background:'rgba(255,255,255,0.8)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.82)'}}>
      <div style={{fontSize:13,fontWeight:700,color:S.text}}>{title}</div>
      {subtitle && <div style={{fontSize:11,color:S.text3,lineHeight:1.55,marginTop:4,marginBottom:12}}>{subtitle}</div>}
      {children}
    </div>
  );
}

function ProviderOption({ label, selected, onClick, accent, light }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight:40,
        borderRadius:12,
        border:`1px solid ${selected ? accent : S.border}`,
        background:selected ? (light || 'rgba(212,5,17,0.08)') : 'rgba(255,255,255,0.9)',
        color:selected ? accent : S.text2,
        fontSize:12,
        fontWeight:700,
        cursor:'pointer',
      }}
    >
      {label}
    </button>
  );
}

function QuickStat({ value, label }) {
  const { isMobile } = useResponsive();
  return (
    <div style={{background:'rgba(255,255,255,0.82)',border:`1px solid ${S.border}`,borderRadius:18,padding:14,boxShadow:'0 12px 26px rgba(17,17,17,0.04)'}}>
      <div style={{fontSize:isMobile ? 16 : 18,fontWeight:700,color:S.text,fontFamily:'JetBrains Mono,monospace'}}>{value}</div>
      <div style={{fontSize:isMobile ? 9 : 10,color:S.text3,marginTop:4,textTransform:'uppercase',letterSpacing:'0.12em'}}>{label}</div>
    </div>
  );
}

function MiniStep({ children }) {
  return (
    <div style={{display:'flex',gap:10,alignItems:'flex-start',padding:'12px 13px',borderRadius:16,background:'rgba(24,21,18,0.04)',border:`1px solid ${S.border}`}}>
      <span style={{width:22,height:22,borderRadius:'50%',background:'rgba(24,21,18,0.08)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:11,flexShrink:0}}>•</span>
      <span style={{fontSize:12,color:S.text2,lineHeight:1.6}}>{children}</span>
    </div>
  );
}

function FieldHint({ children }) {
  return <div style={{marginTop:7,fontSize:11,color:S.text3,lineHeight:1.5}}>{children}</div>;
}

function Row({ label, val, accent }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
      <span style={{fontSize:12,color:S.text3}}>{label}</span>
      <span style={{fontSize:13,fontWeight:500,color:accent||S.text}}>{val}</span>
    </div>
  );
}
