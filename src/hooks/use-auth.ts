import {useAuthContext} from "@/contexts/use-auth-context";
import {signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth} from "@/lib/firebase.ts";

export const useAuth = () => {
    const currentUser = useAuthContext()

    const doLogin = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    const doLogout = async () => {
        await signOut(auth)
    }

    return {
        currentUser,
        doLogin,
        doLogout
    }
}