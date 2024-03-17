import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Link} from "react-router-dom";
import {Icons} from "@/components/ui/icons.tsx";
import {UrlQrCodeDialog} from "@/components/dialogs/UrlQrCodeDialog.tsx";
import {ImgDialog} from "@/components/dialogs/ImgDialog.tsx";
import {storageRepository} from "@/repositories/storage-repository.ts";
import {EditCatalogDialog} from "@/components/dialogs/EditCatalogDialog.tsx";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {Catalog} from "@/types/catalog";

interface Props {
    catalogs: Catalog[]
    onUpdateCatalog: (catalog: Catalog) => void | Promise<void>
    onDeleteCatalog: (catalog: Catalog) => void | Promise<void>
}

export const CatalogsTable = ({catalogs, onUpdateCatalog, onDeleteCatalog}: Props) => {
    return (<Table>
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
                        <TableCell>
                            {catalog.name}
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
                        <TableCell className="whitespace-nowrap">
                            <div className="flex items-center justify-center space-x-1.5 align-middle">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link to={`/${catalog.url}`} target="_blank">
                                                <Icons.open
                                                    className="w-3.5 h-3.5 cursor-pointer stroke-primary"
                                                />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Abrir "{catalog.url}"</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="mt-1">
                                                <UrlQrCodeDialog url={catalog.url}>
                                                    <Icons.qrCode
                                                        className="w-3.5 h-3.5 cursor-pointer stroke-primary"
                                                    />
                                                </UrlQrCodeDialog>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>QR Code</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {catalog.banner ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="mt-1">
                                                    <ImgDialog
                                                        src={() => storageRepository.getBannerPhotoSrc(catalog.banner!)}
                                                    >
                                                        <Icons.image
                                                            className="w-3.5 h-3.5 cursor-pointer stroke-primary"
                                                        />
                                                    </ImgDialog>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Visualizar Banner</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <div>
                                        <Icons.image className="w-3.5 h-3.5 cursor-not-allowed stroke-primary/50"/>
                                    </div>
                                )}

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <EditCatalogDialog
                                                catalog={catalog}
                                                onSaveCatalog={onUpdateCatalog}
                                            >
                                                <div>
                                                    <Icons.edit className="w-3.5 h-3.5 cursor-pointer stroke-success"/>
                                                </div>
                                            </EditCatalogDialog>
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
                                                            <AlertDialogCancel>
                                                                Cancelar
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-destructive hover:bg-destructive/90"
                                                                onClick={() => onDeleteCatalog(catalog)}
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
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}