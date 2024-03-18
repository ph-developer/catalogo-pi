import {User as FirebaseUser} from "firebase/auth";
import {User} from "@/types/user";
import {DocumentSnapshot} from 'firebase/firestore'

export const userParser = {
    fromFirebase: (
        firebaseUser: FirebaseUser,
        userDataSnapshot: DocumentSnapshot
    ): User => ({
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        catalogIds: userDataSnapshot.exists() ? userDataSnapshot.get('catalogIds') : []
    })
}