import React from "react";

export interface UserModel {
  id: number,
  name: string,
  email: string,
  token: string,
  role_id: number,
  role_name: string,
  permissions?: string[],
}

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  getUser: () => UserModel;
  setUser: (user: UserModel) => void;
  onChangeAuthenticate: (value: any) => void;
}
interface AuthProviderProps {
  children: React.ReactNode;
}


const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    typeof window !== 'undefined' ? !!localStorage.getItem("user-eis-fe") : false
  );

  const getUser = () => {
    const userLocalStorage = localStorage.getItem("user-eis-fe");
    if (userLocalStorage) {
      return JSON.parse(userLocalStorage);
    }
    return null;
  };

  const setUser = (user: UserModel) => {
    localStorage.setItem(
      "user-eis-fe",
      JSON.stringify(user)
    );
  }

  const logout = () => {
    if (window) {
      localStorage.removeItem("user-eis-fe");
      setIsAuthenticated(false);
    }
  };

  const onChangeAuthenticate = React.useCallback((value: any) => {
    if (window) {
      if (value) {
        setIsAuthenticated(value);
        setUser(value);
      }
      else if(!value){
        localStorage.removeItem("user-eis-fe");
        setIsAuthenticated(false);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setUser,
        logout,
        getUser,
        onChangeAuthenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};