import {collection, doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/lib/firebase.ts";
import {catalogRepository} from "@/repositories/catalog-repository.ts";
import {userDataParser} from "@/parsers/user-data-parser.ts";
import {UserData} from "@/types/user-data";
import {authRepository} from "@/repositories/auth-repository.ts";

type Lazy = ('catalogs')[]

const usersRef = collection(db, 'users')

export const userRepository = {
    getUserDataById: async (id: string, lazy: Lazy = []): Promise<UserData | null> => {
        const userRef = doc(usersRef, id)
        const userSnapshot = await getDoc(userRef)

        if (!userSnapshot.exists()) return null

        const userData = userDataParser.fromFirebase(userSnapshot)

        if (lazy.includes('catalogs')) {
            userData.catalogs = await catalogRepository.getCatalogsByUserId(id)
        }

        return userData
    },
    updateUserData: async (userData: UserData): Promise<void> => {
        const userRef = doc(usersRef, userData.id)
        delete userData.id
        await updateDoc(userRef, userData)
    },
    addCatalogIdToUserData: async (id: string): Promise<void> => {
        const currentUser = await authRepository.getCurrentUser()
        if (!currentUser) return
        const userData = await userRepository.getUserDataById(currentUser.id)
        if (!userData || userData.catalogIds.includes(id)) return
        const catalogIds = [...userData.catalogIds, id]
        await userRepository.updateUserData({...userData, catalogIds})
    },
    removeCatalogIdFromUserData: async (id: string): Promise<void> => {
        const currentUser = await authRepository.getCurrentUser()
        if (!currentUser) return
        const userData = await userRepository.getUserDataById(currentUser.id)
        if (!userData || !userData.catalogIds.includes(id)) return
        const catalogIds = userData.catalogIds.filter((catalogId) => catalogId !== id)
        await userRepository.updateUserData({...userData, catalogIds})
    }
}