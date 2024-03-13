import { Catalog } from '@/types/catalog'
import { Category } from '@/types/category'
import { Product } from '@/types/product'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

export const catalogParser = {
    fromFirebase: (
        doc: QueryDocumentSnapshot<DocumentData, DocumentData>,
        categories: Category[] = [],
        products: Product[] = []
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
        categories,
        products,
    })
}