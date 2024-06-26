import {Catalog} from '@/types/catalog'
import {DocumentSnapshot, QueryDocumentSnapshot} from 'firebase/firestore'

export const catalogParser = {
    fromFirebase: (
        doc: QueryDocumentSnapshot| DocumentSnapshot,
    ): Catalog => ({
        id: doc.id,
        name: doc.get('name'),
        url: doc.get('url'),
        company: doc.get('company'),
        cnpj: doc.get('cnpj'),
        address: doc.get('address'),
        whatsapp: doc.get('whatsapp'),
        categoryIds: doc.get('categoryIds'),
        productIds: doc.get('productIds'),
        style: doc.get('style'),
    })
}