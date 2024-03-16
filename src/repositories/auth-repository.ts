import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/lib/firebase.ts";
import {User} from "@/types/user";
import {userParser} from "@/parsers/user-parser.ts";

type AuthStateChangedCallback = (user: User | null) => void

export const authRepository = {
    login: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    },
    logout: async () => {
        await auth.signOut()
    },
    onAuthStateChanged: (callback: AuthStateChangedCallback) => {
        return auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser === null) return callback(null)
            callback(userParser.fromFirebase(firebaseUser))
        })
    },
    getCurrentUser: () => {
        return new Promise<User | null>((resolve) => {
            auth.onAuthStateChanged((firebaseUser) => {
                if (firebaseUser === null) return resolve(null)
                resolve(userParser.fromFirebase(firebaseUser))
            })
        })
    }
}