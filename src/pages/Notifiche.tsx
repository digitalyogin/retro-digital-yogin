import { useState, useEffect } from "react";
import { ArrowLeft, Bell, BellOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Notifiche = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [alertDaysBefore, setAlertDaysBefore] = useState(7);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("notification_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setNewsletterEnabled(data.newsletter_enabled);
        setAlertsEnabled(data.deadline_alerts_enabled);
        setAlertDaysBefore(data.alert_days_before);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("notification_subscriptions")
        .upsert({
          user_id: user.id,
          newsletter_enabled: newsletterEnabled,
          deadline_alerts_enabled: alertsEnabled,
          alert_days_before: alertDaysBefore,
        }, { onConflict: "user_id" });

      if (error) throw error;
      
      toast({
        title: "Preferenze salvate!",
        description: "Le tue preferenze di notifica sono state aggiornate.",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare le preferenze. Riprova.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/incentivi" 
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-terminal">TORNA_INCENTIVI</span>
            </Link>
            <span className="text-muted-foreground font-terminal text-sm">DIGITAL_YOGIN</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-terminal text-primary mb-4">
            NOTIFICHE
          </h1>
          <p className="text-muted-foreground mb-8">
            Gestisci le tue preferenze di notifica per restare aggiornato sui bandi e le scadenze.
          </p>

          <div className="space-y-6">
            {/* Newsletter */}
            <div className="border-2 border-primary/30 bg-card p-6 rounded-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-terminal text-primary mb-2 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Newsletter Periodica
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Ricevi una email settimanale con i nuovi bandi e le opportunità di finanziamento.
                  </p>
                </div>
                <button
                  onClick={() => setNewsletterEnabled(!newsletterEnabled)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    newsletterEnabled ? "bg-primary" : "bg-muted"
                  } relative`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      newsletterEnabled ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Deadline Alerts */}
            <div className="border-2 border-primary/30 bg-card p-6 rounded-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-terminal text-primary mb-2 flex items-center gap-2">
                    <BellOff className="w-5 h-5" />
                    Alert Scadenze
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Ricevi notifiche prima della scadenza dei bandi che hai salvato nei preferiti.
                  </p>
                </div>
                <button
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    alertsEnabled ? "bg-primary" : "bg-muted"
                  } relative`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      alertsEnabled ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {alertsEnabled && (
                <div className="mt-4 pt-4 border-t border-primary/20">
                  <label className="block text-sm text-muted-foreground mb-2">
                    Notificami con anticipo di:
                  </label>
                  <select
                    value={alertDaysBefore}
                    onChange={(e) => setAlertDaysBefore(Number(e.target.value))}
                    className="w-full bg-background border border-primary/30 text-foreground px-4 py-3 focus:outline-none focus:border-primary"
                  >
                    <option value={3}>3 giorni</option>
                    <option value={7}>7 giorni</option>
                    <option value={14}>14 giorni</option>
                    <option value={30}>30 giorni</option>
                  </select>
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={savePreferences}
              disabled={saving}
              className="w-full border-2 border-primary bg-primary/20 py-4 text-primary hover:bg-primary/30 transition-colors font-terminal disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "SALVA_PREFERENZE"
              )}
            </button>

            {/* Info */}
            <div className="text-center text-muted-foreground text-sm">
              <p>Le email verranno inviate all'indirizzo: <span className="text-primary">{user?.email}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifiche;
