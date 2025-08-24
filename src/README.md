# Architecture du Projet React Quiz

## Structure des Dossiers

```


src/
├── assets/             # Images, icônes, polices
│   └── logo.svg
├── components/         # Composants UI réutilisables (vide pour l'instant)
├── containers/         # Sections visuelles complètes (vide pour l'instant)
├── features/           # Fonctionnalités par domaine
│   ├── Auth/          # Fonctionnalités d'authentification
│   │   ├── components/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── hooks/     # Hooks spécifiques à l'auth (vide pour l'instant)
│   │   └── AuthContext.js
│   └── Quiz/          # Fonctionnalités de quiz
│       ├── components/
│       │   ├── QuizPage.jsx
│       │   └── DashboardPage.jsx
│       └── hooks/     # Hooks spécifiques aux quiz (vide pour l'instant)
├── hooks/              # Hooks personnalisés globaux (vide pour l'instant)
├── layouts/            # Layouts globaux avec Header/Footer
│   ├── App.js
│   └── App.test.js
├── pages/              # Pages correspondant aux routes
│   └── HomePage.jsx
├── router/             # Configuration du router
│   └── PrivateRoute.js
├── services/           # Appels API (vide pour l'instant)
├── store/              # Redux store et slices (vide pour l'instant)
├── styles/             # Fichiers globaux et Tailwind
│   ├── index.css
│   └── App.css
├── utils/              # Fonctions utilitaires
│   ├── setupTests.js
│   └── reportWebVitals.js
└── index.js            # Entrée principale
```

## Organisation par Features

### Feature Auth
- **AuthContext.js** : Contexte d'authentification global
- **components/LoginPage.jsx** : Page de connexion
- **components/RegisterPage.jsx** : Page d'inscription
- **hooks/** : Hooks spécifiques à l'authentification (à développer)

### Feature Quiz
- **components/QuizPage.jsx** : Page de quiz interactif
- **components/DashboardPage.jsx** : Tableau de bord utilisateur
- **hooks/** : Hooks spécifiques aux quiz (à développer)

## Avantages de cette Architecture

1. **Séparation des préoccupations** : Chaque feature est isolée
2. **Réutilisabilité** : Composants organisés par domaine
3. **Maintenabilité** : Structure claire et prévisible
4. **Évolutivité** : Facile d'ajouter de nouvelles features
5. **Testabilité** : Organisation facilitant les tests unitaires

## Prochaines Étapes

1. **Créer des hooks personnalisés** dans `features/Auth/hooks/` et `features/Quiz/hooks/`
2. **Extraire des composants réutilisables** dans `components/`
3. **Créer des services API** dans `services/`
4. **Implémenter un store global** dans `store/` si nécessaire
5. **Ajouter des containers** dans `containers/` pour les sections complexes 
