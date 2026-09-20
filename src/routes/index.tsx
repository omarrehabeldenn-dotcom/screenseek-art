import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchMovies, type Movie } from "@/lib/cineverse";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CineVerse — Trending films, beautifully browsed" },
      {
        name: "description",
        content:
          "Browse trending movies, open a film for its trailer and details, and build your own favorites list.",
      },
      { property: "og:title", content: "CineVerse — Trending films, beautifully browsed" },
      {
        property: "og:description",
        content: "Browse trending movies, watch trailers, and build your own favorites list.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");
  const { data: movies, isPending } = useQuery({ queryKey: ["movies"], queryFn: fetchMovies });

  const featured: Movie | undefined = useMemo(
    () => movies?.find((m) => m.featured) ?? movies?.[0],
    [movies],
  );

  const trending = useMemo(() => {
    const list = movies ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (m) => m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q),
    );
  }, [movies, query]);

  return (
    <div>
      <section className="relative min-h-[78vh] overflow-hidden">
        {featured ? (
          <>
            <motion.img
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src={featured.poster}
              alt={featured.title}
              width={768}
              height={1152}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 hero-scrim" />
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end gap-5 px-4 pb-14"
            >
              <span className="w-fit rounded-full border border-primary/40 px-3 py-1 text-xs tracking-widest text-primary uppercase">
                Featured tonight
              </span>
              <h1 className="max-w-3xl text-5xl leading-[0.95] sm:text-7xl">{featured.title}</h1>
              <p className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 text-primary">
                  <Star className="size-4 fill-current" /> {featured.rating}
                </span>
                <span>{featured.genre}</span>
                <span>{featured.year}</span>
              </p>
              <p className="max-w-xl text-base text-foreground/80">{featured.description}</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full accent-glow">
                  <Link to="/movie/$id" params={{ id: featured.id }}>
                    <Play className="size-4" /> View details
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/favorites">My favorites</Link>
                </Button>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="flex min-h-[78vh] items-center justify-center text-muted-foreground">
            {isPending ? "Loading tonight's selection…" : "No movies yet"}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl">Trending now</h2>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies or genres"
              className="rounded-full bg-card pl-9"
            />
          </div>
        </div>

        {isPending ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-2/3 animate-pulse rounded-2xl bg-card" />
            ))}
          </div>
        ) : trending.length === 0 ? (
          <p className="text-muted-foreground">No movies match “{query}”.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {trending.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
