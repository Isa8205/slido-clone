import api from "@/lib/axios";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthContextType {
    user: { id: number; username: string; email: string } | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    signUp: (userData: Omit<User, "id"> & {password: string}) => Promise<boolean>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const signUp = async(userData: Omit<User, "id"> & {password: string}): Promise<boolean> => {
        try {
            setIsLoading(true)
            await api.post("/auth/signup", userData)
            return true
        } catch (err) {
            console.error(err)
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                if (status === 401) {
                    toast.error("Incorrect username or password")
                } else if (status === 500) {
                    toast.error("Something went wrong on the server. Please try again.")
                }
            } else {
                console.error(err)
                toast.error("Something went wrong. Please try again.")
            }
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const login = async(username: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true)
            const res = await api.post("/auth/login", { username, password })
            if (res.status === 200) {
                localStorage.setItem("access-token", res.data.token)
                setUser(res.data.user)
                setIsAuthenticated(true)
            }
            return true
        } catch (err) {
            console.error(err)
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                if (status === 401) {
                    toast.error("Incorrect username or password")
                } else if (status === 500) {
                    toast.error("Something went wrong on the server. Please try again.")
                }
            } else {
                console.error(err)
                toast.error("Something went wrong. Please try again.")
            }
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async(): Promise<void> => {
        try {
            setIsLoading(true)
            // await api.post("/auth/logout")
            localStorage.removeItem("access-token")
            setUser(null)
            setIsAuthenticated(false)
        } catch (err) {
            console.error(err)
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                if (status === 500) {
                    toast.error("Something went wrong on the server. Please try again.")
                }
            } else {
                console.error(err)
                toast.error("Something went wrong. Please try again.")
            }
        } finally {
            setIsLoading(false)
            if (user) {
                setUser(null)
                setIsAuthenticated(false)
        }
        }
    }

    useEffect(() => {
        (async() => {
            try {
                const res = await api.get("/auth/me")
                console.log(res)
                if (res.status === 200) {
                    setUser(res.data.user)
                    setIsAuthenticated(true)
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const status = err.response?.status;
                    if (status === 500) {
                        toast.error("Something went wrong on the server. Please try again.")
                    } else if (status === 401) {
                        localStorage.removeItem("access-token")
                        setUser(null)
                        setIsAuthenticated(false)
                    }
                }
            }
        })()
    }, [])

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signUp, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider")
    }
    return context
}