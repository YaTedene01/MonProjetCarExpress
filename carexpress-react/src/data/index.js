export const vehicles = {
  'loc-1': {
    emoji:'🚙', name:'Toyota Land Cruiser', agency:'Agence Dakar Auto',
    image:'landcruiser.jpg',
    price:75000, priceLabel:'75 000', priceUnit:'F CFA / jour', stars:'★★★★☆', rating:'4.2 (18 avis)', alsoForSale:true,
    specs:[{label:'Sièges',val:'7 places'},{label:'Portes',val:'5 portes'},{label:'Catégorie',val:'SUV'},{label:'Transmission',val:'Automatique'},{label:'Année',val:'2022'},{label:'Classe',val:'Standard'}],
    motor:[{label:'Carburant',val:'Essence'},{label:'Cylindrée',val:'4 000 cm³'},{label:'Conso.',val:'11,5 L/100km'},{label:'Puissance',val:'305 ch'}],
    equip:['Climatisation','Caméra de recul','Bluetooth','GPS','Toit ouvrant','Jantes 18"','Siège chauffant','Apple CarPlay','ABS','ESP','Airbags x6'],
    desc:'Le Toyota Land Cruiser 2022 offre une expérience hors pair. Intérieur cuir beige, finitions premium. Idéal pour longs trajets. Couleur : Blanc nacré. Clim bi-zone, écran 12", sièges rabattables.',
    tags:['SUV · 2022','7 places','Essence','Auto'],
    reviews:[{name:'Moussa D.',stars:'★★★★★',date:'12 mars 2026',text:'Excellent véhicule, très confortable. Agence sérieuse.'},{name:'Fatou S.',stars:'★★★★☆',date:'8 mars 2026',text:'Très bonne expérience, voiture propre et en parfait état.'}]
  },
  'loc-2': {
    emoji:'🚐', name:'Mercedes Sprinter', agency:'TransAfrica Location',
    image:'mercedes sprinter.jpg',
    price:120000, priceLabel:'120 000', priceUnit:'F CFA / jour', stars:'★★★★★', rating:'4.8 (32 avis)', alsoForSale:false,
    specs:[{label:'Sièges',val:'9 places'},{label:'Portes',val:'5 portes'},{label:'Catégorie',val:'Van'},{label:'Transmission',val:'Manuelle'},{label:'Année',val:'2020'},{label:'Classe',val:'Standard'}],
    motor:[{label:'Carburant',val:'Gazoil'},{label:'Cylindrée',val:'2 143 cm³'},{label:'Conso.',val:'9,2 L/100km'},{label:'Puissance',val:'163 ch'}],
    equip:['Climatisation','Bluetooth','GPS','Grand coffre','Banquettes amovibles','ABS','ESP'],
    desc:'Mercedes Sprinter idéal pour transport de groupe. Banquettes modulables, grandes portes latérales. Couleur : Blanc.',
    tags:['Van · 2020','9 places','Gazoil','Manuelle'],
    reviews:[{name:'Aliou N.',stars:'★★★★★',date:'15 mars 2026',text:'Parfait pour notre groupe de 8. Van impeccable.'}]
  },
  'loc-3': {
    emoji:'🚕', name:'Hyundai Tucson', agency:'Premium Cars Dakar',
    image:'tucson.png',
    price:65000, priceLabel:'65 000', priceUnit:'F CFA / jour', stars:'★★★★☆', rating:'4.0 (11 avis)', alsoForSale:false,
    specs:[{label:'Sièges',val:'5 places'},{label:'Portes',val:'5 portes'},{label:'Catégorie',val:'SUV'},{label:'Transmission',val:'Automatique'},{label:'Année',val:'2023'},{label:'Classe',val:'Standard'}],
    motor:[{label:'Carburant',val:'Essence'},{label:'Cylindrée',val:'1 600 cm³'},{label:'Conso.',val:'8,1 L/100km'},{label:'Puissance',val:'180 ch'}],
    equip:['Climatisation','Caméra 360°','Bluetooth','Apple CarPlay','Régulateur','Jantes 17"','ABS'],
    desc:'Hyundai Tucson 2023, SUV moderne. Tableau de bord digital. Couleur : Gris métallisé.',
    tags:['SUV · 2023','5 places','Essence','Auto'],
    reviews:[{name:'Coumba F.',stars:'★★★★☆',date:'5 mars 2026',text:'Très bon rapport qualité/prix.'}]
  },
  'loc-4': {
    emoji:'🚗', name:'Renault Duster', agency:'Dakar Auto Services',
    image:'duster.jpeg',
    price:55000, priceLabel:'55 000', priceUnit:'F CFA / jour', stars:'★★★☆☆', rating:'3.5 (7 avis)', alsoForSale:false,
    specs:[{label:'Sièges',val:'5 places'},{label:'Portes',val:'5 portes'},{label:'Catégorie',val:'SUV'},{label:'Transmission',val:'Manuelle'},{label:'Année',val:'2022'},{label:'Classe',val:'Éco'}],
    motor:[{label:'Carburant',val:'Gazoil'},{label:'Cylindrée',val:'1 500 cm³'},{label:'Conso.',val:'6,5 L/100km'},{label:'Puissance',val:'115 ch'}],
    equip:['Climatisation','Bluetooth','Jantes 16"','ABS'],
    desc:'Renault Duster 2022, robuste et économique. Couleur : Rouge.',
    tags:['SUV · 2022','5 places','Gazoil','Manuelle'],
    reviews:[{name:'Lamine S.',stars:'★★★☆☆',date:'20 fév. 2026',text:'Voiture basique mais fonctionnelle.'}]
  },
  'loc-5': {
    emoji:'🚌', name:'Toyota Hiace', agency:'TransAfrica Location',
    image:'toyota hiace.jpg',
    price:180000, priceLabel:'180 000', priceUnit:'F CFA / jour', stars:'★★★★☆', rating:'4.1 (24 avis)', alsoForSale:false,
    specs:[{label:'Sièges',val:'14 places'},{label:'Portes',val:'4 portes'},{label:'Catégorie',val:'Minibus'},{label:'Transmission',val:'Manuelle'},{label:'Année',val:'2019'},{label:'Classe',val:'Standard'}],
    motor:[{label:'Carburant',val:'Gazoil'},{label:'Cylindrée',val:'2 494 cm³'},{label:'Conso.',val:'10,5 L/100km'},{label:'Puissance',val:'148 ch'}],
    equip:['Climatisation','Bluetooth','Grand coffre','Banquettes réglables','ABS'],
    desc:'Toyota Hiace 2019, minibus robuste. 14 places. Idéal pèlerinages. Couleur : Blanc.',
    tags:['Minibus · 2019','14 places','Gazoil','Manuelle'],
    reviews:[{name:'Serigne M.',stars:'★★★★★',date:'14 mars 2026',text:'Parfait pour le Magal ! Excellent état.'}]
  },
  'vnt-1': {
    emoji:'🚗', name:'Renault Clio', agency:'Auto Plus SN · Dakar',
    image:'clio.png',
    price:4500000, priceLabel:'4 500 000', priceUnit:'F CFA', stars:'★★★★☆', rating:'4.3 (9 avis)',
    specs:[{label:'Sièges',val:'5 places'},{label:'Portes',val:'5 portes'},{label:'Catégorie',val:'Berline'},{label:'Transmission',val:'Manuelle'},{label:'Kilométrage',val:'52 000 km'},{label:'Classe',val:'Éco'}],
    motor:[{label:'Carburant',val:'Essence'},{label:'Cylindrée',val:'1 200 cm³'},{label:'Conso.',val:'5,5 L/100km'},{label:'Puissance',val:'90 ch'}],
    equip:['Climatisation','Bluetooth','Jantes 16"','ABS','Direction assistée'],
    desc:'Renault Clio 2021 en parfait état. Couleur : Bleu marine. Intérieur tissu gris.',
    tags:['Berline · 2021','52 000 km','Essence','Manuelle'],
    reviews:[{name:'Baye F.',stars:'★★★★☆',date:'10 mars 2026',text:'Voiture bien entretenue, vendeur honnête.'}]
  },
  'vnt-2': {
    emoji:'🏎️', name:'BMW Série 3', agency:'Élite Motors SN · Dakar',
    image:'bmw-x5-30d-2019-08_1.jpg',
    price:12000000, priceLabel:'12 000 000', priceUnit:'F CFA', stars:'★★★★★', rating:'4.9 (21 avis)',
    specs:[{label:'Sièges',val:'5 places'},{label:'Portes',val:'4 portes'},{label:'Catégorie',val:'Berline Luxe'},{label:'Transmission',val:'Automatique'},{label:'Kilométrage',val:'38 000 km'},{label:'Classe',val:'Luxe'}],
    motor:[{label:'Carburant',val:'Essence'},{label:'Cylindrée',val:'2 000 cm³'},{label:'Conso.',val:'7,2 L/100km'},{label:'Puissance',val:'255 ch'}],
    equip:['Clim bi-zone','Cuir nappa','Caméra 360°','Apple CarPlay','Toit ouvrant','Jantes 18"','HUD','Park assist'],
    desc:'BMW Série 3 2020 full options. Cuir noir. Couleur : Noir saphir. Premier propriétaire.',
    tags:['Berline · 2020','38 000 km','Essence','Auto'],
    reviews:[{name:'Cheikh A.',stars:'★★★★★',date:'16 mars 2026',text:'Voiture exceptionnelle, Élite Motors est sérieux.'}]
  },
  'vnt-3': {
    emoji:'🚙', name:'Kia Sportage', agency:'Dakar Auto Services',
    image:'kia.png',
    price:7200000, priceLabel:'7 200 000', priceUnit:'F CFA', stars:'★★★★☆', rating:'3.8 (14 avis)',
    specs:[{label:'Sièges',val:'5 places'},{label:'Portes',val:'5 portes'},{label:'Catégorie',val:'SUV'},{label:'Transmission',val:'Automatique'},{label:'Kilométrage',val:'74 000 km'},{label:'Classe',val:'Standard'}],
    motor:[{label:'Carburant',val:'Gazoil'},{label:'Cylindrée',val:'1 700 cm³'},{label:'Conso.',val:'6,8 L/100km'},{label:'Puissance',val:'141 ch'}],
    equip:['Climatisation','Bluetooth','Caméra recul','Jantes 17"','Régulateur'],
    desc:'Kia Sportage 2019 fiable. Carnet à jour. Couleur : Gris foncé.',
    tags:['SUV · 2019','74 000 km','Gazoil','Auto'],
    reviews:[{name:'Oumar B.',stars:'★★★★☆',date:'7 mars 2026',text:'Bon véhicule pour le prix.'}]
  },
  'vnt-4': {
    emoji:'🛻', name:'Toyota Hilux', agency:'AutoSud SN · Thiès',
    image:'toyotahilux.png',
    price:9800000, priceLabel:'9 800 000', priceUnit:'F CFA', stars:'★★★☆☆', rating:'3.2 (6 avis)',
    specs:[{label:'Sièges',val:'5 places'},{label:'Portes',val:'4 portes'},{label:'Catégorie',val:'Pick-up'},{label:'Transmission',val:'Manuelle'},{label:'Kilométrage',val:'90 000 km'},{label:'Classe',val:'Standard'}],
    motor:[{label:'Carburant',val:'Gazoil'},{label:'Cylindrée',val:'2 400 cm³'},{label:'Conso.',val:'9,8 L/100km'},{label:'Puissance',val:'150 ch'}],
    equip:['Climatisation','Bluetooth','4x4','Benne','ABS'],
    desc:'Toyota Hilux 2018 pick-up robuste. Couleur : Blanc.',
    tags:['Pick-up · 2018','90 000 km','Gazoil','Manuelle'],
    reviews:[{name:'Mamadou C.',stars:'★★★☆☆',date:'4 mars 2026',text:'Bon moteur mais carrosserie usée.'}]
  },
  'vnt-5': {
    emoji:'🚘', name:'Peugeot 3008', agency:'MobileCar · Dakar',
    image:'3008.png',
    price:17000000, priceLabel:'17 000 000', priceUnit:'F CFA', stars:'★★★★★', rating:'4.7 (30 avis)',
    specs:[{label:'Sièges',val:'5 places'},{label:'Portes',val:'5 portes'},{label:'Catégorie',val:'SUV'},{label:'Transmission',val:'Automatique'},{label:'Kilométrage',val:'18 000 km'},{label:'Classe',val:'Luxe'}],
    motor:[{label:'Carburant',val:'Essence'},{label:'Cylindrée',val:'1 600 cm³'},{label:'Conso.',val:'6,9 L/100km'},{label:'Puissance',val:'225 ch'}],
    equip:['Clim bi-zone','Cuir','Caméra 360°','Apple CarPlay','Toit panoramique','Jantes 19"','HUD'],
    desc:'Peugeot 3008 GT 2022 quasi neuf. Cuir Alcantara. Couleur : Rouge ultimate. Garantie 6 mois.',
    tags:['SUV · 2022','18 000 km','Essence','Auto'],
    reviews:[{name:'Sokhna A.',stars:'★★★★★',date:'17 mars 2026',text:'Magnifique ! MobileCar livraison le jour même.'}]
  }
};

