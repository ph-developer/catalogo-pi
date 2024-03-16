import {collection, doc, documentId, getDocs, limit, query, where, addDoc, setDoc, deleteDoc} from "firebase/firestore";
import {db} from "@/lib/firebase.ts";
import {Catalog} from "@/types/catalog";
import {categoryRepository} from "@/repositories/category-repository.ts";
import {productRepository} from "@/repositories/product-repository.ts";
import {userRepository} from "@/repositories/user-repository.ts";
import {catalogParser} from "@/parsers/catalog-parser.ts";
import {storageRepository} from "@/repositories/storage-repository.ts";

type Lazy = ('products' | 'categories')[]

const catalogsRef = collection(db, 'catalogs')

export const catalogRepository = {
    getCatalogByName: async (name: string, lazy: Lazy = []): Promise<Catalog | null> => {
        const catalogsQuery = query(catalogsRef, where('name', '==', name), limit(1))
        const catalogsSnapshot = await getDocs(catalogsQuery)

        if (catalogsSnapshot.empty) return null

        const catalogSnapshot = catalogsSnapshot.docs[0]
        const catalog = catalogParser.fromFirebase(catalogSnapshot)

        if (lazy.includes('categories')) {
            catalog.categories = await categoryRepository.getCategoriesByIds(catalog.categoryIds)
        }

        if (lazy.includes('products')) {
            catalog.products = await productRepository.getProductsByIds(catalog.productIds)

            if (lazy.includes('categories')) {
                catalog.products = catalog.products.map((product) => ({
                    ...product,
                    categories: product.categoryIds.map((ids) => {
                        return catalog.categories!.find((c) => c.id === ids)!
                    })
                }))
            }
        }

        return catalog
    },
    getCatalogsByIds: async (ids: string[], lazy: Lazy = []): Promise<Catalog[]> => {
        if (!ids.length) return []
        const catalogsQuery = query(catalogsRef, where(documentId(), 'in', ids))
        const catalogsSnapshot = await getDocs(catalogsQuery)

        if (catalogsSnapshot.empty) return []

        let catalogs = catalogsSnapshot.docs.map(catalogParser.fromFirebase)

        if (lazy.includes('categories')) {
            const categoryIds = catalogs
                .map((c) => c.categoryIds)
                .flatMap((c) => c)
            const categories = await categoryRepository.getCategoriesByIds(categoryIds)
            catalogs = catalogs.map((catalog) => ({
                ...catalog,
                categories: catalog.categoryIds.map((ids) => {
                    return categories.find((c) => c.id === ids)!
                })
            }))
        }

        if (lazy.includes('products')) {
            const productIds = catalogs
                .map((catalog) => catalog.productIds)
                .flatMap((productIds) => productIds)
            const products = await productRepository.getProductsByIds(productIds)
            catalogs = catalogs.map((catalog) => ({
                ...catalog,
                products: catalog.productIds.map((ids) => {
                    return products.find((product) => product.id === ids)!
                })
            }))

            if (lazy.includes('categories')) {
                catalogs.map((catalog) => ({
                    ...catalog,
                    products: products.map((product) => ({
                        ...product,
                        categories: product.categoryIds.map((ids) => {
                            return catalog.categories!.find((category) => category.id === ids)!
                        })
                    }))
                }))
            }
        }

        return catalogs
    },
    getCatalogsByUserId: async (userId: string, lazy: Lazy = []): Promise<Catalog[]> => {
        const userData = await userRepository.getUserDataById(userId)
        if (!userData) return []
        const catalogIds = userData.catalogIds
        return await catalogRepository.getCatalogsByIds(catalogIds, lazy)
    },
    insertCatalog: async (catalog: Catalog): Promise<void> => {
        if (catalog.id) return
        delete catalog.id
        const { id: catalogId} = await addDoc(catalogsRef, catalog)
        await userRepository.addCatalogIdToUserData(catalogId)
    },
    updateCatalog: async (catalog: Catalog): Promise<void> => {
        if (!catalog.id) return
        const catalogRef = doc(catalogsRef, catalog.id)
        delete catalog.id
        await setDoc(catalogRef, catalog)
    },
    upsertCatalog: async (old: Catalog, catalog: Catalog): Promise<void> => {
        catalog.banner = await storageRepository.replaceBanner(old?.banner || null, catalog.banner)
        if (catalog.id) {
            await catalogRepository.updateCatalog(catalog)
        } else {
            await catalogRepository.insertCatalog(catalog)
        }
    },
    deleteCatalog: async (id: string): Promise<void> => {
        const catalogRef = doc(catalogsRef, id)
        await deleteDoc(catalogRef)
        await userRepository.removeCatalogIdFromUserData(id)
    }
}