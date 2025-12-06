-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.children (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender = ANY (ARRAY['male'::text, 'female'::text, 'Laki-laki'::text, 'Perempuan'::text])),
  birth_weight numeric,
  birth_height numeric,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT children_pkey PRIMARY KEY (id),
  CONSTRAINT children_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.food_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  child_id uuid NOT NULL,
  name text NOT NULL,
  calories numeric NOT NULL,
  protein numeric,
  fats numeric,
  carbs numeric,
  eaten_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT food_logs_pkey PRIMARY KEY (id),
  CONSTRAINT food_logs_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id)
);
CREATE TABLE public.growth_records (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  child_id uuid NOT NULL,
  recorded_date date NOT NULL DEFAULT CURRENT_DATE,
  age_in_months numeric,
  height numeric NOT NULL,
  weight numeric NOT NULL,
  head_circumference numeric,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  zScore real DEFAULT '0'::real,
  CONSTRAINT growth_records_pkey PRIMARY KEY (id),
  CONSTRAINT growth_records_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id)
);
CREATE TABLE public.makanan_pokok (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nama_makanan text,
  "porsi(g)" numeric,
  "kalori(kkal)" numeric,
  "karbonhidrat(g)" numeric,
  "protein(g)" numeric,
  "lemak(g)" numeric,
  "serat(g)" numeric,
  "vitamin_A(IU)" numeric,
  "vitamin_B(mg)" numeric,
  "vitamin_C(mg)" numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT makanan_pokok_pkey PRIMARY KEY (id)
);
CREATE TABLE public.recommended_menus (
  id_makanan uuid NOT NULL DEFAULT uuid_generate_v4(),
  makanan text NOT NULL,
  porsi_g numeric NOT NULL,
  kalori_kkal numeric,
  karbonhidrat_g numeric,
  protein_g numeric,
  lemak_g numeric,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  vitamin_a_IU numeric,
  vitamin_b_mg numeric,
  vitamin_c_mg numeric
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
