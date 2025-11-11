import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "superadmin" | "admin" | "manager" | "supervisor" | "employee" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface RoleContextType {
  user: User | null;
  role: UserRole;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("sk_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
  }, []);

  const login = async (email: string, password: string, selectedRole: UserRole) => {
    // Simulated login - in production, this would be an API call
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0],
      email,
      role: selectedRole,
    };

    setUser(mockUser);
    setRole(selectedRole);
    localStorage.setItem("sk_user", JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string, selectedRole: UserRole) => {
    // Simulated signup - in production, this would be an API call
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: selectedRole,
    };

    setUser(mockUser);
    setRole(selectedRole);
    localStorage.setItem("sk_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("sk_user");
  };

  return (
    <RoleContext.Provider
      value={{
        user,
        role,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return context;
};
