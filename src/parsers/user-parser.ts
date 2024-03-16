import {User as FirebaseUser} from "firebase/auth";
import {User} from "@/types/user";

export const userParser = {
    fromFirebase: (
        firebaseUser: FirebaseUser,
    ): User => ({
        id: firebaseUser.uid,
        email: firebaseUser.email!,
    })
}