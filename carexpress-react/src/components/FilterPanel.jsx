import { useEffect, useState } from "react";
import { marqueModeles } from "../data";

const S = { border:'#e0e0e0', border2:'#c0c0c0', bg2:'#f5f5f5', text:'#0a0a0a', text2:'#555', text3:'#999', radiusSm:'8px' };

function Chip({ label, active, onClick, accent }) {
  return (
    <div onClick={onClick}
      style={{flexShrink:0,padding:'7px 14px',borderRadius:999,border:`1px solid ${active?(accent||'#0a0a0a'):S.border2}`,fontSize:13,color:active?'#fff':S.text2,background:active?(accent||'#0a0a0a'):'#fff',cursor:'pointer',transition:'all 0.15s',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:5}}>
      {label}
    </div>
  );
}

function FilterDropdown({ open, children }) {
  if(!open) return null;
  return (
    <div style={{background:'#fff',border:`1px solid ${S.border}`,borderRadius:12,padding:14,marginBottom:8}}>
      {children}
    </div>
  );
}

function FdChips({ options, value, onChange, accent }) {
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
      {options.map(opt=>(
        <div key={opt} onClick={()=>onChange(opt)}
          style={{padding:'6px 14px',borderRadius:999,border:`1px solid ${value===opt?(accent||'#0a0a0a'):S.border2}`,fontSize:13,color:value===opt?'#fff':S.text2,background:value===opt?(accent||'#0a0a0a'):'#fff',cursor:'pointer',transition:'all 0.15s'}}>
          {opt}
        </div>
      ))}
    </div>
  );
}

function FdTitle({ children }) {
  return <div style={{fontSize:11,fontWeight:500,letterSpacing:'0.6px',color:S.text3,textTransform:'uppercase',marginBottom:10}}>{children}</div>;
}

function ApplyBtn({ onClick, accent }) {
  return (
    <button onClick={onClick} style={{width:'100%',padding:10,background:accent||'#0a0a0a',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:500,cursor:'pointer',marginTop:10}}>
      Appliquer
    </button>
  );
}

function PriceSlider({ value, max, onChange, label, accent }) {
  const pct = Math.round((value/max)*100);
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
        <span style={{fontSize:12,color:S.text2}}>0 F</span>
        <span style={{fontSize:13,fontWeight:500,fontFamily:'DM Mono,monospace'}}>{value.toLocaleString('fr-FR')} F</span>
      </div>
      <div style={{position:'relative',height:4,background:S.border,borderRadius:2,marginBottom:18}}>
        <div style={{position:'absolute',left:0,right:`${100-pct}%`,height:'100%',background:accent||'#0a0a0a',borderRadius:2}}/>
        <input type="range" min={0} max={max} step={max===500000?5000:500000} value={value} onChange={e=>onChange(+e.target.value)}
          style={{position:'absolute',top:-8,width:'100%',opacity:0,cursor:'pointer',height:20}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:S.text3}}>
        <span>Min : 0 F</span><span>Max : {max.toLocaleString('fr-FR')} F</span>
      </div>
    </div>
  );
}

