import { createContext, useContext } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
