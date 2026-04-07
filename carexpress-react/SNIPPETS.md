# 💻 Code Snippets Réutilisables

Une collection de snippets prêts à copier-coller pour vos composants CarExpress.

## 🎨 Boutons

### Bouton Primaire
```jsx
<button 
  style={{
    padding: '14px 32px',
    background: 'var(--loc)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(212, 5, 17, 0.3)'
  }}
  onMouseEnter={(e) => e.target.style.background = 'rgba(212, 5, 17, 0.9)'}
  onMouseLeave={(e) => e.target.style.background = 'var(--loc)'}
>
  Cliquez-moi
</button>
```

### Bouton Secondaire
```jsx
<button 
  style={{
    padding: '14px 32px',
    background: 'transparent',
    color: 'var(--text)',
    border: '2px solid var(--border2)',
    borderRadius: 'var(--radius-pill)',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }}
  onMouseEnter={(e) => e.target.style.borderColor = 'var(--loc)'}
  onMouseLeave={(e) => e.target.style.borderColor = 'var(--border2)'}
>
  Bouton Secondaire
</button>
```

### Bouton Petit
```jsx
<button 
  style={{
    padding: '8px 16px',
    background: 'var(--loc)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    fontWeight: '600',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }}
>
  Petit Bouton
</button>
```

---

## 📝 Inputs

### Input Standard
```jsx
<input 
  type="text"
  placeholder="Entrez du texte..."
  style={{
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    fontFamily: 'var(--font)',
    color: 'var(--text)',
    background: 'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
    outline: 'none'
  }}
  onFocus={(e) => e.target.style.borderColor = 'var(--loc)'}
  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
/>
```

### Input avec Label
```jsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <label style={{
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text)',
    fontFamily: 'var(--font)'
  }}>
    Nom
  </label>
  <input 
    type="text"
    placeholder="Entrez votre nom"
    style={{
      padding: '12px 16px',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      fontSize: '14px',
      fontFamily: 'var(--font)',
      color: 'var(--text)',
    }}
  />
</div>
```

---

## 🎯 Cards

### Card Simple
```jsx
<div style={{
  padding: '32px',
  background: 'var(--panel-strong)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  boxShadow: 'var(--shadow-sm)',
}}>
  Contenu de la card
</div>
```

### Card avec Hover
```jsx
<div style={{
  padding: '32px',
  background: 'var(--panel-strong)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  boxShadow: 'var(--shadow-sm)',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
}}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-4px)';
  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
}}
>
  Contenu interactif
</div>
```

### Feature Card (3 colonnes)
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '32px'
}}>
  {[
    { icon: '🎯', title: 'Titre 1', desc: 'Description 1' },
    { icon: '⚡', title: 'Titre 2', desc: 'Description 2' },
    { icon: '🚀', title: 'Titre 3', desc: 'Description 3' }
  ].map((item, idx) => (
    <div key={idx} style={{
      padding: '32px',
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
        {item.icon}
      </div>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '12px'
      }}>
        {item.title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: 'var(--text2)',
        lineHeight: '1.6'
      }}>
        {item.desc}
      </p>
    </div>
  ))}
