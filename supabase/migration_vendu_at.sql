-- Prudo Pagne — ajoute la date de vente (pour l'historique et les graphiques du dashboard)
alter table products add column vendu_at timestamptz;
