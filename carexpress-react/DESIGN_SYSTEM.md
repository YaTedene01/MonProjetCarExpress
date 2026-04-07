# 📚 Guide Complet du Design CarExpress

## 🎨 Système de Design

CarExpress utilise un système de design moderne et professionnel basé sur les principes du design contemporain.

### Palette de Couleurs

#### Couleur Principale - Rouge CarExpress
```
#D40511 - Rouge primaire (CTA, accents)
#FFF1F1 - Fond clair
#F7C4C8 - Ton moyen
rgba(212, 5, 17, 0.9) - Hover
rgba(212, 5, 17, 0.3) - Shadow
```

**Utilisation** : Boutons primaires, accents importants, appels à l'action

#### Couleur Accent - Jaune
```
#FFCC00 - Jaune accent
#FFF8D6 - Fond clair
#FFE066 - Ton moyen
#7a5c00 - Texte sur fond clair
```

**Utilisation** : Badges, highlights, informations secondaires

#### Neutres
```
Noir : #111111
Gris clair : #181512 (texte principal)
Gris moyen : #5f5750 (texte secondaire)
Gris foncé : #8f877f (texte tertiaire)
Blanc : #FFFFFF
```

#### Backgrounds
```
Primaire : #f7f3ee
Secondaire : #fffdfb
Tertiaire : #efe6dd
```

#### États
```
Succès : #1a7a2e / #e6f4ea
```

### Typographie

#### Hiérarchie Typographique

**Display Font** : Space Grotesk
- Utilisée pour les titres, headings, et éléments de marque
- Poids : 400, 500, 700

**Body Font** : Plus Jakarta Sans
- Utilisée pour le corps du texte et interfaces
- Poids : 400, 500, 600, 700, 800

**Mono Font** : JetBrains Mono
- Utilisée pour le code et éléments techniques
- Poids : 400, 500

#### Tailles de Texte

```
H1 (Titres principaux) : 52px / 800
H2 (Titres sections) : 44px / 800
H3 (Sous-titres) : 28px / 700
H4 : 24px / 700
Body : 16px / 400
Label : 14px / 600
Small : 13px / 500
Tiny : 12px / 400
```

### Espacement

Échelle basée sur 8px :

```
xs : 4px
sm : 8px
md : 16px
lg : 24px
xl : 32px
2xl : 40px
3xl : 60px
```

### Border Radius

```
sm : 12px (inputs, petits éléments)
md : 18px (cards standard)
lg : 24px (sections)
pill : 999px (boutons, badges)
```

### Ombres

```
sm : 0 10px 30px rgba(17, 17, 17, 0.06)
md : 0 18px 44px rgba(17, 17, 17, 0.1)
lg : 0 30px 80px rgba(17, 17, 17, 0.14)
primary : 0 8px 24px rgba(212, 5, 17, 0.3)
```

### Transitions

```
fast : 0.15s ease
normal : 0.3s ease (recommandé)
slow : 0.5s ease
```

---

## 🏗️ Architecture des Composants

### Niveaux de Composants

#### Niveau 1 : Pages
- `LandingPage.jsx` - Page d'accueil
- `ClientApp.jsx` - Application client
- `AgencyApp.jsx` - Application agence
- `AdminApp.jsx` - Application admin

#### Niveau 2 : Sections
- `EnhancedRoleSelect.jsx` - Sélection des rôles
- `ModernDashboard.jsx` - Dashboard
- `ModernAuth.jsx` - Formulaires d'authentification

#### Niveau 3 : Composants Réutilisables
- `EnhancedAuthForm.jsx` - Formulaire générique
- `UserProfile.jsx` - Profil utilisateur
- `FilterPanel.jsx` - Filtrage
- `VehicleDetail.jsx` - Détail véhicule

#### Niveau 4 : Primitifs
- Boutons
- Inputs
- Cards
- Icons

---

## 🎯 Patterns de Design

### Pattern : Hero Section
```jsx
<section style={{
  padding: '100px 40px',
  background: 'linear-gradient(135deg, rgba(212, 5, 17, 0.05), rgba(255, 204, 0, 0.03))'
}}>
  {/* Contenu centré */}
</section>
```