export function FilterPanel({ prefix, accent, onClose, onApply }) {
  const [open, setOpen] = useState(null);
  const [marque, setMarque] = useState('Toutes');
  const [marqueSearch, setMarqueSearch] = useState('');
  const [modele, setModele] = useState('Tous');
  const [siege, setSiege] = useState('Tous');
  const [moteur, setMoteur] = useState('Toutes');
  const [transmission, setTransmission] = useState('Toutes');
  const [categorie, setCategorie] = useState('Tous');
  const [classe, setClasse] = useState('Toutes');
  const [prix, setPrix] = useState(prefix==='loc'?200000:20000000);

  const toggle = (key) => setOpen(open===key ? null : key);
  const marques = ['Toutes','Toyota','Mercedes','Hyundai','Renault','Kia','Peugeot','BMW','Volkswagen','Ford','Nissan','Mitsubishi'];
  const filteredMarques = marques.filter(m=>m.toLowerCase().includes(marqueSearch.toLowerCase()));

  const filters = [
    {key:'marque',label:'Marque / Modèle',icon:'◎'},
    {key:'siege',label:'Nb de sièges',icon:'👥'},
    {key:'moteur',label:'Motorisation',icon:'🔧'},
    {key:'transmission',label:'Transmission',icon:'⚙️'},
    {key:'categorie',label:'Catégorie',icon:'🚙'},
    {key:'classe',label:'Classe',icon:'⭐'},
    {key:'prix',label:prefix==='loc'?'Prix / jour':'Prix',icon:'💰'},
  ];

  const resetAll = () => {
    setMarque('Toutes'); setMarqueSearch(''); setModele('Tous'); setSiege('Tous');
    setMoteur('Toutes'); setTransmission('Toutes'); setCategorie('Tous');
    setClasse('Toutes'); setPrix(prefix==='loc'?200000:20000000); setOpen(null);
  };

  useEffect(() => {
    if (!onApply) return;

    onApply({
      marque,
      modele,
      siege,
      moteur,
      transmission,
      categorie,
      classe,
      prixMax: prix,
      prefix,
    });
  }, [onApply, marque, modele, siege, moteur, transmission, categorie, classe, prix, prefix]);

  return (
    <div style={{padding:'0 16px 4px'}}>
      {/* Filter button row */}
      <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:10,scrollbarWidth:'none',WebkitScrollbarWidth:'none'}}>
        <Chip label="Tous" active={!open} onClick={()=>setOpen(null)} accent={accent}/>
        {filters.map(f=>(
          <Chip key={f.key} label={f.label} active={open===f.key} onClick={()=>toggle(f.key)} accent={accent}/>
        ))}
        <Chip label="↺ Réinitialiser" active={false} onClick={resetAll}/>
      </div>

      {/* Dropdowns */}
      <FilterDropdown open={open==='marque'}>
        <FdTitle>Marque</FdTitle>
        <div style={{position:'relative',marginBottom:10}}>
          <svg style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',width:14,height:14,stroke:S.text3,fill:'none',strokeWidth:2}} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Rechercher une marque…" value={marqueSearch} onChange={e=>setMarqueSearch(e.target.value)}
            style={{width:'100%',padding:'8px 10px 8px 32px',border:`1px solid ${S.border}`,borderRadius:8,fontSize:13,color:S.text,outline:'none',background:S.bg2}}/>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:12}}>
          {filteredMarques.map(m=>(
            <div key={m} onClick={()=>{setMarque(m);setModele('Tous');}}
              style={{padding:'6px 14px',borderRadius:999,border:`1px solid ${marque===m?(accent||'#0a0a0a'):S.border2}`,fontSize:13,color:marque===m?'#fff':S.text2,background:marque===m?(accent||'#0a0a0a'):'#fff',cursor:'pointer',transition:'all 0.15s'}}>
              {m}
            </div>
          ))}
        </div>
        {marque!=='Toutes' && marqueModeles[marque] && (
          <>
            <FdTitle>Modèles {marque}</FdTitle>
            <FdChips options={['Tous',...marqueModeles[marque]]} value={modele} onChange={setModele} accent={accent}/>
          </>
        )}
        <ApplyBtn onClick={()=>setOpen(null)} accent={accent}/>
      </FilterDropdown>

      <FilterDropdown open={open==='siege'}>
        <FdTitle>Nombre de sièges</FdTitle>
        <FdChips options={['Tous','2 places','5 places','7 places','9 places','12+ places']} value={siege} onChange={setSiege} accent={accent}/>
        <ApplyBtn onClick={()=>setOpen(null)} accent={accent}/>
      </FilterDropdown>

      <FilterDropdown open={open==='moteur'}>
        <FdTitle>Motorisation</FdTitle>
        <FdChips options={['Toutes','Essence','Gazoil','Électrique','Hybride']} value={moteur} onChange={setMoteur} accent={accent}/>
        <ApplyBtn onClick={()=>setOpen(null)} accent={accent}/>
      </FilterDropdown>

      <FilterDropdown open={open==='transmission'}>
        <FdTitle>Transmission</FdTitle>
        <FdChips options={['Toutes','Automatique','Manuelle']} value={transmission} onChange={setTransmission} accent={accent}/>
        <ApplyBtn onClick={()=>setOpen(null)} accent={accent}/>
      </FilterDropdown>

      <FilterDropdown open={open==='categorie'}>
        <FdTitle>Type de véhicule</FdTitle>
        <FdChips options={['Tous','Berline','SUV','Van','Minibus','Pick-up','Économique','Utilitaire']} value={categorie} onChange={setCategorie} accent={accent}/>
        <ApplyBtn onClick={()=>setOpen(null)} accent={accent}/>
      </FilterDropdown>

      <FilterDropdown open={open==='classe'}>
        <FdTitle>Classe du véhicule</FdTitle>
        <FdChips options={['Toutes','Luxe','Standard','Éco']} value={classe} onChange={setClasse} accent={accent}/>
        <ApplyBtn onClick={()=>setOpen(null)} accent={accent}/>
      </FilterDropdown>

      <FilterDropdown open={open==='prix'}>
        <FdTitle>{prefix==='loc'?'Prix par jour (F CFA)':'Fourchette de prix (F CFA)'}</FdTitle>
        <PriceSlider value={prix} max={prefix==='loc'?500000:50000000} onChange={setPrix} accent={accent}/>
        <ApplyBtn onClick={()=>setOpen(null)} accent={accent}/>
      </FilterDropdown>
    </div>
  );
}
