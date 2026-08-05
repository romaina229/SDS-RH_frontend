# SDS-RH — Frontend

Interface React professionnelle pour SDS-RH.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- React Query
- React Hook Form
- Axios

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Pour une build de production :

```bash
npm run build
npm run preview
```

`VITE_API_URL` doit pointer vers l'API Laravel, par exemple `https://api.example.com/api`.

## Architecture

- `src/api` : appels HTTP
- `src/context` : authentification et contexte global
- `src/components` : composants réutilisables
- `src/pages` : écrans métier
- `src/routes` : navigation et protection des routes

Le frontend utilise un token Sanctum Bearer. Le tenant est résolu côté serveur à partir de l'utilisateur authentifié ; l'en-tête `X-Tenant-Id` n'est pas une source d'autorité pour les utilisateurs standards.
