import {CatalogStyle} from "@/types/catalog-style";

export interface Catalog {
    id?: string
    name: string
    url: string
    company: string
    cnpj: string
    address: string
    whatsapp: string
    categoryIds: string[]
    productIds: string[]
    style: CatalogStyle
}