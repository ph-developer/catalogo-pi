import { Category } from './category'
import { Product } from './product'

export interface Catalog {
    id?: string
    banner: string | null
    bannerDominantColor: string | null
    name: string
    company: string
    cnpj: string
    address: string
    whatsapp: string
    categoryIds: string[]
    categories?: Category[]
    productIds: string[]
    products?: Product[]
}