export const agencyInfo = {
  'Agence Dakar Auto':      {address:'Dakar Plateau', stars:'★★★★☆', since:'Depuis 2020', sales:18, nbLoc:10, nbVnt:3},
  'TransAfrica Location':   {address:'Almadies, Dakar', stars:'★★★★★', since:'Depuis 2018', sales:42, nbLoc:15, nbVnt:0},
  'Premium Cars Dakar':     {address:'Mermoz, Dakar', stars:'★★★★☆', since:'Depuis 2021', sales:9, nbLoc:8, nbVnt:4},
  'Dakar Auto Services':    {address:'Médina, Dakar', stars:'★★★★☆', since:'Depuis 2019', sales:24, nbLoc:12, nbVnt:5},
  'Auto Plus SN · Dakar':   {address:'Sacré-Cœur, Dakar', stars:'★★★★☆', since:'Depuis 2020', sales:14, nbLoc:2, nbVnt:8},
  'Élite Motors SN · Dakar':{address:'Plateau, Dakar', stars:'★★★★★', since:'Depuis 2017', sales:51, nbLoc:0, nbVnt:12},
  'AutoSud SN · Thiès':     {address:'Thiès Centre', stars:'★★★☆☆', since:'Depuis 2022', sales:6, nbLoc:4, nbVnt:6},
  'MobileCar · Dakar':      {address:'Grand-Yoff, Dakar', stars:'★★★★★', since:'Depuis 2019', sales:30, nbLoc:3, nbVnt:10}
};

