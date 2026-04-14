import { vehicles } from "../data";
import { adaptVehicleForUi } from "./adapters";

export class VehicleService {
  static getAllVehicles(sourceVehicles = null) {
    if (Array.isArray(sourceVehicles)) {
      return sourceVehicles.map((vehicle) => adaptVehicleForUi(vehicle));
    }

    return Object.entries(vehicles).map(([id, vehicle]) => ({ ...vehicle, id }));
  }

  static getLocationVehicles(sourceVehicles = null) {
    const allVehicles = this.getAllVehicles(sourceVehicles);
    return allVehicles.filter((vehicle) => vehicle.id.startsWith("loc-"));
  }

  static getSaleVehicles(sourceVehicles = null) {
    const allVehicles = this.getAllVehicles(sourceVehicles);
    return allVehicles.filter((vehicle) => vehicle.id.startsWith("vnt-"));
  }

  static getVehicleById(id, sourceVehicles = null) {
    if (Array.isArray(sourceVehicles)) {
      return this.getAllVehicles(sourceVehicles).find((vehicle) => vehicle.id === id) || null;
    }

    const vehicle = vehicles[id];
    return vehicle ? { ...vehicle, id } : null;
  }

  static filterVehicles(vehicles, filters) {
    if (!Array.isArray(vehicles) || !filters) {
      return vehicles || [];
    }

    const normalize = (value) => String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const extractSeats = (value) => {
      const numeric = Number(value);
      if (Number.isFinite(numeric) && numeric > 0) return numeric;

      const match = String(value || "").match(/\d+/);
      return match ? Number(match[0]) : null;
    };

    return vehicles.filter((vehicle) => {
      const brand = normalize(vehicle.brand);
      const model = normalize(vehicle.model);
      const fuel = normalize(vehicle.fuel_type);
      const transmission = normalize(vehicle.transmission);
      const category = normalize(vehicle.category);
      const city = normalize(vehicle.city);
      const locationLabel = normalize(vehicle.location_label);
      const className = normalize(vehicle.class_name || vehicle.specs?.find((item) => normalize(item.label) === "classe")?.val);
      const seats = extractSeats(vehicle.seats);

      if (filters.marque && filters.marque !== "Toutes" && !brand.includes(normalize(filters.marque))) {
        return false;
      }

      if (filters.modele && filters.modele !== "Tous" && !model.includes(normalize(filters.modele))) {
        return false;
      }

      if (filters.siege && filters.siege !== "Tous") {
        const selectedSeats = extractSeats(filters.siege);

        if (selectedSeats !== null) {
          if (normalize(filters.siege).includes("12+")) {
            if (seats === null || seats < 12) return false;
          } else if (seats === null || seats !== selectedSeats) {
            return false;
          }
        }
      }

      if (filters.moteur && filters.moteur !== "Toutes" && !fuel.includes(normalize(filters.moteur))) {
        return false;
      }

      if (filters.transmission && filters.transmission !== "Toutes" && !transmission.includes(normalize(filters.transmission))) {
        return false;
      }

      if (filters.categorie && filters.categorie !== "Tous" && !category.includes(normalize(filters.categorie))) {
        return false;
      }

      if (filters.classe && filters.classe !== "Toutes" && !className.includes(normalize(filters.classe))) {
        return false;
      }

      if (filters.searchLocation) {
        const requestedLocation = normalize(filters.searchLocation);

        if (
          requestedLocation &&
          !city.includes(requestedLocation) &&
          !locationLabel.includes(requestedLocation)
        ) {
          return false;
        }
      }

      if (filters.prixMax && Number(vehicle.price || 0) > Number(filters.prixMax)) {
        return false;
      }

      return true;
    });
  }
}
