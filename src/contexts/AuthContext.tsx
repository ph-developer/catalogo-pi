import {createContext} from "react";
import {User} from "@/types/user";

export const AuthContext = createContext<User | null>(null)