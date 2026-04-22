import { getPricingDetails } from "../utils/pricing";
import { getApiBaseUrl } from "./api";

function resolveStorageUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("blob:")) return path;
  // /storage/... paths must be prefixed with the backend origin, not /api/v1.
  const base = getApiBaseUrl()
    .replace(/\/$/, "")
    .replace(/\/api\/v\d+$/i, "")
    .replace(/\/api$/i, "");
  return base ? `${base}${path}` : path;
}

const imageByKeyword = [
  { keywords: ["land cruiser", "prado"], image: "landcruiser.jpg", emoji: "🚙" },
  { keywords: ["sprinter"], image: "mercedes sprinter.jpg", emoji: "🚐" },
  { keywords: ["hiace"], image: "toyota hiace.jpg", emoji: "🚌" },
  { keywords: ["tucson"], image: "tucson.png", emoji: "🚕" },
  { keywords: ["duster"], image: "duster.jpeg", emoji: "🚗" },
  { keywords: ["clio"], image: "clio.png", emoji: "🚗" },
  { keywords: ["bmw", "serie 3", "x5"], image: "bmw-x5-30d-2019-08_1.jpg", emoji: "🏎️" },
  { keywords: ["kia", "sportage"], image: "kia.png", emoji: "🚙" },
  { keywords: ["hilux"], image: "toyotahilux.png", emoji: "🛻" },
  { keywords: ["3008", "peugeot"], image: "3008.png", emoji: "🚘" },
];

function pickVisual(vehicle) {
  const haystack = `${vehicle?.name || ""} ${vehicle?.brand || ""} ${vehicle?.model || ""}`.toLowerCase();
  return imageByKeyword.find((item) => item.keywords.some((keyword) => haystack.includes(keyword))) || { image: "", emoji: "🚘" };
}

function toStars(rating) {
  const value = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return `${"★".repeat(value)}${"☆".repeat(5 - value)}`;
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("fr-FR");
}

