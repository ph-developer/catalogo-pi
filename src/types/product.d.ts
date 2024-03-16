import {Category} from "@/types/category";

export interface Product {
    id: string
    name: string
    description: string
    categoryIds: string[]
    categories?: Category[]
    photos: string[]
}