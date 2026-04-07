import { useState } from 'react';

/**
 * Composant Dashboard moderne et professionnel
 * Peut être utilisé pour les clients, agences ou admins
 */
export function ModernDashboard({ user, role, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Véhicules Actifs', value: '28', icon: '🚗', color: '#D40511' },
    { label: 'Réservations', value: '12', icon: '📅', color: '#FFCC00' },
    { label: 'Utilisateurs', value: '156', icon: '👥', color: '#1a7a2e' },
    { label: 'Revenus', value: '45K€', icon: '💰', color: '#5f5750' }
  ];

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.navBrand}>
            <span style={styles.brandIcon}>🚗</span>
            <span style={styles.brandText}>CarExpress</span>
          </div>
          <div style={styles.navRight}>
            <span style={styles.userInfo}>{user?.name || 'Utilisateur'}</span>
            <button 
              onClick={onLogout}
              style={styles.logoutButton}
              onMouseEnter={(e) => e.target.style.background = 'rgba(212, 5, 17, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Bienvenue, {user?.name?.split(' ')[0]}</h1>
            <p style={styles.subtitle}>Gérez vos opérations et consultez les statistiques</p>
          </div>
          <div style={styles.headerDate}>
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['overview', 'vehicles', 'users', 'reports'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tabButton,
                borderBottomColor: activeTab === tab ? 'var(--loc)' : 'transparent',
                color: activeTab === tab ? 'var(--loc)' : 'var(--text2)'
              }}
            >
              {tab === 'overview' && '📊 Aperçu'}
              {tab === 'vehicles' && '🚗 Véhicules'}
              {tab === 'users' && '👥 Utilisateurs'}
              {tab === 'reports' && '📈 Rapports'}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        {activeTab === 'overview' && (
          <div style={styles.statsGrid}>
            {stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.statCard,
                  borderTopColor: stat.color
                }}
              >
                <div style={{ ...styles.statIcon, color: stat.color }}>
                  {stat.icon}
                </div>
                <div style={styles.statContent}>
                  <div style={styles.statLabel}>{stat.label}</div>
                  <div style={styles.statValue}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content Sections */}
        {activeTab === 'vehicles' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Gestion des Véhicules</h2>
            <div style={styles.placeholder}>
              <span>🚗</span>
              <p>Liste des véhicules disponibles</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Gestion des Utilisateurs</h2>
            <div style={styles.placeholder}>
              <span>👥</span>
              <p>Gestion des comptes utilisateurs</p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Rapports & Analytics</h2>
            <div style={styles.placeholder}>
              <span>📈</span>
              <p>Analyses et statistiques détaillées</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg)'
  },
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'var(--panel-strong)',
    borderBottom: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '20px',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    color: 'var(--text)'
  },
  brandIcon: {
    fontSize: '24px'
  },
  brandText: {
    background: 'linear-gradient(135deg, var(--loc), #ff6b6b)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userInfo: {
    fontSize: '14px',
    color: 'var(--text2)',
    fontWeight: '500'
  },
  logoutButton: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-pill)',
    color: 'var(--text)',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px'
  },
  header: {
    marginBottom: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    color: 'var(--text)',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text2)',
    fontFamily: 'var(--font)'
  },
  headerDate: {
    fontSize: '14px',
    color: 'var(--text2)',
    padding: '8px 16px',
    background: 'var(--panel)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)'
  },
  tabs: {
    display: 'flex',
    gap: '32px',
    borderBottom: '1px solid var(--border)',
    marginBottom: '32px'
  },
  tabButton: {
    padding: '12px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'var(--font)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  statCard: {
    padding: '24px',
    background: 'var(--panel-strong)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    borderTop: '4px solid',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.3s ease'
  },
  statIcon: {
    fontSize: '32px',
    flexShrink: 0
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--text2)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text)',
    fontFamily: 'var(--font-display)'
  },
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    color: 'var(--text)',
    marginBottom: '24px'
  },
  placeholder: {
    padding: '60px 40px',
    background: 'var(--panel)',
    border: '2px dashed var(--border)',
    borderRadius: 'var(--radius)',
    textAlign: 'center',
    color: 'var(--text2)'
  }
};
