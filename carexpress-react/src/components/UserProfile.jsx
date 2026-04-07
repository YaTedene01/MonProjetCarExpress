import { useState } from 'react';

export function UserProfile({ user, onClose }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          style={styles.closeButton}
        >
          ✕
        </button>

        <div style={styles.profileHeader}>
          <div style={styles.avatar}>{user?.name?.[0] || '👤'}</div>
          <h2 style={styles.profileName}>{user?.name || 'Utilisateur'}</h2>
          <p style={styles.profileEmail}>{user?.email || 'email@exemple.com'}</p>
        </div>

        {!isEditing ? (
          <div style={styles.profileInfo}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Email</span>
              <span style={styles.infoValue}>{user?.email}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Téléphone</span>
              <span style={styles.infoValue}>{user?.phone || 'Non renseigné'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Membre depuis</span>
              <span style={styles.infoValue}>Janvier 2024</span>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              style={styles.editButton}
              onMouseEnter={(e) => e.target.style.background = 'rgba(212, 5, 17, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Modifier profil
            </button>
          </div>
        ) : (
          <div style={styles.editForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nom</label>
              <input 
                type="text" 
                defaultValue={user?.name}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input 
                type="email" 
                defaultValue={user?.email}
                style={styles.input}
              />
            </div>
            <div style={styles.formButtons}>
              <button
                onClick={() => setIsEditing(false)}
                style={styles.cancelButton}
              >
                Annuler
              </button>
              <button
                style={styles.saveButton}
                onMouseEnter={(e) => e.target.style.background = 'rgba(212, 5, 17, 0.9)'}
                onMouseLeave={(e) => e.target.style.background = 'var(--loc)'}
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modal: {
    background: 'var(--panel-strong)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '40px 32px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: 'var(--shadow-lg)',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'var(--text)',
    transition: 'all 0.3s ease'
  },
  profileHeader: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(212, 5, 17, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    margin: '0 auto 16px'
  },
  profileName: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text)',
    fontFamily: 'var(--font-display)'
  },
  profileEmail: {
    fontSize: '14px',
    color: 'var(--text2)',
    marginTop: '4px'
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)'
  },
  infoLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text)'
  },
  infoValue: {
    fontSize: '14px',
    color: 'var(--text2)'
  },
  editButton: {
    marginTop: '16px',
    padding: '12px 24px',
    background: 'transparent',
    border: '2px solid var(--loc)',
    color: 'var(--loc)',
    borderRadius: 'var(--radius-pill)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text)'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    color: 'var(--text)',
    fontFamily: 'var(--font)'
  },
  formButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px'
  },
  cancelButton: {
    flex: 1,
    padding: '12px 24px',
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: 'var(--radius-pill)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  saveButton: {
    flex: 1,
    padding: '12px 24px',
    background: 'var(--loc)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(212, 5, 17, 0.3)'
  }
};
