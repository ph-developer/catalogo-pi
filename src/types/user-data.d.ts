import {Catalog} from "@/types/catalog";

export interface UserData {
    id: string
    catalogIds: string[]
    catalogs?: Catalog[]
}