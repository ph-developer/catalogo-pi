import {useEffect, useState} from "react";
import {Catalog} from "@/types/catalog";
import {db} from "@/lib/firebase.ts";
import {collection, query, where, documentId, onSnapshot, addDoc, doc, setDoc, deleteDoc} from "firebase/firestore";
import {catalogParser} from "@/parsers/catalog-parser.ts";

export const useCatalogs = (ids: string[]|null = null) => {
    const [catalogs, setCatalogs] = useState<Catalog[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!ids) {
            return
        } else if (!ids?.length && catalogs.length) {
            setCatalogs([])
            setIsLoading(false)
        } else if (!ids.length) {
            setIsLoading(false)
        } else {
            const catalogsRef = collection(db, 'catalogs')
            const catalogsQuery = query(catalogsRef, where(documentId(), 'in', ids))
            return onSnapshot(catalogsQuery, (snapshot) => {
                if (snapshot.empty) {
                    setCatalogs([])
                } else {
                    setCatalogs(snapshot.docs.map(catalogParser.fromFirebase).sortBy('name'))
                }
                setIsLoading(false)
            })
        }
    }, [ids])

    const insertCatalog = async (catalog: Catalog) => {
        if (catalog.id) return
        delete catalog.id
        const catalogsRef = collection(db, 'catalogs')
        const {id: catalogId} = await addDoc(catalogsRef, catalog)
        return catalogId
    }

    const updateCatalog = async (catalog: Catalog) => {
        if (!catalog.id) return
        const catalogsRef = collection(db, 'catalogs')
        const catalogRef = doc(catalogsRef, catalog.id)
        const catalogId = catalog.id
        delete catalog.id
        await setDoc(catalogRef, catalog)
        return catalogId
    }

    const deleteCatalog = async (id: string) => {
        const catalogsRef = collection(db, 'catalogs')
        const catalogRef = doc(catalogsRef, id)
        await deleteDoc(catalogRef)
        return true
    }

    return {
        insertCatalog,
        updateCatalog,
        deleteCatalog,
        catalogs,
        isLoading
    }
}