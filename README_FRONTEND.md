# Frontend - Poems Read-Aloud

Interface React moderne pour l'application de lecture de poèmes.

## 🛠 Technologies utilisées

- **React 18** - Framework principal
- **Vite** - Build tool et dev server
- **React Router** - Navigation SPA
- **Tailwind CSS** - Styling utilitaire
- **Lucide React** - Icons modernes
- **Framer Motion** - Animations fluides
- **Axios** - Client HTTP

## 🏗 Architecture

```
src/
├── components/           # Composants réutilisables
│   ├── Header.jsx       # Navigation principale
│   ├── PoemCard.jsx     # Carte de poème
│   ├── ReaderPanel.jsx  # Interface de lecture
│   ├── Recorder.jsx     # Enregistrement audio
│   └── ScoreDisplay.jsx # Affichage des scores
├── contexts/            # Context API
│   ├── ApiContext.jsx   # Configuration API
│   └── UserContext.jsx  # Gestion utilisateur
├── hooks/               # Hooks personnalisés
│   └── useTTS.js        # Text-to-Speech
├── pages/               # Pages principales
│   ├── HomePage.jsx     # Catalogue
│   ├── PoemPage.jsx     # Lecture/Enregistrement
│   ├── ProfilePage.jsx  # Profil utilisateur
│   └── AdminPage.jsx    # Administration
├── services/            # Services externes
└── test/                # Configuration tests
```

## 🎨 Système de design

### Couleurs
```css
Primary: #0ea5e9 (blue-500)
Secondary: #14b8a6 (teal-500)  
Accent: #ef4444 (red-500)
Success: #22c55e (green-500)
Warning: #f59e0b (yellow-500)
```

### Composants UI
- **Cards** : Conteneurs avec ombres subtiles
- **Buttons** : 3 variantes (primary, secondary, accent)
- **Animations** : Micro-interactions avec Framer Motion
- **Layout responsive** : Mobile-first avec breakpoints

## 🎤 Fonctionnalités principales

### Text-to-Speech (TTS)
- Utilise l'API `speechSynthesis` native
- Sélection automatique de voix française
- Contrôles play/pause/stop
- Synchronisation avec surlignage du texte

### Enregistrement audio
- MediaRecorder API pour capture audio
- Formats supportés : WebM, OGG, WAV
- Visualisation temps réel
- Upload automatique vers l'API

### Scoring et feedback
- Affichage temps réel des scores WER/WPM  
- Messages de feedback personnalisés selon l'âge
- Conseils d'amélioration contextuels
- Historique des performances

### Interface adaptative
- Responsive design mobile/tablet/desktop
- Thème enfant avec couleurs apaisantes
- Animations fluides et engageantes
- Accessibilité clavier et screen readers

## 🚀 Installation et développement

```bash
cd frontend
npm install
npm run dev  # Serveur dev sur port 5173
```

## 🧪 Tests

```bash
npm run test     # Tests unitaires avec Vitest
npm run test:ui  # Interface graphique de test
```

## 🏗 Build et déploiement

```bash
npm run build    # Build pour production dans /dist
npm run preview  # Preview du build local
```

## 📱 Responsive breakpoints

```css
Mobile:  < 768px
Tablet:  768px - 1024px  
Desktop: > 1024px
```

## 🎯 Optimisations

### Performance
- Code splitting par routes
- Images lazy loading  
- Memoization des composants coûteux
- Bundle analysis avec Vite

### UX/UI
- Loading states sur toutes les actions async
- Error boundaries pour robustesse
- Feedback utilisateur immédiat
- Navigation intuitive

### Accessibilité
- Contraste suffisant pour lecture
- Navigation clavier complète
- Alt text sur toutes les images
- ARIA labels appropriés

## 🔧 Configuration

### Variables d'environnement
```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=Poems Read-Aloud
VITE_DEBUG=false
```

### Proxy de développement
Le serveur Vite proxy automatiquement `/api/*` vers le backend local.

## 📦 Scripts disponibles

- `dev` - Serveur de développement avec HMR
- `build` - Build de production optimisé
- `preview` - Test du build en local
- `test` - Tests unitaires
- `lint` - Linting ESLint

## 🐛 Debugging

### DevTools React
Utiliser React DevTools pour :
- Inspection des composants
- Profiling des performances  
- Debug des hooks

### Console logs
En mode debug (`VITE_DEBUG=true`) :
- Logs détaillés des API calls
- États des composants
- Erreurs de transcription/scoring

## 🔄 Workflow de développement

1. **Développement local** : `npm run dev`
2. **Tests unitaires** : `npm run test` 
3. **Build de test** : `npm run build && npm run preview`
4. **Déploiement** : Build automatique via CI/CD

## 📊 Monitoring et analytics

### Performance
- Web Vitals tracking
- Bundle size monitoring
- Error tracking (Sentry ready)

### Usage  
- Events de navigation
- Taux d'enregistrement
- Durée des sessions

## 🎓 Bonnes pratiques

### Code
- Composants fonctionnels + hooks
- PropTypes ou TypeScript pour le typing
- ESLint + Prettier pour le style
- Git hooks pre-commit

### State Management
- Context API pour état global
- useState/useReducer pour état local  
- Custom hooks pour logique réutilisable

### Performance
- React.memo pour composants purs
- useMemo/useCallback quand nécessaire
- Code splitting des routes

---

📝 **Note** : Cette documentation évolue avec les nouvelles fonctionnalités.

🚀 **Contribution** : Suivez les conventions React et les guides de style établis.

🎯 **Focus** : Expérience utilisateur fluide et accessible pour les enfants.