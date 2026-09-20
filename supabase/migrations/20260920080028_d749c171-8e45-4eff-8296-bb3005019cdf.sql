CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  poster TEXT NOT NULL,
  genre TEXT NOT NULL,
  year INT NOT NULL,
  rating NUMERIC(3,1) NOT NULL DEFAULT 0,
  trailer_url TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.movies TO anon;
GRANT SELECT ON public.movies TO authenticated;
GRANT ALL ON public.movies TO service_role;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "movies are public" ON public.movies FOR SELECT USING (true);

CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES public.movies ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, movie_id)
);
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own favorites select" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own favorites insert" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own favorites delete" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

INSERT INTO public.movies (title, description, poster, genre, year, rating, trailer_url, featured) VALUES
('Orbit of Embers', 'A stranded astronomer drifts toward a dying star and discovers the nebula is answering her signals.', '/posters/nebula.jpg', 'Sci-Fi', 2025, 8.7, 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', true),
('Neon Rain', 'A burnt-out detective works one last case through the flooded neon canyons of a city that never sleeps.', '/posters/neon-rain.jpg', 'Neo-Noir', 2024, 8.2, 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', false),
('The Ascent', 'Two climbers chase an impossible summit under a moon that will not set.', '/posters/ascent.jpg', 'Adventure', 2023, 7.9, 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', false),
('The Last Diner', 'On the final night of a desert highway diner, every customer carries an unfinished story.', '/posters/last-diner.jpg', 'Drama', 2024, 8.4, 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', false),
('Silent Signal', 'A radio operator in an abandoned research station begins receiving her own voice from tomorrow.', '/posters/silent-signal.jpg', 'Thriller', 2025, 8.0, 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', false),
('Gilded Hours', 'A pianist and a forger fall in love across one long, golden summer in a crumbling city.', '/posters/gilded-hours.jpg', 'Romance', 2022, 7.6, 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', false);