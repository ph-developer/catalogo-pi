import { Category } from '@/types/category'
import { QueryDocumentSnapshot } from 'firebase/firestore'

export const categoryParser = {
    fromFirebase: (
        doc: QueryDocumentSnapshot,
    ): Category => ({
        id: doc.id,
        name: doc.get('name')
    })
}