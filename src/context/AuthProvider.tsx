import { createContext, useState, useEffect } from "react";
import {apiClient} from '../clients/api'
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
  logIn: (email: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
  logOut: () => void;
  token: string | null;
  setToken: (token: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Check if there is a token in localStorage and set them in state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const value = localStorage.getItem("user");
      if (value) {
        return JSON.parse(value);
      } else return null;
    } catch (error) {
      console.error(error);
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      const value = localStorage.getItem("token");
      if (value) {
        return JSON.parse(value);
      } else return null;
    } catch (error) {
      console.error(error);
    }
  });

    // Save user to localstorage whenever they change
  useEffect(() => {
    // if user is true save to storage, if not remove user from localstorage
    try {
        if(user) {
            localStorage.setItem("user", JSON.stringify(user))
        }else{
            localStorage.removeItem("user")
        }
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  // Save token to localstorage whenever they change
  useEffect(()=>{
    try{
        if(token) {
        localStorage.setItem("token", JSON.stringify(token));
        // Set token in apiClient headers for authenticated requests
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
        }else{
            localStorage.removeItem("token")
            delete apiClient.defaults.headers.common["Authorization"];
    }}catch(error){
        console.error(error)
    }
},[token])

  const logIn = async (email: string, password: string) => {
    try{
        const response = await apiClient.post("/api/users/login",{
            email,
            password,
        })

        const {user, token} = response.data
        setUser(user)
        setToken(token)

        return {success: true}
    }
    catch(error:any){
        // output shows full error message, Login error: error-> throw into new Error error.(from console) response:{}, message:.... (from .message)
        console.error("Login error: ", error)
        // shows in backend error
        throw new Error(error.response?.data?.message || "Login failed")
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try{
        const response = await apiClient.post("/api/users/register", {
            username,
            email,
            password
        })

        const {user, token} = response.data
        setUser(user)
        setToken(token)

        return {success: true}
    }catch(error:unknown){
        console.error("Register error:", error)
        throw new Error(error.response?.data?.message || "Registration failed")

    }
  };

  const logOut = () => {
    try{
        setUser(null)
        setToken(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }catch(error){
        console.error("Logout error:", error)
    }


  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logIn, register, logOut, token, setToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}