import {useContext} from "react";
import {AuthContext} from "@/contexts/AuthContext.tsx";

export const useAuthContext = () => useContext(AuthContext)
