import { Product } from '@/types/product'
import { QueryDocumentSnapshot } from 'firebase/firestore'

export const productParser = {
    fromFirebase: (
        doc: QueryDocumentSnapshot,
    ): Product => ({
        id: doc.id,
        name: doc.get('name'),
        description: doc.get('description'),
        categories: doc.get('categories'),
        photos: doc.get('photos'),
        categoryIds: doc.get('categoryIds'),
    })
}