import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { fetchFavoriteMovies, removeFavorite } from "@/lib/cineverse";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "My favorites — CineVerse" },
      { name: "description", content: "The films you saved to your CineVerse favorites list." },
      { property: "og:title", content: "My favorites — CineVerse" },
      {
        property: "og:description",
        content: "The films you saved to your CineVerse favorites list.",
      },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user, loading } = useSession();
  const queryClient = useQueryClient();

  const { data: movies, isPending } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: fetchFavoriteMovies,
    enabled: Boolean(user),
  });

  const remove = useMutation({
    mutationFn: (movieId: string) => removeFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["favorite-ids", user?.id] });
      toast.success("Removed from favorites");
    },
    onError: () => toast.error("Could not remove that film"),
  });

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-24 text-muted-foreground">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-28 text-center">
        <h1 className="text-4xl">Your favorites</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in to keep a list of the films you love.
        </p>
        <Button asChild size="lg" className="mt-6 rounded-full">
          <Link to="/auth">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl">Your favorites</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {movies?.length ?? 0} film{(movies?.length ?? 0) === 1 ? "" : "s"} saved
      </p>

      {isPending ? (
        <p className="mt-10 text-muted-foreground">Loading…</p>
      ) : (movies?.length ?? 0) === 0 ? (
        <div className="mt-12 rounded-3xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">Nothing saved yet.</p>
          <Button asChild className="mt-5 rounded-full">
            <Link to="/">Browse movies</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {movies!.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card poster-shadow"
              >
                <Link to="/movie/$id" params={{ id: movie.id }} className="block">
                  <div className="relative aspect-2/3 overflow-hidden">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      loading="lazy"
                      width={768}
                      height={1152}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 hero-scrim opacity-70" />
                  </div>
                  <div className="space-y-1 p-4">
                    <h3 className="truncate text-2xl leading-none">{movie.title}</h3>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 text-primary">
                        <Star className="size-3 fill-current" />
                        {movie.rating}
                      </span>
                      {movie.genre} · {movie.year}
                    </p>
                  </div>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => remove.mutate(movie.id)}
                  aria-label={`Remove ${movie.title} from favorites`}
                  className="absolute top-3 right-3 rounded-full bg-background/80 p-2 text-foreground transition-colors hover:text-destructive"
                >
                  <X className="size-4" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
