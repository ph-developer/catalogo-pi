import {useEffect, useState} from "react";
import {Catalog} from "@/types/catalog";
import {Category} from "@/types/category";
import {Product} from "@/types/product";
import {collection, doc, documentId, limit, onSnapshot, query, where} from "firebase/firestore";
import {db} from "@/lib/firebase.ts";
import {catalogParser} from "@/parsers/catalog-parser.ts";
import {categoryParser} from "@/parsers/category-parser.ts";
import {productParser} from "@/parsers/product-parser.ts";

export const useCatalog = (by: 'url'|'id', value: string|null = null) => {
    const [catalog, setCatalog] = useState<Catalog|null>(null)
    const [categoryIds, setCategoryIds] = useState<string[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [productIds, setProductIds] = useState<string[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(true)
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true)
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true)

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
                setIsLoadingCatalog(false)
            })
        } else if (by === 'id' && value) {
            const catalogRef = doc(catalogsRef, value)
            return onSnapshot(catalogRef, (snapshot) => {
                if (snapshot.exists()) {
                    setCatalog(null)
                } else {
                    setCatalog(catalogParser.fromFirebase(snapshot))
                }
                setIsLoadingCatalog(false)
            })
        } else if (!value) {
            setIsLoadingCatalog(false)
        }
    }, [by, value])

    useEffect(() => {
        if (isLoadingCatalog) return
        if (!catalog && categoryIds.length > 0) {
            setCategoryIds([])
            setIsLoadingCategories(false)
        } else if (catalog && catalog.categoryIds.diff(categoryIds).length > 0) {
            setCategoryIds(catalog.categoryIds)
        } else {
            setIsLoadingCategories(false)
        }
        if (!catalog && productIds.length > 0) {
            setProductIds([])
            setIsLoadingProducts(false)
        } else if (catalog && catalog.productIds.diff(productIds).length > 0) {
            setProductIds(catalog.productIds)
        } else {
            setIsLoadingProducts(false)
        }
    }, [isLoadingCatalog, catalog, categoryIds, productIds])

    useEffect(() => {
        if (!categoryIds.length) return
        const categoriesRef = collection(db, 'categories')
        const categoriesQuery = query(categoriesRef, where(documentId(), 'in', categoryIds))
        return onSnapshot(categoriesQuery, (snapshot) => {
            if (snapshot.empty) {
                setCategories([])
            } else {
                setCategories(snapshot.docs.map(categoryParser.fromFirebase))
            }
            setIsLoadingCategories(false)
        })
    }, [categoryIds])

    useEffect(() => {
        if (!productIds.length) return
        const productsRef = collection(db, 'products')
        const productsQuery = query(productsRef, where(documentId(), 'in', productIds))
        return onSnapshot(productsQuery, (snapshot) => {
            if (snapshot.empty) {
                setProducts([])
            } else {
                setProducts(snapshot.docs.map(productParser.fromFirebase))
            }
            setIsLoadingProducts(false)
        })
    }, [productIds])

    const computedProducts: Product[] = products.map((product) => ({
        ...product,
        categories: product.categoryIds.map(
            (id) => categories.find(
                (category) => category.id === id
            )
        ).filter((category) => !!category) as Category[]
    }))

    const computedCatalog: Catalog|null = !catalog ? null : {
        ...catalog,
        categories,
        products: computedProducts
    }

    return {
        catalog: computedCatalog,
        products: computedProducts,
        categories,
        isLoading: isLoadingCatalog || isLoadingCategories || isLoadingProducts
    }
}