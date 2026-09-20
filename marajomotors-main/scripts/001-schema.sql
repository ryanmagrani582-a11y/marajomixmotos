-- =============================================================================
-- Marajó Motors — Schema do Supabase
-- =============================================================================
-- Execute este script no SQL Editor do seu projeto Supabase
-- (https://supabase.com/dashboard/project/_/sql/new).
--
-- Cria todas as tabelas usadas pelo site e pelo painel /admin:
--   categories, products, product_images, product_specs, leads, banners,
--   site_settings.
--
-- Espelha 1:1 os tipos definidos em lib/types.ts.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- categories
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  image text,
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.categories is 'Categorias de produtos exibidas no menu e na home (Motos, Náutica, etc.)';

-- -----------------------------------------------------------------------------
-- products
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text not null,
  category_slug text not null references public.categories(slug) on update cascade,
  short_description text not null default '',
  description text not null default '',
  price numeric(12, 2),
  promo_price numeric(12, 2),
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_slug_idx on public.products (category_slug);
create index if not exists products_featured_idx on public.products (featured) where featured = true;
create index if not exists products_active_idx on public.products (active) where active = true;

comment on table public.products is 'Veículos e produtos do catálogo (motos, náutica, quadriciclos, triciclos, scooters, bikes elétricas)';

-- -----------------------------------------------------------------------------
-- product_images (galeria de fotos de cada produto)
-- -----------------------------------------------------------------------------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  "order" integer not null default 0,
  is_primary boolean not null default false
);

create index if not exists product_images_product_id_idx on public.product_images (product_id);

-- -----------------------------------------------------------------------------
-- product_specs (ficha técnica de cada produto)
-- -----------------------------------------------------------------------------
create table if not exists public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  value text not null,
  "order" integer not null default 0
);

create index if not exists product_specs_product_id_idx on public.product_specs (product_id);

-- -----------------------------------------------------------------------------
-- leads (contatos gerados pelo site: formulário e WhatsApp)
-- -----------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  email text,
  product_id uuid references public.products(id) on delete set null,
  product_name text,
  message text not null default '',
  status text not null default 'novo'
    check (status in ('novo', 'em_atendimento', 'convertido', 'arquivado')),
  created_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- -----------------------------------------------------------------------------
-- banners (banners do hero / topo das páginas)
-- -----------------------------------------------------------------------------
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  image_desktop text,
  image_mobile text,
  cta_label text,
  cta_link text,
  active boolean not null default true,
  "order" integer not null default 0
);

-- -----------------------------------------------------------------------------
-- site_settings (dados institucionais — linha única, id = 1)
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id integer primary key default 1,
  company_name text not null default '',
  whatsapp text,
  instagram text,
  phone text,
  address text,
  email text,
  institutional_text text not null default '',
  whatsapp_message_template text not null default '',
  constraint site_settings_singleton check (id = 1)
);

-- -----------------------------------------------------------------------------
-- Trigger genérico para manter updated_at em dia
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.categories;
create trigger set_updated_at
  before update on public.categories
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.products;
create trigger set_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================
-- Hoje o painel /admin ainda não tem autenticação própria conectada ao
-- Supabase, então as policies abaixo liberam apenas LEITURA pública dos
-- dados ativos (o necessário para o site funcionar com a anon key) e
-- INSERT público em leads (formulário de contato). Qualquer escrita em
-- categories/products/banners/site_settings deve ser feita pelo SQL Editor
-- (com a sua conta, que tem acesso total) até que o /admin tenha login.
-- =============================================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_specs enable row level security;
alter table public.banners enable row level security;
alter table public.site_settings enable row level security;
alter table public.leads enable row level security;

create policy "categories_public_read" on public.categories
  for select using (active = true);

create policy "products_public_read" on public.products
  for select using (active = true);

create policy "product_images_public_read" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.active = true
    )
  );

create policy "product_specs_public_read" on public.product_specs
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_specs.product_id and p.active = true
    )
  );

create policy "banners_public_read" on public.banners
  for select using (active = true);

create policy "site_settings_public_read" on public.site_settings
  for select using (true);

-- O formulário de contato do site precisa inserir leads com a anon key.
create policy "leads_public_insert" on public.leads
  for insert with check (true);
