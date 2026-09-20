import { supabase } from "@/integrations/supabase/client";

export type Movie = {
  id: string;
  title: string;
  description: string;
  poster: string;
  genre: string;
  year: number;
  rating: number;
  trailer_url: string;
  featured: boolean;
};

export async function fetchMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("movies")
    .select("id,title,description,poster,genre,year,rating,trailer_url,featured")
    .order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Movie[];
}

export async function fetchMovie(id: string): Promise<Movie> {
  const { data, error } = await supabase
    .from("movies")
    .select("id,title,description,poster,genre,year,rating,trailer_url,featured")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Movie not found");
  return data as Movie;
}

export async function fetchFavoriteIds(): Promise<string[]> {
  const { data, error } = await supabase.from("favorites").select("movie_id");
  if (error) throw error;
  return (data ?? []).map((row) => row.movie_id as string);
}

export async function fetchFavoriteMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select(
      "movie_id, movies(id,title,description,poster,genre,year,rating,trailer_url,featured)",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? [])
    .map((row) => (row as { movies: Movie | null }).movies)
    .filter((movie): movie is Movie => Boolean(movie));
}

export async function addFavorite(movieId: string, userId: string) {
  const { error } = await supabase
    .from("favorites")
    .insert({ movie_id: movieId, user_id: userId });
  if (error) throw error;
}

export async function removeFavorite(movieId: string) {
  const { error } = await supabase.from("favorites").delete().eq("movie_id", movieId);
  if (error) throw error;
}
