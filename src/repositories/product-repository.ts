import {Product} from "@/types/product";
import {collection, doc, documentId, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "@/lib/firebase.ts";
import {categoryRepository} from "@/repositories/category-repository.ts";
import {productParser} from "@/parsers/product-parser.ts";

type Lazy = ('categories')[]

export const productRepository = {
    getProductById: async (id: string, lazy: Lazy = []) :Promise<Product|null> => {
        const productsRef = collection(db, 'products')
        const productRef = doc(productsRef, id)
        const productSnapshot = await getDoc(productRef)

        if (!productSnapshot.exists()) return null

        const product = productParser.fromFirebase(productSnapshot)

        if (lazy.includes('categories')) {
            product.categories = await categoryRepository.getCategoriesByIds(product.categoryIds)
        }

        return product
    },
    getProductsByIds: async (ids: string[], lazy: Lazy = []): Promise<Product[]> => {
        if (!ids.length) return []
        const productsRef = collection(db, 'products')
        const productsQuery = query(productsRef, where(documentId(), 'in', ids))
        const productsSnapshot = await getDocs(productsQuery)

        if (productsSnapshot.empty) return []

        let products = productsSnapshot.docs.map(productParser.fromFirebase)

        if (lazy.includes('categories')) {
            const categoryIds = products
                .map((p) => p.categoryIds)
                .flatMap((c) => c)
            const categories = await categoryRepository.getCategoriesByIds(categoryIds)
            products = products.map((product) => ({
                ...product,
                categories: product.categoryIds.map((ids) => {
                    return categories.find((c) => c.id === ids)!
                })
            }))
        }

        return products
    }
}