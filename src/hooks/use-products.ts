import {Product} from "@/types/product";
import {useEffect, useState} from "react";
import {addDoc, collection, deleteDoc, doc, documentId, onSnapshot, query, setDoc, where} from "firebase/firestore";
import {db} from "@/lib/firebase.ts";
import {productParser} from "@/parsers/product-parser.ts";

export const useProducts = (ids: string[] | null = null) => {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!ids?.length) {
            setProducts([])
        } else {
            const productsRef = collection(db, 'products')
            const productsQuery = query(productsRef, where(documentId(), 'in', ids))
            return onSnapshot(productsQuery, (snapshot) => {
                if (snapshot.empty) {
                    setProducts([])
                } else {
                    setProducts(snapshot.docs.map(productParser.fromFirebase).sortBy('name'))
                }
                setIsLoading(false)
            })
        }
    }, [ids])

    const insertProduct = async (product: Product) => {
        if (product.id) return null
        delete product.id
        const productsRef = collection(db, 'products')
        const {id: productId} = await addDoc(productsRef, product)
        return productId
    }

    const updateProduct = async (product: Product) => {
        if (!product.id) return null
        const productsRef = collection(db, 'products')
        const productRef = doc(productsRef, product.id)
        const productId = product.id
        delete product.id
        await setDoc(productRef, product)
        return productId
    }

    const deleteProduct = async (id: string) => {
        const productsRef = collection(db, 'products')
        const productRef = doc(productsRef, id)
        await deleteDoc(productRef)
        return true
    }

    return {
        insertProduct,
        updateProduct,
        deleteProduct,
        products,
        isLoading
    }
}