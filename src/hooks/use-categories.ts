import {useEffect, useState} from "react";
import {Category} from "@/types/category";
import {addDoc, collection, deleteDoc, doc, documentId, onSnapshot, query, setDoc, where} from "firebase/firestore";
import {db} from "@/lib/firebase.ts";
import {categoryParser} from "@/parsers/category-parser.ts";

export const useCategories = (ids: string[] | null = null) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!ids) {
            return
        } else if (!ids.length && categories.length) {
            setCategories([])
            setIsLoading(false)
        } else if (!ids.length) {
            setIsLoading(false)
        } else {
            const categoriesRef = collection(db, 'categories')
            const categoriesQuery = query(categoriesRef, where(documentId(), 'in', ids))
            return onSnapshot(categoriesQuery, (snapshot) => {
                if (snapshot.empty) {
                    setCategories([])
                } else {
                    setCategories(snapshot.docs.map(categoryParser.fromFirebase).sortBy('name'))
                }
                setIsLoading(false)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ids])

    const insertCategory = async (category: Category) => {
        if (category.id) return null
        delete category.id
        const categoriesRef = collection(db, 'categories')
        const {id: categoryId} = await addDoc(categoriesRef, category)
        return categoryId
    }

    const updateCategory = async (category: Category) => {
        if (!category.id) return null
        const categoriesRef = collection(db, 'categories')
        const categoryRef = doc(categoriesRef, category.id)
        const categoryId = category.id
        delete category.id
        await setDoc(categoryRef, category)
        return categoryId
    }

    const deleteCategory = async (id: string) => {
        const categoriesRef = collection(db, 'categories')
        const categoryRef = doc(categoriesRef, id)
        await deleteDoc(categoryRef)
        return true
    }

    return {
        insertCategory,
        updateCategory,
        deleteCategory,
        categories,
        isLoading,
    }
}