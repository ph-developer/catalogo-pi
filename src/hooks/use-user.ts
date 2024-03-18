import {useAuth} from "@/hooks/use-auth.ts";
import {User} from "@/types/user";
import {collection, doc, updateDoc} from "firebase/firestore";
import {db} from "@/lib/firebase.ts";

export const useUser = () => {
    const {currentUser} = useAuth()

    const updateUser = async (user: Partial<User>) => {
        if (!currentUser) return
        delete user.id
        delete user.email
        const usersRef = collection(db, 'users')
        const userRef = doc(usersRef, currentUser.id)
        await updateDoc(userRef, user)
    }

    const addCatalogIdToUser = async (id: string) => {
        if (!currentUser || currentUser.catalogIds.includes(id)) return
        const catalogIds = [...currentUser.catalogIds, id]
        await updateUser({...currentUser, catalogIds})
    }

    const removeCatalogIdFromUser = async (id: string) => {
        if (!currentUser || !currentUser.catalogIds.includes(id)) return
        const catalogIds = currentUser.catalogIds.filter((catalogId) => catalogId !== id)
        await updateUser({...currentUser, catalogIds})
    }

    return {
        updateUser,
        addCatalogIdToUser,
        removeCatalogIdFromUser
    }
}