create schema if not exists private;

revoke all on schema private from public;

create table public.submissions (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  is_christian boolean not null,
  origin text not null,
  conference_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submissions_name_length_check
    check (char_length(btrim(name)) between 2 and 120),
  constraint submissions_phone_format_check
    check (phone ~ '^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$'),
  constraint submissions_origin_check
    check (origin in ('conference', 'participation', 'manual')),
  constraint submissions_conference_source_check
    check (
      (origin = 'conference' and conference_slug is not null)
      or (origin <> 'conference' and conference_slug is null)
    )
);

create index submissions_created_at_idx
  on public.submissions (created_at desc);

create index submissions_origin_conference_idx
  on public.submissions (origin, conference_slug, id desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger submissions_set_updated_at
before update on public.submissions
for each row execute function private.set_updated_at();

alter table public.submissions enable row level security;
alter table public.submissions force row level security;

revoke all on table public.submissions from anon, authenticated;
revoke all on sequence public.submissions_id_seq from anon, authenticated;

grant all on table public.submissions to service_role;
grant usage, select on sequence public.submissions_id_seq to service_role;

comment on table public.submissions is
  'Cadastros enviados pela experiência Fire e pelo painel administrativo.';
