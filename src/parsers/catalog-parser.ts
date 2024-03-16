import {Catalog} from '@/types/catalog'
import {DocumentData, QueryDocumentSnapshot} from 'firebase/firestore'

export const catalogParser = {
    fromFirebase: (
        doc: QueryDocumentSnapshot<DocumentData, DocumentData>,
    ): Catalog => ({
        id: doc.id,
        banner: doc.get('banner'),
        name: doc.get('name'),
        company: doc.get('company'),
        cnpj: doc.get('cnpj'),
        address: doc.get('address'),
        city: doc.get('city'),
        state: doc.get('state'),
        country: doc.get('country'),
        whatsapp: doc.get('whatsapp'),
        categoryIds: doc.get('categoryIds'),
        productIds: doc.get('productIds'),
    })
}