# LR React TS Template

```powershell
npm create vite@latest LR -- --template react-ts
cd LR
npm install
npm install react-router-dom lucide-react clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer
npm run dev
```

Template React + TypeScript + Tailwind CSS pensé pour une application de gestion professionnelle : navigation latérale dynamique, layout responsive, composants de formulaires réutilisables et base d'intégration API typée.

## Démarrage

```powershell
npm install
copy .env.example .env
npm run dev
npm run lint
npm run build
```

Node recommandé : `v24.19.0`. Le serveur Vite démarre généralement sur `http://localhost:5173`.

## Structure

```txt
src/
  components/
    layout/          Sidebar, Header/Layout applicatif
    ui/              Button, Input, Select, Checkbox, Switch, Feedback
  config/
    app.ts           Nom, baseline et futur chemin du logo
    navigation.ts    Déclaration typée des sections et sous-menus
  pages/             Pages routées de démonstration
  routes/
    appRoutes.tsx    Déclaration centralisée des routes publiques et applicatives
  services/
    apiClient.ts     Client fetch typé et format de réponse standard
  types/             Types API, formulaires et navigation
  lib/
    utils.ts         Helpers transverses
```

## Design System

- Typographie unique : `DM Sans`, configurée globalement dans Tailwind.
- Fond principal : off-white `#fbfaf7` pour éviter un blanc agressif.
- Surfaces : blanc pur pour les zones d'action, bordures `slate-100/200`.
- Accent : sky/cyan professionnel (`primary`, `primary-hover`, `primary-subtle`).
- Aucun `linear-gradient`, aucun décor superflu, icônes Lucide uniquement.
- Tailles de texte compactes : `15px` global, titres contenus entre `text-lg` et `text-3xl`.

## Navigation

La sidebar s'appuie sur `src/config/navigation.ts` :

- sections de navigation typées ;
- sous-menus repliables ;
- état actif déduit de `location.pathname` ;
- mode desktop collapsible ;
- drawer mobile avec overlay ;
- états `disabled`, hover, focus et active accessibles.

Par rapport à la référence GitHub, la configuration est plus stricte, la logique active évite les faux positifs, et le responsive mobile est intégré au layout au lieu d'être traité comme un cas à part.

Le futur logo se configure dans `src/config/app.ts`. Placez par exemple `logo.svg` dans `public/`, puis renseignez `logoSrc: "/logo.svg"`.

## Routes

Les routes sont centralisées dans `src/routes/appRoutes.tsx` :

- `/login` utilise une page publique sans sidebar ;
- les routes applicatives sont rendues dans `AppLayout` avec sidebar et header ;
- `App.tsx` reste volontairement minimal avec `useRoutes(appRoutes)`.

## Formulaires

Composants disponibles dans `src/components/ui` :

- `Input`
- `Select`
- `Textarea`
- `Checkbox`
- `Switch`
- `Button`
- `Toast`, `Skeleton`, `EmptyState`, `ConfirmDialog`

Chaque champ gère `label`, `helperText`, `error`, `disabled`, `aria-invalid` et `aria-describedby`.

## Convention API

Toutes les réponses backend doivent suivre :

```json
{
  "success": true,
  "message": "Opération réussie",
  "data": {},
  "errors": null
}
```

Le client `src/services/apiClient.ts` attend ce contrat et lève une `ApiClientError` quand `success` vaut `false` ou que le statut HTTP n'est pas valide.

## Endpoints API recommandés

```txt
GET    /api/health
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PATCH  /api/customers/:id
DELETE /api/customers/:id
```

Codes HTTP à respecter : `200`, `201`, `400`, `401`, `403`, `404`, `500`.

## Backend recommandé

Pour un backend Express, NestJS, Laravel ou Spring Boot, garder une organisation par domaine :

```txt
modules/customers/
  customers.controller
  customers.service
  customers.repository
  dto/
  models/
database/
  migrations/
  seeders/
```

Bonnes pratiques attendues :

- validation stricte des DTO côté serveur ;
- secrets uniquement via `.env` ;
- requêtes paramétrées/ORM pour éviter les injections SQL ;
- échappement/sanitization des contenus affichés pour limiter XSS ;
- middleware global d'erreurs ;
- migrations versionnées et seeders pour les données de test.

## Variables d'environnement

```env
VITE_API_BASE_URL=http://localhost:3000/api
```