### Pattern : Card avec Hover
```jsx
<div style={{
  ...styles.card,
  background: hoveredFeature === idx ? 'var(--panel-strong)' : 'var(--panel)',
  transform: hoveredFeature === idx ? 'translateY(-4px)' : 'translateY(0)'
}}
onMouseEnter={() => setHoveredFeature(idx)}
onMouseLeave={() => setHoveredFeature(null)}
>
```

### Pattern : Bouton avec Hover
```jsx
<button 
  style={styles.button}
  onMouseEnter={(e) => e.target.style.background = 'rgba(212, 5, 17, 0.9)'}
  onMouseLeave={(e) => e.target.style.background = 'var(--loc)'}
>
  Cliquez-moi
</button>
```

### Pattern : Grid Responsive
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '32px'
}}>
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

### Patterns Responsive

```jsx
// Grid qui s'adapte
gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'

// Font size fluide
fontSize: 'clamp(1rem, 2vw, 2rem)'

// Padding responsive
padding: 'clamp(1rem, 5vw, 3rem)'
```

---

## ✨ Animations

### Animations CSS

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Utilisations

```jsx
// Animation float (cartes qui bougent)
animation: 'float 3s ease-in-out infinite'

// Animation slide-in (apparition)
animation: 'slideIn 0.5s ease-out'

// Animation fade-in (fond)
animation: 'fadeIn 0.5s ease-out'

// Animation pulse (pulsation)
animation: 'pulse 2s ease-in-out infinite'
```

---

## 🔧 Utilisation du Système de Design

### Importer les Styles
```javascript
import THEME, { STYLES, ANIMATIONS } from '../config/theme';
```

### Appliquer les Couleurs
```jsx
<div style={{ color: THEME.colors.primary }}>
  Texte rouge
</div>
```

### Utiliser les Espaces
```jsx
<div style={{ padding: THEME.spacing.xl }}>
  Contenu avec padding xl (32px)
</div>
```

### Appliquer des Ombres
```jsx
<div style={{ boxShadow: THEME.shadows.lg }}>
  Contenu avec grande ombre
</div>
```

---

## 🎓 Bonnes Pratiques

### ✅ À Faire

- Utiliser les variables CSS pour la cohérence
- Garder les transitions courtes (0.3s max)
- Maintenir le contraste WCAG AAA minimum
- Tester sur mobile ET desktop
- Utiliser les espacements standards
- Appliquer les ombres pour la profondeur
- Utiliser les gradients avec parcimonie

### ❌ À Éviter

- Les animations qui dépassent 0.5s sans raison
- Les couleurs sans contraste suffisant
- Les transitions trop rapides (< 0.15s) ou lentes (> 0.5s)
- Les espacements aléatoires
- Les ombres sans gradient de profondeur
- Les bordures sans purpose design

---

## 📊 Exemples de Composants

### Bouton Primaire
```jsx
<button style={{
  padding: '14px 32px',
  background: THEME.colors.primary,
  color: 'white',
  border: 'none',
  borderRadius: THEME.borderRadius.pill,
  fontWeight: THEME.typography.fontWeight.bold,
  boxShadow: THEME.shadows.primary,
  transition: `all ${THEME.transitions.normal}`,
  cursor: 'pointer'
}}>
  Cliquez-moi
</button>
```

### Card Élevée
```jsx
<div style={{
  ...THEME.STYLES.card.elevated,
  padding: THEME.spacing.xl
}}>
  Contenu
</div>
```

### Input Standard
```jsx
<input 
  style={{
    ...THEME.STYLES.input.base,
    borderRadius: THEME.borderRadius.sm
  }}
  placeholder="Entrez..."
/>
```

### Titre H1
```jsx
<h1 style={THEME.STYLES.text.h1}>
  Titre Principal
</h1>
```

---

## 🔐 Accessibility (A11Y)

### Couleurs
- Ratio de contraste minimum 4.5:1 pour le texte
- Ratio de contraste minimum 3:1 pour les graphiques

### Typography
- Taille minimum 14px pour le body text
- Interlignage minimum 1.5x

### Interactivité
- Focus visible sur tous les éléments interactifs
- Zones tactiles minimum 44x44px

### Images
- Alt text descriptif
- Icônes avec labels

---

## 📖 Ressources

- [Tailwind CSS](https://tailwindcss.com)
- [Space Grotesk Font](https://fonts.google.com/specimen/Space+Grotesk)
- [Plus Jakarta Sans Font](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Dernière mise à jour** : Mars 2026  
**Version du Design System** : 1.0.0