export const marqueModeles = {
  Toyota:['Land Cruiser','Hilux','Hiace','Corolla','Prado','RAV4'],
  Mercedes:['Sprinter','Classe C','Classe E','GLC','Vito'],
  Hyundai:['Tucson','Elantra','Santa Fe','i10','i20'],
  Renault:['Duster','Clio','Megane','Captur','Kadjar'],
  Kia:['Sportage','Sorento','Picanto','Cerato'],
  Peugeot:['3008','5008','208','308','2008'],
  BMW:['Série 3','Série 5','X5','X3','X1'],
  Volkswagen:['Tiguan','Golf','Passat','Polo'],
  Ford:['Ranger','F-150','Focus','Kuga'],
  Nissan:['Patrol','Navara','Qashqai','X-Trail'],
  Mitsubishi:['Pajero','L200','Outlander'],
};

export const unavailablePeriods = [
  {from:'2026-04-05', to:'2026-04-12'},
  {from:'2026-04-20', to:'2026-04-25'}
];

export const agencyFleet = {
  loc:[
    {emoji:'🚙',name:'Toyota Prado 2021',detail:'SUV · 7 places',price:'85 000 F/jour',avail:true},
    {emoji:'🚗',name:'Renault Duster 2022',detail:'SUV · 5 places',price:'55 000 F/jour',avail:true},
    {emoji:'🚐',name:'Mercedes Sprinter',detail:'Van · 9 places',price:'120 000 F/jour',avail:false}
  ],
  vnt:[
    {emoji:'🚘',name:'Kia Sportage 2019',detail:'SUV · 74 000 km',price:'7 200 000 F CFA',avail:true},
    {emoji:'🏎️',name:'BMW X3 2020',detail:'SUV · 45 000 km',price:'15 000 000 F CFA',avail:true}
  ],
  both:[
    {emoji:'🚙',name:'Toyota Land Cruiser',detail:'SUV · 2022',price:'Location & Vente',avail:true}
  ]
};

