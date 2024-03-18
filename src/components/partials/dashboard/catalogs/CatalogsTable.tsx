import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Link} from "react-router-dom";
import {Icons} from "@/components/ui/icons.tsx";
import {UrlQrCodeDialog} from "@/components/dialogs/UrlQrCodeDialog.tsx";
import {ImgDialog} from "@/components/dialogs/ImgDialog.tsx";
import {EditCatalogDialog} from "@/components/dialogs/EditCatalogDialog.tsx";
import {Catalog} from "@/types/catalog";
import {ConfirmDeleteCatalogDialog} from "@/components/dialogs/ConfirmDeleteCatalogDialog.tsx";
import {useStorage} from "@/hooks/use-storage.ts";

interface Props {
    catalogs: Catalog[]
    onUpdateCatalog: (old: Catalog|null, catalog: Catalog) => void
    onDeleteCatalog: (catalog: Catalog) => void
}

export const CatalogsTable = ({catalogs, onUpdateCatalog, onDeleteCatalog}: Props) => {
    const {getImgSrcFn} = useStorage()

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
                                                <Icons.open className="w-3.5 h-3.5 cursor-pointer stroke-primary"/>
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
                                                    <ImgDialog src={getImgSrcFn('banner', catalog.banner)}>
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
                                    <Icons.image className="w-3.5 h-3.5 cursor-not-allowed stroke-primary/50"/>
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
                                        <TooltipTrigger>
                                            <ConfirmDeleteCatalogDialog
                                                catalog={catalog}
                                                onDeleteCatalog={onDeleteCatalog}
                                            >
                                                <div>
                                                    <Icons.trash
                                                        className="w-3.5 h-3.5 cursor-pointer stroke-destructive"
                                                    />
                                                </div>
                                            </ConfirmDeleteCatalogDialog>
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