import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {mapProductCategories} from "@/mappers/map-product-categories.ts";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {EditProductPhotosDialog} from "@/components/dialogs/EditProductPhotosDialog.tsx";
import {Icons} from "@/components/ui/icons.tsx";
import {EditProductDialog} from "@/components/dialogs/EditProductDialog.tsx";
import {ConfirmDeleteProductDialog} from "@/components/dialogs/ConfirmDeleteProductDialog.tsx";
import {Product} from "@/types/product";
import {Category} from "@/types/category";

interface Props {
    products: Product[]
    categories: Category[]
    onSaveProduct: (old: Product | null, product: Product) => Promise<void>
    onDeleteProduct: (product: Product) => Promise<void>
    onSavePhotos: (old: Product, photoUrls: string[]) => Promise<void>
}

export const ProductsTable = ({products, categories, onSaveProduct, onDeleteProduct, onSavePhotos}: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="text-justify">
                            <div className="font-semibold">
                                {product.name}
                            </div>
                            <div>
                                <span className="font-semibold">Descrição: </span>{product.description}
                            </div>
                            {!!product.categoryIds.length && (
                                <div>
                                    <span className="font-semibold">Categorias: </span>
                                    {mapProductCategories(product, categories)
                                        .sortBy('name')
                                        .map((category) => category.name)
                                        .join(', ')}
                                </div>
                            )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                            <div className="flex items-center justify-center space-x-1.5 align-middle">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <EditProductPhotosDialog product={product} onSavePhotos={onSavePhotos}>
                                                <div>
                                                    <Icons.image className="w-3.5 h-3.5 cursor-pointer"/>
                                                </div>
                                            </EditProductPhotosDialog>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Fotos</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <EditProductDialog
                                                product={product}
                                                onSaveProduct={onSaveProduct}
                                                categories={categories}
                                            >
                                                <div>
                                                    <Icons.edit className="w-3.5 h-3.5 cursor-pointer stroke-success"/>
                                                </div>
                                            </EditProductDialog>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Editar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <ConfirmDeleteProductDialog
                                                product={product}
                                                onDeleteProduct={onDeleteProduct}
                                            >
                                                <div>
                                                    <Icons.trash
                                                        className="w-3.5 h-3.5 cursor-pointer stroke-destructive"
                                                    />
                                                </div>
                                            </ConfirmDeleteProductDialog>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Excluir</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}