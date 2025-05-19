import React from "react";

interface UserModel {
  userId: number,
  employeeId: number,
  employeeName: string,
  email: string,
  token: string,
  refreshToken: string
}

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  // getUser: () => UserModel;
  // setUser: (user: UserModel) => void;
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
    typeof window !== 'undefined' ? !!localStorage.getItem(import.meta.env.VITE_ENCRYPTED_USER_KEY) : false
  );

  // const getUser = () => {
  //   const userLocalStorage = localStorage.getItem(import.meta.env.VITE_ENCRYPTED_USER_KEY);
  //   if (userLocalStorage) {
  //     return JSON.parse(decryptString(userLocalStorage));
  //   }
  //   return null;
  // };

  // const setUser = (user: UserModel) => {
  //   const encryptedUser = encryptString(JSON.stringify(user));
  //   localStorage.setItem(
  //     import.meta.env.VITE_ENCRYPTED_USER_KEY,
  //     encryptedUser
  //   );
  // }

  const logout = () => {
    if (window) {
      localStorage.removeItem(import.meta.env.VITE_ENCRYPTED_USER_KEY);
      setIsAuthenticated(false);
    }
  };

  const onChangeAuthenticate = React.useCallback((value: any) => {
    if (window) {
      if (value) {
        setIsAuthenticated(value);
        // setUser(value);
      }
      else if(!value){
        localStorage.removeItem(import.meta.env.VITE_ENCRYPTED_USER_KEY);
        setIsAuthenticated(false);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        // setUser,
        logout,
        // getUser,
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