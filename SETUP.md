# Mise en route — Prudo Pagne

## 1. Créer le projet Supabase (base de données + photos + connexion admin)

1. Va sur https://supabase.com et crée un compte gratuit (avec l'email de ta sœur idéalement, c'est son site).
2. Clique sur **New project**, choisis un nom (ex: `prudo-pagne`) et un mot de passe de base de données (à garder de côté).
3. Une fois le projet créé, ouvre **SQL Editor** dans le menu de gauche.
4. Colle le contenu de `supabase/schema.sql` et clique sur **Run**.
5. Fais pareil avec `supabase/storage.sql` (dans une nouvelle requête).
6. Va dans **Authentication > Users**, clique sur **Add user** et crée le compte de ta sœur (email + mot de passe) — c'est ce compte qui donnera accès à l'espace admin du site.
7. Va dans **Project Settings > API**. Note :
   - **Project URL**
   - **anon public key**

## 2. Connecter le site à Supabase

Crée un fichier `.env` à la racine du projet (copie de `.env.example`) avec ces deux valeurs :

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx...
```

## 3. Lancer le site en local

```
npm install
npm run dev
```

## 4. Déployer sur Vercel

1. Pousse le projet sur GitHub (comme les autres projets).
2. Sur https://vercel.com, importe le dépôt GitHub.
3. Dans les réglages du projet Vercel, ajoute les mêmes variables d'environnement (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Déploie — le site est en ligne 24h/24.
