import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_favorite_incentives")
        .select("incentive_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setFavorites(data?.map(f => f.incentive_id) || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (incentiveId: string, incentiveTitle: string) => {
    if (!user) {
      toast({
        title: "Accedi per salvare",
        description: "Devi accedere per salvare i tuoi incentivi preferiti.",
        variant: "destructive",
      });
      return false;
    }

    const isFavorite = favorites.includes(incentiveId);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("user_favorite_incentives")
          .delete()
          .eq("user_id", user.id)
          .eq("incentive_id", incentiveId);

        if (error) throw error;
        setFavorites(prev => prev.filter(id => id !== incentiveId));
        toast({
          title: "Rimosso dai preferiti",
          description: `${incentiveTitle} rimosso dai preferiti.`,
        });
      } else {
        const { error } = await supabase
          .from("user_favorite_incentives")
          .insert({ user_id: user.id, incentive_id: incentiveId });

        if (error) throw error;
        setFavorites(prev => [...prev, incentiveId]);
        toast({
          title: "Aggiunto ai preferiti!",
          description: `${incentiveTitle} salvato nei preferiti.`,
        });
      }
      return true;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare il preferito. Riprova.",
        variant: "destructive",
      });
      return false;
    }
  };

  const isFavorite = (incentiveId: string) => favorites.includes(incentiveId);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
  };
};
