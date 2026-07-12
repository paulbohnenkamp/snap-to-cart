create table app_user (
  id uuid primary key, name varchar(120) not null, email varchar(320) not null unique,
  password_hash varchar(100) not null, created_at timestamptz not null
);
create table refresh_session (
  id uuid primary key, user_id uuid not null references app_user(id) on delete cascade,
  token_hash varchar(64) not null unique, expires_at timestamptz not null, revoked_at timestamptz
);
create table grocery_scan (
  id uuid primary key, user_id uuid not null references app_user(id) on delete cascade,
  summary varchar(500) not null, demo_mode boolean not null, created_at timestamptz not null
);
create table recognized_product (
  id uuid primary key, scan_id uuid not null references grocery_scan(id) on delete cascade,
  brand varchar(180), name varchar(250) not null, variant varchar(180), size varchar(80),
  confidence double precision not null, upc varchar(32), price numeric(10,2)
);
create table kroger_connection (
  id uuid primary key, user_id uuid not null unique references app_user(id) on delete cascade,
  access_token text not null, refresh_token text, expires_at timestamptz not null, created_at timestamptz not null
);
