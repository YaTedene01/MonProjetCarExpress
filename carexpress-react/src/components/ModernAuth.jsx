import { createAgencyRequest } from "../services/agencyRequests";
import { EnhancedAuthForm } from "./EnhancedAuthForm";

export function ModernClientAuth({ onLogin, onBack }) {
  const handleSubmit = async (data) => {
    await onLogin(data);
  };

  return (
    <EnhancedAuthForm
      title="Espace Client"
      subtitle="Connectez-vous pour rechercher un vehicule, consulter les details, reserver une location ou lancer une demande d'achat."
      role="client"
      onSubmit={handleSubmit}
      onBack={onBack}
    />
  );
}

export function ModernAgencyAuth({ onLogin, onBack, onRegister }) {
  const handleSubmit = async (data) => {
    if (data.mode === "signup") {
      await createAgencyRequest(data);
      onRegister?.({
        name: data.company || "Nouvelle agence",
        activity: data.activity || "Location et vente",
        city: data.city || "Dakar",
        color: data.color || "#D40511",
        logoUrl: "",
      });
      return;
    }
    await onLogin(data);
  };

  return (
    <EnhancedAuthForm
      title="Espace Agence"
      subtitle="Accedez a votre espace partenaire pour gerer vos vehicules, vos annonces et les demandes de clients."
      role="agency"
      onSubmit={handleSubmit}
      onBack={onBack}
    />
  );
}

export function ModernAdminAuth({ onLogin, onBack }) {
  const handleSubmit = async (data) => {
    await onLogin(data);
  };

  return (
    <EnhancedAuthForm
      title="Super Admin"
      subtitle="Connectez-vous pour superviser la plateforme Car Express, les acces et les operations globales."
      role="admin"
      onSubmit={handleSubmit}
      onBack={onBack}
    />
  );
}
