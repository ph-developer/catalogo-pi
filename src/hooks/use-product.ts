import {Product} from "@/types/product";
import {useEffect, useState} from "react";
import {collection, doc, onSnapshot} from "firebase/firestore";
import {db} from "@/lib/firebase.ts";
import {productParser} from "@/parsers/product-parser.ts";

export const useProduct = (id: string | null = null) => {
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        if (id) {
            const productsRef = collection(db, 'products')
            const productRef = doc(productsRef, id)
            return onSnapshot(productRef, (snapshot) => {
                if (!snapshot.exists()) {
                    setProduct(null)
                } else {
                    setProduct(productParser.fromFirebase(snapshot))
                }
                setIsLoading(false)
            })
        }
    }, [id])

    return {
        product,
        isLoading
    }
}