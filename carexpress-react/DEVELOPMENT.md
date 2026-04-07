# 🚀 Guide de Développement CarExpress

## 📋 Table des Matières

1. [Configuration Initiale](#configuration-initiale)
2. [Structure du Projet](#structure-du-projet)
3. [Composants Disponibles](#composants-disponibles)
4. [Styles et Théming](#styles-et-théming)
5. [Flux d'Authentification](#flux-dauthentification)
6. [Développement de Nouvelles Features](#développement-de-nouvelles-features)
7. [Déploiement](#déploiement)

---

## Configuration Initiale

### Prérequis
- Node.js 16+ 
- npm ou yarn
- VS Code (recommandé)

### Installation

```bash
# Cloner ou accéder au projet
cd carexpress-react

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Vérification
Accédez à `http://localhost:5173` et vérifiez que la landing page s'affiche.

---

## 📁 Structure du Projet

```
carexpress-react/
│
├── src/
│   ├── components/           # Composants React
│   │   ├── Auth.jsx         # Auth originale
│   │   ├── ModernAuth.jsx   # Auth moderne
│   │   ├── EnhancedRoleSelect.jsx
│   │   ├── EnhancedAuthForm.jsx
│   │   ├── ModernDashboard.jsx
│   │   ├── UserProfile.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── VehicleDetail.jsx
│   │   └── UI.jsx           # Composants UI
│   │
│   ├── pages/               # Pages principales
│   │   ├── LandingPage.jsx
│   │   ├── ClientApp.jsx
│   │   ├── AgencyApp.jsx
│   │   └── AdminApp.jsx
│   │
│   ├── data/                # Données statiques
│   │   └── index.js
│   │
│   ├── config/              # Configuration
│   │   └── theme.js        # Système de design
│   │
│   ├── styles/              # Fichiers de style
│   │   ├── modern.js       # Styles réutilisables
│   │   └── index.css       # Styles globaux + animations
│   │
│   ├── assets/              # Images et ressources
│   │   └── ...
│   │
│   ├── App.jsx             # Composant racine
│   ├── index.jsx           # Point d'entrée
│   └── index.css           # Styles globaux
│
├── public/                  # Fichiers statiques
├── index.html              # HTML template
├── vite.config.js          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind
├── postcss.config.js       # Configuration PostCSS
├── package.json
├── README_DESIGN.md        # Guide design
├── DESIGN_SYSTEM.md        # Système de design détaillé
└── DEVELOPMENT.md          # Ce fichier
```

---

## 🧩 Composants Disponibles

### Landing Page
**Fichier** : `src/pages/LandingPage.jsx`

Affiche une page de présentation avec :
- Hero section
- Features grid
- How it works
- Testimonials
- CTA section
- Footer

```jsx
import LandingPage from './pages/LandingPage';

<LandingPage onGetStarted={() => {}} />
```

### Enhanced Role Select
**Fichier** : `src/components/EnhancedRoleSelect.jsx`

Permet aux utilisateurs de choisir leur rôle avec une interface moderne.

```jsx
import { EnhancedRoleSelect } from './components/EnhancedRoleSelect';

<EnhancedRoleSelect 
  onSelect={(role) => console.log(role)}
  onBack={() => {}}
/>
```

### Modern Auth Forms
**Fichier** : `src/components/ModernAuth.jsx`

Trois composants :
- `ModernClientAuth` - Pour les clients
- `ModernAgencyAuth` - Pour les agences
- `ModernAdminAuth` - Pour les admins

```jsx
import { ModernClientAuth } from './components/ModernAuth';

<ModernClientAuth 
  onLogin={(data) => console.log(data)}
  onBack={() => {}}
/>
```

### Modern Dashboard
**Fichier** : `src/components/ModernDashboard.jsx`

Dashboard complet avec :
- Navbar
- Tabs de navigation
- Grid de statistiques
- Sections modulables

```jsx
import { ModernDashboard } from './components/ModernDashboard';

<ModernDashboard 
  user={{ name: 'John Doe' }}
  role="client"
  onLogout={() => {}}
/>
```

### User Profile
**Fichier** : `src/components/UserProfile.jsx`

Modal de profil utilisateur avec édition.

```jsx
import { UserProfile } from './components/UserProfile';

<UserProfile 
  user={{ name: 'John', email: 'john@example.com' }}
  onClose={() => {}}
/>
```

---

## 🎨 Styles et Théming

### Utiliser le Système de Design

```javascript
import THEME, { STYLES, ANIMATIONS } from './config/theme';

// Accéder aux couleurs
const color = THEME.colors.primary;  // #D40511

// Accéder aux espacements
const padding = THEME.spacing.xl;   // 32px

// Accéder aux shadows
const shadow = THEME.shadows.lg;    // 0 30px 80px rgba(...)

// Accéder aux styles réutilisables
const buttonStyle = {
  ...STYLES.button.base,
  ...STYLES.button.primary
};
```

### Variables CSS Disponibles

```css
/* Couleurs */
--loc: #d40511;
--vnt: #ffcc00;
--black: #111111;
--bg: #f7f3ee;
--text: #181512;

/* Espacement */
--radius: 18px;
--radius-sm: 12px;
--radius-pill: 999px;

/* Typographie */
--font: "Plus Jakarta Sans", sans-serif;
--font-display: "Space Grotesk", sans-serif;
--mono: "JetBrains Mono", monospace;

/* Ombres */
--shadow-sm: 0 10px 30px rgba(17, 17, 17, 0.06);
--shadow-md: 0 18px 44px rgba(17, 17, 17, 0.1);
--shadow-lg: 0 30px 80px rgba(17, 17, 17, 0.14);
```

### Créer un Nouveau Composant avec les Styles

```jsx
import THEME from '../config/theme';

export function MyComponent() {
  return (
    <div style={{
      padding: THEME.spacing.xl,
      background: THEME.colors.bgPrimary,
      borderRadius: THEME.borderRadius.md,
      boxShadow: THEME.shadows.md
    }}>
      <h2 style={THEME.STYLES.text.h2}>
        Mon Titre
      </h2>
      <p style={THEME.STYLES.text.body}>
        Mon contenu
      </p>
    </div>
  );
}
```

---

## 🔐 Flux d'Authentification

### Flux Utilisateur

```
LandingPage
    ↓
EnhancedRoleSelect (choix du rôle)
    ↓
ModernAuth (login)
    ↓
App (Client/Agency/Admin)
```

### Implémentation dans App.jsx

```jsx
const [screen, setScreen] = useState('landing');

// États : 'landing' | 'select' | 'auth-client' | 'auth-agency' | 'auth-admin' | 'app-*'

const handleGetStarted = () => setScreen('select');
const handleRoleSelect = (role) => setScreen('auth-' + role);
const handleLogin = (userData) => {
  setUser(userData);
  setScreen('app-' + role);
};
```

### Créer un Nouveau Flux

1. Ajouter un nouvel état dans `App.jsx`
2. Créer les composants correspondants
3. Connecter les callbacks
4. Ajouter les conditions de rendu

---

## ✨ Développement de Nouvelles Features

### Créer un Nouveau Composant

```jsx
// src/components/MyNewComponent.jsx
import THEME from '../config/theme';

export function MyNewComponent({ prop1, prop2, onAction }) {
  const [state, setState] = useState(null);

  const styles = {
    container: {
      padding: THEME.spacing.xl,
      background: THEME.colors.panelStrong,
      borderRadius: THEME.borderRadius.md,
      boxShadow: THEME.shadows.sm
    }
  };

  return (
    <div style={styles.container}>
      {/* Contenu */}
    </div>
  );
}
```

### Ajouter une Nouvelle Section à la Landing

```jsx
// Dans LandingPage.jsx

<section style={styles.newSection}>
  <div style={styles.container}>
    <h2 style={styles.sectionTitle}>
      Nouvelle Section
    </h2>
    {/* Contenu */}
  </div>
</section>
```

### Ajouter un Nouvel Onglet au Dashboard

```jsx
// Dans ModernDashboard.jsx

{activeTab === 'newTab' && (
  <div style={styles.section}>
    <h2 style={styles.sectionTitle}>Nouvel Onglet</h2>
    {/* Contenu */}
  </div>
)}
```

---

## 🚀 Déploiement

### Build Production

```bash
npm run build
```

Génère le dossier `dist/` prêt pour le déploiement.

### Déployer sur Netlify

```bash
# Installer netlify-cli
npm install -g netlify-cli

# Déployer
netlify deploy --prod --dir=dist
```

### Déployer sur Vercel

```bash
# Installer vercel-cli
npm install -g vercel

# Déployer
vercel --prod
```

### Variables d'Environnement

Créer un fichier `.env` :

```
VITE_API_URL=https://api.example.com
VITE_APP_NAME=CarExpress
```

Utiliser dans le code :

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🐛 Debugging

### DevTools React
Installer l'extension React DevTools pour Chrome/Firefox.

### Vite HMR
Le Hot Module Replacement fonctionne automatiquement. Modifiez un fichier et enregistrez pour voir les changements.

### Logs Utiles

```javascript
// Dans la console du navigateur
console.log('Current screen:', screen);
console.log('User data:', user);
console.log('Theme:', THEME);
```

---

## 📊 Performance

### Optimisations à Considérer

1. **Lazy Loading**
```jsx
const LandingPage = lazy(() => import('./pages/LandingPage'));

<Suspense fallback={<Loading />}>
  <LandingPage />
</Suspense>
```

2. **Memoization**
```jsx
const MemoComponent = memo(MyComponent);
```

3. **Code Splitting**
```jsx
const routes = [
  { path: '/', lazy: () => import('./pages/LandingPage') },
  { path: '/app', lazy: () => import('./pages/ClientApp') }
];
```

---

## 🧪 Testing (Futur)

### Structure de Tests

```
src/
├── components/
│   ├── MyComponent.jsx
│   └── MyComponent.test.jsx
└── ...
```

### Exemple de Test

```jsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders MyComponent', () => {
  render(<MyComponent />);
  expect(screen.getByText('...')).toBeInTheDocument();
});
```

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [CSS MDN](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## 🤝 Contribution

Avant de soumettre une PR :

1. Vérifier que les styles suivent le système de design
2. Tester sur mobile et desktop
3. Vérifier la cohérence des animations
4. Respecter la structure du dossier

---

**Bonne chance dans votre développement! 🚀**

Pour toute question, consultez le `DESIGN_SYSTEM.md` ou le `README_DESIGN.md`.
