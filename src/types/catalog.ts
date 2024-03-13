import { Category } from './category'
import { Product } from './product'

export interface Catalog {
    id: string
    banner: string | null
    name: string
    company: string
    cnpj: string
    address: string
    city: string
    state: string
    country: string
    whatsapp: string
    categories: Category[]
    products: Product[]
}