</div>
```

---

## 🌐 Sections

### Hero Section
```jsx
<section style={{
  padding: '100px 40px',
  background: 'linear-gradient(135deg, rgba(212, 5, 17, 0.05), rgba(255, 204, 0, 0.03))',
  textAlign: 'center'
}}>
  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{
      fontSize: '52px',
      fontWeight: '800',
      fontFamily: 'var(--font-display)',
      marginBottom: '16px'
    }}>
      Titre Hero
    </h1>
    <p style={{
      fontSize: '20px',
      color: 'var(--text2)',
      lineHeight: '1.6',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      Sous-titre avec description
    </p>
  </div>
</section>
```

### Feature Section
```jsx
<section style={{
  padding: '100px 40px',
  background: 'var(--bg2)'
}}>
  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
    <h2 style={{
      fontSize: '44px',
      fontWeight: '800',
      fontFamily: 'var(--font-display)',
      textAlign: 'center',
      marginBottom: '64px'
    }}>
      Nos Fonctionnalités
    </h2>
    
    {/* Grid de features */}
  </div>
</section>
```

### Container Centré
```jsx
<div style={{
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 40px'
}}>
  Contenu centré et avec padding responsif
</div>
```

---

## 🎨 Typography

### Titre H1
```jsx
<h1 style={{
  fontSize: '52px',
  fontWeight: '800',
  fontFamily: 'var(--font-display)',
  color: 'var(--text)',
  lineHeight: '1.2'
}}>
  Titre Principal
</h1>
```

### Titre H2
```jsx
<h2 style={{
  fontSize: '44px',
  fontWeight: '800',
  fontFamily: 'var(--font-display)',
  color: 'var(--text)',
  lineHeight: '1.2'
}}>
  Titre Section
</h2>
```

### Titre H3
```jsx
<h3 style={{
  fontSize: '28px',
  fontWeight: '700',
  fontFamily: 'var(--font-display)',
  color: 'var(--text)'
}}>
  Sous-titre
</h3>
```

### Body Text
```jsx
<p style={{
  fontSize: '16px',
  color: 'var(--text)',
  lineHeight: '1.6',
  fontFamily: 'var(--font)'
}}>
  Texte du corps avec interlignage standard
</p>
```

### Small Text
```jsx
<small style={{
  fontSize: '12px',
  color: 'var(--text2)',
  fontFamily: 'var(--font)'
}}>
  Texte petit
</small>
```

---

## 🎬 Animations

### Animation Float
```jsx
<div style={{
  animation: 'float 3s ease-in-out infinite'
}}>
  Élément qui flotte
</div>
```

### Animation Slide In
```jsx
<div style={{
  animation: 'slideIn 0.5s ease-out'
}}>
  Élément qui slide
</div>
```

### Animation Fade In
```jsx
<div style={{
  animation: 'fadeIn 0.5s ease-out'
}}>
  Élément qui fade
</div>
```

---

## 🎯 Layout Patterns

### Grid 3 Colonnes
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '32px'
}}>
  {items.map((item, idx) => (
    <div key={idx}>{item}</div>
  ))}
</div>
```

### Grid Responsive
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '24px'
}}>
  {items.map((item, idx) => (
    <div key={idx}>{item}</div>
  ))}
</div>
```

### Flexbox Horizontal
```jsx
<div style={{
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'space-between'
}}>
  {/* Items */}
</div>
```

### Flexbox Vertical
```jsx
<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
}}>
  {/* Items */}
</div>
```

---

## 🔔 Alerts & Messages

### Message d'Erreur
```jsx
<div style={{
  padding: '12px 16px',
  background: 'rgba(212, 5, 17, 0.1)',
  border: '1px solid var(--loc)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--loc)',
  fontSize: '14px',
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
}}>
  <span>⚠️</span> Message d'erreur
</div>
```

### Message de Succès
```jsx
<div style={{
  padding: '12px 16px',
  background: 'rgba(26, 122, 46, 0.1)',
  border: '1px solid var(--green)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--green)',
  fontSize: '14px',
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
}}>
  <span>✓</span> Message de succès
</div>
```

### Message d'Info
```jsx
<div style={{
  padding: '12px 16px',
  background: 'rgba(255, 204, 0, 0.1)',
  border: '1px solid var(--vnt)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--vnt-text)',
  fontSize: '14px',
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
}}>
  <span>ℹ️</span> Message d'info
</div>
```

---

## 📊 Stats Cards

### Single Stat
```jsx
<div style={{
  padding: '24px',
  background: 'var(--panel-strong)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  borderTop: '4px solid var(--loc)'
}}>
  <div style={{ fontSize: '12px', color: 'var(--text2)', fontWeight: '600' }}>
    LABEL
  </div>
  <div style={{
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text)',
    fontFamily: 'var(--font-display)',
    marginTop: '8px'
  }}>
    123
  </div>
</div>
```

---

## 🔗 Navigation

### Navbar Simple
```jsx
<nav style={{
  position: 'sticky',
  top: 0,
  background: 'var(--panel-strong)',
  borderBottom: '1px solid var(--border)',
  padding: '16px 40px',
  zIndex: 100,
  boxShadow: 'var(--shadow-sm)'
}}>
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div style={{ fontWeight: '700', fontSize: '20px' }}>Logo</div>
    <button>Menu</button>
  </div>
</nav>
```

---

## 💡 Tips & Tricks

### Hover Effet sur Texte
```jsx
<p 
  style={{
    cursor: 'pointer',
    color: 'var(--text)',
    transition: 'color 0.3s ease'
  }}
  onMouseEnter={(e) => e.target.style.color = 'var(--loc)'}
  onMouseLeave={(e) => e.target.style.color = 'var(--text)'}
>
  Texte interactif
</p>
```

### Loading State
```jsx
<button disabled style={{
  opacity: isLoading ? 0.7 : 1,
  cursor: isLoading ? 'not-allowed' : 'pointer'
}}>
  {isLoading ? 'Chargement...' : 'Cliquez'}
</button>
```

---

**N'hésitez pas à adapter ces snippets à vos besoins!** 🚀
