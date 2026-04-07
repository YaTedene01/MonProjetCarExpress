import { useEffect } from "react";
import { globalStyles } from "./styles";
import { RoleSelect, ClientAuth, AgencyAuth, AdminAuth } from "./components/Auth";
import { ModernClientAuth, ModernAgencyAuth, ModernAdminAuth } from "./components/ModernAuth";
import { EnhancedRoleSelect } from "./components/EnhancedRoleSelect";
import ClientApp from "./pages/ClientApp";
import AgencyApp from "./pages/AgencyApp";
import AdminApp from "./pages/AdminApp";
import LandingPage from "./pages/LandingPage";
import { useAppState } from "./hooks/useAppState";

export default function App() {
  console.log("App rendered");

  const {
    screen,
    authReady,
    user,
    agencyBranding,
    setAgencyBranding,
    chatThreads,
    sendChatMessage,
    handleGetStarted,
    handleRoleSelect,
    handleBack,
    handleBackToSelect,
    handleGoToLanding,
    handleClientLogin,
    handleAgencyLogin,
    handleAdminLogin,
    handleRegisterAgency,
    handleClientLogout,
    handleAgencyLogout,
    handleAdminLogout,
  } = useAppState();

  // Inject global styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
    document.body.style.background = '#f7f3ee';
    document.body.style.color = '#181512';
    document.body.style.minHeight = '100vh';
    document.body.style.overflowX = 'hidden';
    return () => {
      document.head.removeChild(style);
      document.body.style.background = '';
      document.body.style.color = '';
      document.body.style.minHeight = '';
      document.body.style.overflowX = '';
    };
  }, []);

  

  return (
    <div style={{minHeight:'100vh',background:'transparent',position:'relative'}}>
      {!authReady && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#181512", fontWeight: 600 }}>
          Connexion a votre projet Car Express...
        </div>
      )}
      {authReady && (
        <>
      {screen === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted}/>
      )}
      {screen === 'select' && (
        <div style={{ position: 'relative', zIndex: 999999999 }}>
          <EnhancedRoleSelect onSelect={handleRoleSelect} onBack={handleBack} />
        </div>
      )}
      {screen === 'auth-client' && (
        <ModernClientAuth onLogin={handleClientLogin} onBack={handleBackToSelect}/>
      )}
      {screen === 'auth-agency' && (
        <ModernAgencyAuth onLogin={handleAgencyLogin} onRegister={handleRegisterAgency} onBack={handleBackToSelect}/>
      )}
      {screen === 'auth-admin' && (
        <ModernAdminAuth onLogin={handleAdminLogin} onBack={handleBackToSelect}/>
      )}
      {screen === 'app-client' && (
        <ClientApp user={user} chatThreads={chatThreads} sendChatMessage={sendChatMessage} agencyBranding={agencyBranding} onLogout={handleClientLogout} onGoToLanding={handleGoToLanding} />
      )}
      {screen === 'app-agency' && (
        <AgencyApp branding={agencyBranding} chatThreads={chatThreads} sendChatMessage={sendChatMessage} onLogout={handleAgencyLogout} onGoToLanding={handleGoToLanding} />
      )}
      {screen === 'app-admin' && (
        <AdminApp agencyBranding={agencyBranding} onRegisterAgency={handleRegisterAgency} onLogout={handleAdminLogout} onGoToLanding={handleGoToLanding} />
      )}
        </>
      )}
    </div>
  );
}
