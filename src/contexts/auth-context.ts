import { createContext } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext({} as AuthContextType);

export type { AuthContextType };
export { AuthContext };
