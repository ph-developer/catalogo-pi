export interface Catalog {
    id?: string
    banner: string | null
    bannerDominantColor: string | null
    name: string
    url: string
    company: string
    cnpj: string
    address: string
    whatsapp: string
    categoryIds: string[]
    productIds: string[]
}