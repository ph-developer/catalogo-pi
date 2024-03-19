import {Category} from "@/types/category";
import {Product} from "@/types/product";

export const mapProductCategories = (product: Product, categories: Category[]) => {
    return product.categoryIds
        ?.map((categoryId) => categories.find(
            (category) => category.id === categoryId)
        )
        ?.filter((category) => !!category)
        ?.map((category) => category!) || []
}