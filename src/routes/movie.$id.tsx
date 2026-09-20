import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Star } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Button } from "@/components/ui/button";
import { fetchMovie } from "@/lib/cineverse";

export const Route = createFileRoute("/movie/$id")({
  head: () => ({
    meta: [
      { title: "Movie details — CineVerse" },
      {
        name: "description",
        content: "Poster, rating, genre, release year and trailer for this film on CineVerse.",
      },
      { property: "og:title", content: "Movie details — CineVerse" },
      {
        property: "og:description",
        content: "Poster, rating, genre, release year and trailer for this film on CineVerse.",
      },
    ],
  }),
  component: MovieDetails,
});

function MovieDetails() {
  const { id } = Route.useParams();
  const { data: movie, isPending, isError } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovie(id),
  });

  if (isPending) {
    return <div className="mx-auto max-w-5xl px-4 py-24 text-muted-foreground">Loading…</div>;
  }

  if (isError || !movie) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="text-4xl">Movie not found</h1>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/">Back home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
        <motion.img
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          src={movie.poster}
          alt={movie.title}
          width={768}
          height={1152}
          className="w-full rounded-3xl object-cover poster-shadow"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-5xl leading-none sm:text-6xl">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 text-primary">
                <Star className="size-4 fill-current" /> {movie.rating} / 10
              </span>
              <span className="rounded-full border border-border px-3 py-1">{movie.genre}</span>
              <span>{movie.year}</span>
            </div>
          </div>

          <p className="text-base leading-relaxed text-foreground/80">{movie.description}</p>

          <div className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              <Button asChild size="lg" className="rounded-full accent-glow">
                <a href={movie.trailer_url} target="_blank" rel="noreferrer">
                  <Play className="size-4" /> Watch trailer
                </a>
              </Button>
            </motion.div>
            <FavoriteButton movieId={movie.id} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
