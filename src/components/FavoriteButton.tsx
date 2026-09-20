import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { addFavorite, fetchFavoriteIds, removeFavorite } from "@/lib/cineverse";

export function FavoriteButton({ movieId }: { movieId: string }) {
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: favoriteIds } = useQuery({
    queryKey: ["favorite-ids", user?.id],
    queryFn: fetchFavoriteIds,
    enabled: Boolean(user),
  });

  const isFavorite = Boolean(favoriteIds?.includes(movieId));

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (isFavorite) await removeFavorite(movieId);
      else await addFavorite(movieId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-ids", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    },
    onError: () => toast.error("Could not update your favorites"),
  });

  return (
    <motion.div whileTap={{ scale: 0.94 }} className="inline-block">
      <Button
        variant={isFavorite ? "secondary" : "outline"}
        size="lg"
        disabled={mutation.isPending}
        onClick={() => {
          if (!user) {
            toast.info("Sign in to save favorites");
            navigate({ to: "/auth" });
            return;
          }
          mutation.mutate();
        }}
        className="rounded-full"
      >
        <motion.span
          key={String(isFavorite)}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 14 }}
          className="inline-flex"
        >
          <Heart className={isFavorite ? "size-4 fill-primary text-primary" : "size-4"} />
        </motion.span>
        {isFavorite ? "In favorites" : "Add to favorites"}
      </Button>
    </motion.div>
  );
}
