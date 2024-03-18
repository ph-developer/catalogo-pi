import {ReactElement, useEffect, useState} from "react";
import {AuthContext} from "@/contexts/AuthContext.tsx";
import {useMount} from "@/hooks/use-mount.tsx";
import {onAuthStateChanged, User as FirebaseUser} from "firebase/auth";
import {auth, db} from "@/lib/firebase.ts";
import {User} from "@/types/user";
import {doc, onSnapshot} from "firebase/firestore";
import {userParser} from "@/parsers/user-parser.ts";

interface Props {
    children: ReactElement
}

export const AuthContextProvider = ({children}: Props) => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser|null>(null)
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useMount(() => {
        onAuthStateChanged(auth, (firebaseUser) => {
            setFirebaseUser(firebaseUser)
            setIsAuthenticating(false)
        })
    })

    useEffect(() => {
        if (isAuthenticating) return
        if (!firebaseUser) {
            setCurrentUser(null)
            setIsLoading(false)
        } else {
            const userDataRef = doc(db, 'users', firebaseUser.uid)
            return onSnapshot(userDataRef, (snapshot) => {
                setCurrentUser(userParser.fromFirebase(firebaseUser, snapshot))
                setIsLoading(false)
            })
        }
    }, [isAuthenticating, firebaseUser]);

    if (isLoading) return (<></>)

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    )
}