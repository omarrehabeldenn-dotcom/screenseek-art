import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Movie } from "@/lib/cineverse";

export function MovieCard({ movie, index = 0 }: { movie: Movie; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4), ease: "easeOut" }}
      whileHover={{ y: -8 }}
    >
      <Link
        to="/movie/$id"
        params={{ id: movie.id }}
        className="group block overflow-hidden rounded-2xl border border-border bg-card poster-shadow transition-colors hover:border-primary/60"
      >
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
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-xs font-semibold text-primary">
            <Star className="size-3 fill-current" />
            {movie.rating}
          </span>
        </div>
        <div className="space-y-1 p-4">
          <h3 className="truncate text-2xl leading-none">{movie.title}</h3>
          <p className="text-xs text-muted-foreground">
            {movie.genre} · {movie.year}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
