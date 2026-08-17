import React, { createContext, useContext, useEffect, useState } from "react";
import { Config } from "../constants/Config";

interface AuthContextType {
   loggedIn: boolean;
   username: string;
   setLoggedIn: (value: boolean) => void;
   setUsername: (value: string) => void;
   checkLoginStatus: () => Promise<void>;
   logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   const [loggedIn, setLoggedIn] = useState(false);
   const [username, setUsername] = useState("");

   const checkLoginStatus = async () => {
      try {
         const res = await fetch(`${Config.BACKEND_URL}/user/logged-in`, {
            credentials: "include",
         });
         const data = await res.json();
         setLoggedIn(data.logged_in);

         if (data.logged_in) {
            const userRes = await fetch(`${Config.BACKEND_URL}/user/username`, {
               credentials: "include",
            });
            const userData = await userRes.json();
            if (userData.username) {
               setUsername(userData.username);
            }
         }
      } catch (error) {
         console.error("Failed to check login status:", error);
         setLoggedIn(false);
      }
   };

   const logout = async () => {
      try {
         await fetch(`${Config.BACKEND_URL}/steam/logout`, {
            method: "GET",
            credentials: "include",
         });
         setLoggedIn(false);
         setUsername("");
      } catch (error) {
         console.error("Logout failed:", error);
         throw error;
      }
   };

   useEffect(() => {
      checkLoginStatus();
   }, []);

   return (
      <AuthContext.Provider
         value={{
            loggedIn,
            username,
            setLoggedIn,
            setUsername,
            checkLoginStatus,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
};
