import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { Category } from "@/types/category"
import {colors} from "@/lib/colors.ts";
import {Catalog} from "@/types/catalog";

interface Props {
    catalog: Catalog
    categories: Category[]
    onCategoryClick: (category: Category) => void
}

export const CatalogCategoryFilters = ({catalog, categories, onCategoryClick }: Props) => {
    return (
        <div style={catalog?.bannerDominantColor ? {
            color: colors.getTextColor(catalog.bannerDominantColor),
        } : {}}>
            <p className="mb-1 text-sm font-medium">
                Filtros
            </p>
            <div className="flex flex-auto flex-wrap">
                {categories.map((category) => (
                    <Badge key={category.id} className="flex w-fit mb-1 mr-1 items-center">
                        <span className="mr-1 select-none">
                            {category.name}
                        </span>
                        <Icons.x
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => onCategoryClick(category)}
                        />
                    </Badge>
                ))}
            </div>
        </div>
    )
}