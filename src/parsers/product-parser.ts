import { Product } from '@/types/product'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

export const productParser = {
    fromFirebase: (
        doc: QueryDocumentSnapshot<DocumentData, DocumentData>,
    ): Product => ({
        id: doc.id,
        name: doc.get('name'),
        description: doc.get('description'),
        categories: doc.get('categories'),
        photos: doc.get('photos'),
        categoryIds: doc.get('categoryIds'),
    })
}