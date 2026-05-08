"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Use this one!
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize your supabase client
  const supabase = createClient();

  useEffect(() => {
    // 1. Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session);
      setLoading(false);
    };

    getInitialSession();

    // 2. Listen for changes (sign in, sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session: user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);