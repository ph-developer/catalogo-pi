import {useEffect, useState} from "react";
import {Catalog} from "@/types/catalog";
import {collection, doc, limit, onSnapshot, query, setDoc, where} from "firebase/firestore";
import {db} from "@/lib/firebase.ts";
import {catalogParser} from "@/parsers/catalog-parser.ts";

export const useCatalog = (by: 'url' | 'id', value: string | null = null) => {
    const [catalog, setCatalog] = useState<Catalog | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const catalogsRef = collection(db, 'catalogs')
        if (by === 'url' && value) {
            const catalogQuery = query(catalogsRef, where('url', '==', value), limit(1))
            return onSnapshot(catalogQuery, (snapshot) => {
                if (snapshot.empty) {
                    setCatalog(null)
                } else {
                    setCatalog(catalogParser.fromFirebase(snapshot.docs[0]))
                }
                setIsLoading(false)
            })
        } else if (by === 'id' && value) {
            const catalogRef = doc(catalogsRef, value)
            return onSnapshot(catalogRef, (snapshot) => {
                if (!snapshot.exists()) {
                    setCatalog(null)
                } else {
                    setCatalog(catalogParser.fromFirebase(snapshot))
                }
                setIsLoading(false)
            })
        } else if (!value) {
            setIsLoading(false)
        }
    }, [by, value])

    const updateCatalog = async (catalog: Catalog) => {
        if (!catalog.id) return
        const catalogsRef = collection(db, 'catalogs')
        const catalogRef = doc(catalogsRef, catalog.id)
        delete catalog.id
        await setDoc(catalogRef, catalog)
    }

    const addProductIdToCatalog = async (id: string) => {
        if (!catalog || catalog.productIds.includes(id)) return
        const productIds = [...catalog.productIds, id]
        await updateCatalog({...catalog, productIds})
    }

    const removeProductIdFromCatalog = async (id: string) => {
        if (!catalog ||!catalog.productIds.includes(id)) return
        const productIds = catalog.productIds.filter((productId) => productId!== id)
        await updateCatalog({...catalog, productIds})
    }

    const addCategoryIdToCatalog = async (id: string) => {
        if (!catalog || catalog.categoryIds.includes(id)) return
        const categoryIds = [...catalog.categoryIds, id]
        await updateCatalog({...catalog, categoryIds})
    }

    const removeCategoryIdFromCatalog = async (id: string) => {
        if (!catalog ||!catalog.categoryIds.includes(id)) return
        const categoryIds = catalog.categoryIds.filter((categoryId) => categoryId!== id)
        await updateCatalog({...catalog, categoryIds})
    }

    return {
        catalog,
        isLoading,
        addProductIdToCatalog,
        removeProductIdFromCatalog,
        addCategoryIdToCatalog,
        removeCategoryIdFromCatalog
    }
}