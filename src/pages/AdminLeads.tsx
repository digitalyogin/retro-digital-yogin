import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Trash2, ExternalLink, Mail, Phone, Calendar, Globe } from "lucide-react";

interface Lead {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  website_url: string;
  scan_result: string;
  score: number | null;
  status: string;
  created_at: string;
}

const AdminLeads = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsAuthenticated(true);
      fetchLeads();
    }
    setIsLoading(false);
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("oracle_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile caricare i lead",
        variant: "destructive",
      });
      return;
    }

    setLeads(data || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (error) {
      toast({
        title: "Errore di login",
        description: error.message,
        variant: "destructive",
      });
      setIsLoggingIn(false);
      return;
    }

    setIsAuthenticated(true);
    fetchLeads();
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setLeads([]);
  };

  const deleteLead = async (id: string) => {
    // Note: This would need a delete policy on the table
    toast({
      title: "Info",
      description: "Eliminazione lead richiede policy RLS aggiuntiva",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md border-2 border-primary bg-card p-8">
          <h1 className="text-2xl font-terminal text-primary mb-6 text-center">
            ADMIN_LOGIN
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full bg-background border border-primary/50 text-foreground px-4 py-3 text-base focus:outline-none focus:border-primary"
                required
                maxLength={255}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full bg-background border border-primary/50 text-foreground px-4 py-3 text-base focus:outline-none focus:border-primary"
                required
                maxLength={128}
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full border-2 border-primary bg-primary/20 py-3 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50 font-terminal text-lg"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "ACCEDI"}
            </button>
          </form>
          <button
            onClick={() => navigate("/")}
            className="w-full mt-4 text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            ← Torna al sito
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-primary/30 pb-4">
          <div>
            <h1 className="text-3xl font-terminal text-primary">ADMIN_DASHBOARD</h1>
            <p className="text-muted-foreground mt-1">Gestione Lead Oracle</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-primary/50 text-primary hover:bg-primary/10 transition-colors"
            >
              Sito
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Esci
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-primary/30 bg-card p-4">
            <p className="text-muted-foreground text-sm">Totale Lead</p>
            <p className="text-3xl font-bold text-primary">{leads.length}</p>
          </div>
          <div className="border border-primary/30 bg-card p-4">
            <p className="text-muted-foreground text-sm">Nuovi</p>
            <p className="text-3xl font-bold text-green-500">
              {leads.filter((l) => l.status === "new").length}
            </p>
          </div>
          <div className="border border-primary/30 bg-card p-4">
            <p className="text-muted-foreground text-sm">Media Score</p>
            <p className="text-3xl font-bold text-yellow-500">
              {leads.filter((l) => l.score).length > 0
                ? Math.round(
                    leads.filter((l) => l.score).reduce((acc, l) => acc + (l.score || 0), 0) /
                      leads.filter((l) => l.score).length
                  )
                : "-"}
            </p>
          </div>
          <div className="border border-primary/30 bg-card p-4">
            <p className="text-muted-foreground text-sm">Questa settimana</p>
            <p className="text-3xl font-bold text-blue-500">
              {leads.filter((l) => {
                const date = new Date(l.created_at);
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return date > weekAgo;
              }).length}
            </p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="border border-primary/30 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/10 border-b border-primary/30">
                <tr>
                  <th className="text-left p-4 text-primary font-terminal">EMAIL</th>
                  <th className="text-left p-4 text-primary font-terminal">NOME</th>
                  <th className="text-left p-4 text-primary font-terminal">SITO</th>
                  <th className="text-left p-4 text-primary font-terminal">SCORE</th>
                  <th className="text-left p-4 text-primary font-terminal">DATA</th>
                  <th className="text-left p-4 text-primary font-terminal">AZIONI</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Nessun lead trovato
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-foreground hover:text-primary transition-colors"
                          >
                            {lead.email}
                          </a>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">{lead.name || "-"}</td>
                      <td className="p-4">
                        <a
                          href={lead.website_url.startsWith("http") ? lead.website_url : `https://${lead.website_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <Globe className="w-4 h-4" />
                          {lead.website_url.replace(/^https?:\/\//, "").slice(0, 25)}
                        </a>
                      </td>
                      <td className="p-4">
                        {lead.score ? (
                          <span
                            className={`px-2 py-1 rounded text-sm font-bold ${
                              lead.score >= 70
                                ? "bg-green-500/20 text-green-500"
                                : lead.score >= 40
                                ? "bg-yellow-500/20 text-yellow-500"
                                : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {lead.score}/100
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-3 py-1 text-sm border border-primary/50 text-primary hover:bg-primary/10 transition-colors"
                        >
                          Dettagli
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-card border-2 border-primary max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-primary/30 flex items-center justify-between">
                <h2 className="text-xl font-terminal text-primary">LEAD_DETAILS</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-muted-foreground hover:text-primary text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      {selectedLead.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Nome</label>
                    <p className="text-foreground">{selectedLead.name || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Telefono</label>
                    <p className="text-foreground flex items-center gap-2">
                      {selectedLead.phone ? (
                        <>
                          <Phone className="w-4 h-4 text-primary" />
                          {selectedLead.phone}
                        </>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Sito Analizzato</label>
                    <a
                      href={selectedLead.website_url.startsWith("http") ? selectedLead.website_url : `https://${selectedLead.website_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {selectedLead.website_url}
                    </a>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Score</label>
                    <p className="text-2xl font-bold text-primary">
                      {selectedLead.score || "-"}/100
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Data</label>
                    <p className="text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {formatDate(selectedLead.created_at)}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Risultato Analisi
                  </label>
                  <div className="bg-background border border-primary/30 p-4 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                      {selectedLead.scan_result}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeads;