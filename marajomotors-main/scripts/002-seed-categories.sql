-- =============================================================================
-- Marajó Motors — Seed de categorias
-- =============================================================================
-- Estrutura de categorias já usada no menu e na home do site. Execute depois
-- do 001-schema.sql. Seguro rodar mais de uma vez (on conflict faz upsert).
-- =============================================================================

insert into public.categories (slug, name, description, image, "order", active)
values
  ('motos', 'Motos', 'Motos Yamaha para todos os estilos: urbanas, esportivas e de trabalho.', '/images/cat-motos.png', 1, true),
  ('nautica', 'Náutica', 'Jet skis e produtos náuticos Yamaha para aproveitar a água com performance.', '/images/cat-nautica.png', 2, true),
  ('quadriciclos', 'Quadriciclos', 'Quadriciclos para trabalho, esporte e aventura em qualquer terreno.', '/images/cat-quadriciclos.png', 3, true),
  ('triciclos', 'Triciclos de Carga', 'Soluções de mobilidade e transporte de carga para o seu negócio.', '/images/cat-triciclos.png', 4, true),
  ('scooters', 'Scooters', 'Praticidade e economia para o dia a dia na cidade.', '/images/cat-scooters.png', 5, true),
  ('bikes-eletricas', 'Bikes Elétricas', 'Mobilidade elétrica, sustentável e cheia de estilo.', '/images/cat-bikes.png', 6, true),
  ('consorcio', 'Consórcio', 'Planeje hoje a conquista do seu próximo produto Marajó Motors.', '/images/cat-consorcio.png', 7, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image = excluded.image,
  "order" = excluded."order",
  active = excluded.active;
