import {useEffect, useState} from "react";
import {Catalog} from "@/types/catalog";
import {useAuth} from "@/hooks/use-auth.ts";
import {db} from "@/lib/firebase.ts";
import {collection, query, where, documentId, onSnapshot, addDoc, doc, setDoc, deleteDoc} from "firebase/firestore";
import {catalogParser} from "@/parsers/catalog-parser.ts";
import {useUser} from "@/hooks/use-user.ts";
import {useStorage} from "@/hooks/use-storage.ts";

export const useCatalogs = () => {
    const {currentUser} = useAuth()
    const {addCatalogIdToUser, removeCatalogIdFromUser} = useUser()
    const {replaceImg} = useStorage()
    const [catalogs, setCatalogs] = useState<Catalog[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!currentUser || !currentUser.catalogIds.length) {
            setCatalogs([])
        } else {
            const catalogsRef = collection(db, 'catalogs')
            const catalogsQuery = query(catalogsRef, where(documentId(), 'in', currentUser.catalogIds))
            return onSnapshot(catalogsQuery, (snapshot) => {
                if (snapshot.empty) {
                    setCatalogs([])
                } else {
                    setCatalogs(snapshot.docs.map(catalogParser.fromFirebase))
                }
                setIsLoading(false)
            })
        }
    }, [currentUser])

    const insertCatalog = async (catalog: Catalog) => {
        if (catalog.id) return
        delete catalog.id
        catalog.banner = await replaceImg('banner', null, catalog.banner)
        const catalogsRef = collection(db, 'catalogs')
        const {id: catalogId} = await addDoc(catalogsRef, catalog)
        await addCatalogIdToUser(catalogId)
    }

    const updateCatalog = async (old: Catalog, catalog: Catalog) => {
        if (!catalog.id) return
        const catalogsRef = collection(db, 'catalogs')
        const catalogRef = doc(catalogsRef, catalog.id)
        delete catalog.id
        catalog.banner = await replaceImg('banner', old.banner, catalog.banner)
        await setDoc(catalogRef, catalog)
    }

    const deleteCatalog = async (id: string) => {
        const catalogsRef = collection(db, 'catalogs')
        const catalogRef = doc(catalogsRef, id)
        await deleteDoc(catalogRef)
        await removeCatalogIdFromUser(id)
    }

    return {
        insertCatalog,
        updateCatalog,
        deleteCatalog,
        catalogs,
        isLoading
    }
}