import { Category } from '@/types/category'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

export const categoryParser = {
    fromFirebase: (
        doc: QueryDocumentSnapshot<DocumentData, DocumentData>,
    ): Category => ({
        id: doc.id,
        name: doc.get('name')
    })
}