export function adaptVehicleForUi(vehicle) {
  const visual = pickVisual(vehicle);
  const isRental = vehicle.listing_type === "rental";
  const seats = vehicle.seats || 5;
  const doors = vehicle.doors || 5;
  const year = vehicle.year || "2026";
  const className = vehicle.class_name || "Standard";
  const mileage = vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString("fr-FR")} km` : "Kilometrage non renseigne";
  const reviewsCount = Number(vehicle.reviews_count || 0);
  const ratingValue = Number(vehicle.rating || 0);
  const availabilityFrom = vehicle.specifications?.available_from || "";
  const availabilityTo = vehicle.specifications?.available_to || "";
  const gallery = Array.isArray(vehicle.gallery)
    ? vehicle.gallery.map((item) => resolveStorageUrl(item)).filter(Boolean)
    : [];

  return {
    ...vehicle,
    id: `${isRental ? "loc" : "vnt"}-${vehicle.id}`,
    backendId: vehicle.id,
    emoji: visual.emoji,
    image: gallery[0] || visual.image,
    fallbackImage: visual.image || "",
    images: gallery,
    name: vehicle.name,
    agency: vehicle.agency?.name || "Agence partenaire",
    price: Number(vehicle.price || 0),
    priceLabel: formatCurrency(vehicle.price),
    priceUnit: isRental ? "F CFA / jour" : "F CFA",
    stars: reviewsCount > 0 ? toStars(ratingValue) : "",
    rating: reviewsCount > 0 ? `${ratingValue.toFixed(1)} (${reviewsCount} avis)` : "Aucun avis pour le moment",
    alsoForSale: isRental,
    tags: vehicle.tags?.length
      ? vehicle.tags
      : [`${vehicle.category || "Vehicule"} · ${year}`, `${seats} places`, vehicle.fuel_type || "Carburant", vehicle.transmission || "Transmission"],
    specs: [
      { label: "Sieges", val: `${seats} places` },
      { label: "Portes", val: `${doors} portes` },
      { label: "Categorie", val: vehicle.category || "Vehicule" },
      { label: "Transmission", val: vehicle.transmission || "Non renseignee" },
      { label: isRental ? "Annee" : "Kilometrage", val: isRental ? String(year) : mileage },
      { label: "Classe", val: className },
      ...(isRental && availabilityFrom ? [{ label: "Disponible du", val: availabilityFrom }] : []),
      ...(isRental && availabilityTo ? [{ label: "Disponible au", val: availabilityTo }] : []),
    ],
    motor: [
      { label: "Carburant", val: vehicle.fuel_type || "Non renseigne" },
      { label: "Cylindree", val: vehicle.engine || "Non renseignee" },
      { label: "Conso.", val: vehicle.consumption || "Non renseignee" },
      { label: "Puissance", val: vehicle.horsepower || "Non renseignee" },
    ],
    equip: vehicle.equipment?.length ? vehicle.equipment : ["Climatisation", "Bluetooth", "ABS"],
    desc: vehicle.description || vehicle.summary || "Description non renseignee pour le moment.",
    reviews: Array.isArray(vehicle.reviews) ? vehicle.reviews : [],
    city: vehicle.city,
    detail: `${vehicle.category || "Vehicule"} · ${isRental ? `${seats} places` : mileage} · ${formatCurrency(vehicle.price)} F${isRental ? " / jour" : ""}`,
    commercialDetail: vehicle.summary || vehicle.description || "",
    type: isRental ? "Location" : "Vente",
    statusLabel: vehicle.status,
    availabilityBadge: isRental
      ? (vehicle.status === "rented" ? "Loue" : vehicle.status === "maintenance" ? "Indisponible" : "")
      : (vehicle.status === "sold" ? "Vendu" : ""),
    transmission: vehicle.transmission || "Automatique",
  };
}

export function adaptAgencyVehicleRow(vehicle) {
  const uiVehicle = adaptVehicleForUi(vehicle);
  const statusMap = {
    pending: "En attente admin",
    available: "Disponible",
    rented: "Loue",
    for_sale: "En vente",
    maintenance: "Maintenance",
    sold: "Vendu",
    draft: "Brouillon",
  };

  return {
    id: vehicle.id,
    backendId: vehicle.id,
    name: uiVehicle.name,
    detail: uiVehicle.detail,
    commercialDetail: uiVehicle.commercialDetail,
    status: statusMap[vehicle.status] || vehicle.status,
    type: vehicle.listing_type === "sale" ? "Vente" : "Location",
    revenue: vehicle.listing_type === "sale"
      ? `Frais service ${formatCurrency(vehicle.service_fee || 0)} F`
      : `${formatCurrency(vehicle.price)} F / jour`,
    views: vehicle.reviews_count || 0,
    urgent: vehicle.status === "maintenance",
    images: uiVehicle.images?.length ? uiVehicle.images : [uiVehicle.image].filter(Boolean),
    city: vehicle.city,
    transmission: vehicle.transmission || "Automatique",
    raw: vehicle,
  };
}

export function adaptAdminAgency(agency) {
  const activity = agency.activity || "Location et vente";
  const type = activity.toLowerCase().includes("vente") && activity.toLowerCase().includes("location")
    ? "Les deux"
    : activity.toLowerCase().includes("vente")
      ? "Vente"
      : "Location";
  const statusMap = {
    active: "Active",
    pending: "En attente",
    suspended: "Suspendue",
  };

  return {
    ...agency,
    name: agency.name,
    city: agency.city,
    type,
    status: statusMap[agency.status] || agency.status,
    docs: [agency.district, agency.address].filter(Boolean).join(" · ") || "Informations administratives enregistrees",
    revenue: `${agency.vehicles_count || 0} vehicule${agency.vehicles_count > 1 ? "s" : ""}`,
  };
}

export function adaptAdminAgencyDetail(agency) {
  const baseAgency = adaptAdminAgency(agency);

  return {
    ...baseAgency,
    vehicles: Array.isArray(agency?.vehicles)
      ? agency.vehicles.map((vehicle) => adaptVehicleForUi(vehicle))
      : [],
  };
}

export function adaptAdminUser(user) {
  const roleMap = {
    client: "Client",
    agency: "Agence",
    admin: "Admin",
  };

  return {
    ...user,
    name: user.name,
    tel: user.phone || "",
    role: roleMap[user.role] || user.role,
    status: user.status === "active" ? "Actif" : (user.status || "Actif"),
  };
}
