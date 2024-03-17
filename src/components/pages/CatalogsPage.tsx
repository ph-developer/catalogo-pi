import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {Catalog} from "@/types/catalog";
import {Table, TableBody, TableHead, TableHeader, TableRow, TableCell} from "@/components/ui/table.tsx";
import {Icons} from "@/components/ui/icons.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {EditCatalogDialog} from "@/components/dialogs/EditCatalogDialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {catalogRepository} from "@/repositories/catalog-repository.ts";
import {useNotifications} from "@/hooks/use-notifications.tsx";
import {LazyLoadImg} from "@/components/ui/lazy-load-img.tsx";
import {storageRepository} from "@/repositories/storage-repository.ts";

const CatalogsPage = () => {
    const catalogs = useLoaderData() as Catalog[]
    const navigate = useNavigate()
    const {notifySuccess} = useNotifications()

    const saveCatalog = async (old: Catalog|null, catalog: Catalog) => {
        await catalogRepository.upsertCatalog(old, catalog)
        notifySuccess('Catálogo ' + (old ? 'atualizado.' : 'criado.'))
        navigate(0) // TODO: remove refresh
    }

    const deleteCatalog = async (catalog: Catalog) => {
        if (catalog.id) {
            await catalogRepository.deleteCatalog(catalog.id)
            notifySuccess('Catálogo excluído.')
            navigate(0) // TODO: remove refresh
        }
    }

    return (
        <section>
            <div className="flex flex-col pt-6 container mx-auto">
                <div className="flex justify-end py-2">
                    <EditCatalogDialog onSaveCatalog={saveCatalog}>
                        <Button className="text-sm">
                            Novo Catálogo
                        </Button>
                    </EditCatalogDialog>
                </div>
                <div className="bg-white border rounded-xl shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Catálogo</TableHead>
                                <TableHead>Empresa</TableHead>
                                <TableHead>CNPJ</TableHead>
                                <TableHead>Endereço</TableHead>
                                <TableHead>Whatsapp</TableHead>
                                <TableHead className="text-center">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {catalogs.map((catalog) => (
                                <TableRow key={catalog.id}>
                                    <TableCell className="whitespace-nowrap">
                                        <Button className="p-0 h-fit w-fit" variant="link" asChild>
                                            <Link to={`/${catalog.name}`} target="_blank">
                                                {catalog.name}
                                            </Link>
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {catalog.company}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {catalog.cnpj.formatCnpj()}
                                    </TableCell>
                                    <TableCell>
                                        {catalog.address}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {catalog.whatsapp.formatPhone()}
                                    </TableCell>
                                    <TableCell className="flex items-center justify-center space-x-1.5 mt-1">
                                        {catalog.banner ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div>
                                                            <Icons.image
                                                                className="w-3.5 h-3.5 cursor-pointer stroke-primary"
                                                            />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <LazyLoadImg
                                                            // TODO: replace with modal
                                                            className="object-contain h-48 w-48"
                                                            imgSrc={() => storageRepository.getBannerPhotoSrc(catalog.banner!)}
                                                        />
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            <div>
                                                <Icons.image
                                                    className="w-3.5 h-3.5 cursor-not-allowed stroke-primary/50"
                                                />
                                            </div>
                                        )}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div>
                                                        <EditCatalogDialog catalog={catalog}
                                                                           onSaveCatalog={saveCatalog}>
                                                            <div>
                                                                <Icons.edit
                                                                    className="w-3.5 h-3.5 cursor-pointer stroke-success"
                                                                />
                                                            </div>
                                                        </EditCatalogDialog>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Editar</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <div>
                                                                    <Icons.trash
                                                                        className="w-3.5 h-3.5 cursor-pointer stroke-destructive"
                                                                    />
                                                                </div>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        Excluir catálogo?
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esta ação não pode ser desfeita.
                                                                        Deseja realmente excluir este catálogo?
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        className="bg-destructive hover:bg-destructive/90"
                                                                        onClick={() => deleteCatalog(catalog)}
                                                                    >
                                                                        Excluir
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Excluir</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    )
}

export default CatalogsPage