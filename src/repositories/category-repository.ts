import {Category} from "@/types/category";
import {collection, doc, documentId, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "@/lib/firebase.ts";
import {categoryParser} from "@/parsers/category-parser.ts";

export const categoryRepository = {
    getCategoryById: async (id: string): Promise<Category | null> => {
        const categoriesRef = collection(db, 'categories')
        const categoryRef = doc(categoriesRef, id)
        const categorySnapshot = await getDoc(categoryRef)

        if (!categorySnapshot.exists()) return null

        return categoryParser.fromFirebase(categorySnapshot)
    },
    getCategoriesByIds: async (ids: string[]): Promise<Category[]> => {
        if (!ids.length) return []
        const categoriesRef = collection(db, 'categories')
        const categoriesQuery = query(categoriesRef, where(documentId(), 'in', ids))
        const categoriesSnapshot = await getDocs(categoriesQuery)

        if (categoriesSnapshot.empty) return []

        return categoriesSnapshot.docs.map(categoryParser.fromFirebase)
    }
}