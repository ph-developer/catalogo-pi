import { db } from "@/lib/firebase"
import { collection, getDocs, limit, query, where } from "firebase/firestore"
import { LoaderFunction, LoaderFunctionArgs } from "react-router-dom"
import { categoryParser } from '@/parsers/category-parser'
import { productParser } from '@/parsers/product-parser'
import { catalogParser } from "@/parsers/catalog-parser"

interface Args {
    catalogName: string
}

export const catalogLoader: LoaderFunction = async ({ params }: LoaderFunctionArgs<Args>) => {
    const { catalogName } = params
    const catalogsRef = collection(db, 'catalogs')
    const catalogsQuery = query(catalogsRef, where('name', '==', catalogName), limit(1))
    const catalogsSnapshot = await getDocs(catalogsQuery)
    const docs = catalogsSnapshot.docs

    if (!docs.length) return null

    const doc = docs[0]
    const categoriesRef = collection(catalogsRef, doc.id, 'categories')
    const categoriesSnapshot = await getDocs(categoriesRef)
    const categories = categoriesSnapshot.docs.map(categoryParser.fromFirebase)

    const productsRef = collection(catalogsRef, doc.id, 'products')
    const productsSnapshot = await getDocs(productsRef)
    const products = productsSnapshot.docs.map(productParser.fromFirebase)

    return catalogParser.fromFirebase(doc, categories, products)
}