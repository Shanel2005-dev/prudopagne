-- Prudo Pagne — schéma de base de données Supabase
-- À exécuter dans Supabase : Dashboard > SQL Editor > New query

-- 1. Catégories (Pagne, Bazin, Guipure/Dentelle, Autre, ...)
create table categories (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique,
  created_at timestamptz not null default now()
);

-- 2. Produits
create table products (
  id uuid primary key default gen_random_uuid(),
  reference text,
  designation text not null,
  prix numeric(10, 0) not null check (prix >= 0),
  statut text not null default 'disponible' check (statut in ('disponible', 'vendu')),
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 3. Photos d'un produit (une par couleur/angle)
create table product_photos (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  position int not null default 0
);

create index on products (category_id);
create index on products (statut);
create index on product_photos (product_id);

-- Sécurité (RLS) : lecture publique, écriture réservée aux comptes connectés (l'admin)
alter table categories enable row level security;
alter table products enable row level security;
alter table product_photos enable row level security;

create policy "Lecture publique des catégories" on categories for select using (true);
create policy "Lecture publique des produits" on products for select using (true);
create policy "Lecture publique des photos" on product_photos for select using (true);

create policy "Admin gère les catégories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin gère les produits" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin gère les photos" on product_photos for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Catégories de départ
insert into categories (nom) values ('Wax'), ('Bazin'), ('Guipure'), ('Dentelle'), ('Tissus');
