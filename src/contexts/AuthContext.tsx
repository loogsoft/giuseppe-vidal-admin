import { useCallback, useEffect, useState } from "react";
import { UserService } from "../service/User.service";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name?: string; email?: string } | null>(null);

  const fetchUser = useCallback(async () => {
    const me = await UserService.getMe();
    let profile = { id: me.id, email: me.email };
    try {
      const full = await UserService.findOne(me.id);
      profile = {
        id: full.id ?? me.id,
        name: full.name ?? undefined,
        email: full.email ?? me.email,
      };
    } catch {
      // Fallback to the /users/me payload
    }
    setUser(profile);
  }, []);

  useEffect(() => {
    async function validateToken() {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        await fetchUser();
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    validateToken();
  }, []);

  function login(token: string) {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    void fetchUser();
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}