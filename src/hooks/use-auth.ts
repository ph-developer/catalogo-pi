import {useAuthContext} from "@/contexts/use-auth-context";
import {signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "@/lib/firebase.ts";
import {collection, doc, setDoc} from "firebase/firestore";

export const useAuth = () => {
    const currentUser = useAuthContext()

    const doLogin = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    const doLogout = async () => {
        await signOut(auth)
    }

    const doRegister = async (email: string, password: string) => {
        const {user: {uid: userId}} = await createUserWithEmailAndPassword(auth, email, password)
        if (userId) {
            const usersRef = collection(db, 'users')
            const userRef = doc(usersRef, userId)
            await setDoc(userRef, {catalogIds: []})
        }
    }

    return {
        currentUser,
        doLogin,
        doLogout,
        doRegister
    }
}