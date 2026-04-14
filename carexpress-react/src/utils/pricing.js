const RENTAL_BANDS = [
  { min: 20000, max: 29999.99, percentage: 15, label: "20.000 a 29.000 F CFA" },
  { min: 30000, max: 39999.99, percentage: 20, label: "30.000 a 39.000 F CFA" },
  { min: 40000, max: 49999.99, percentage: 25, label: "40.000 a 49.000 F CFA" },
  { min: 50000, max: 99999.99, percentage: 30, label: "50.000 a 100.000 F CFA" },
  { min: 100000, max: null, percentage: 35, label: "100.000 F CFA et +" },
];

const SALE_BANDS = [
  { min: 500000, max: 999999.99, percentage: 15, label: "500.000 a 1.000.000 F CFA" },
  { min: 1000000, max: 1999999.99, percentage: 20, label: "1.000.000 a 2.000.000 F CFA" },
  { min: 2000000, max: 2999999.99, percentage: 25, label: "2.000.000 a 3.000.000 F CFA" },
  { min: 3000000, max: 4999999.99, percentage: 30, label: "3.000.000 a 4.999.999 F CFA" },
  { min: 5000000, max: null, percentage: 35, label: "5.000.000 F CFA et +" },
];

export function getPricingBands(type) {
  return type === "sale" ? SALE_BANDS : RENTAL_BANDS;
}

export function formatMoney(value) {
  return Number(value || 0).toLocaleString("fr-FR");
}

export function getPricingDetails(type, price) {
  const numericPrice = Number(price || 0);
  const bands = getPricingBands(type);
  const band = bands.find((item) => numericPrice >= item.min && (item.max === null || numericPrice <= item.max));

  if (!band) {
    return null;
  }

  const adminShare = Math.round(numericPrice * (band.percentage / 100));

  return {
    ...band,
    type,
    price: numericPrice,
    adminShare,
    agencyNet: numericPrice - adminShare,
  };
}
