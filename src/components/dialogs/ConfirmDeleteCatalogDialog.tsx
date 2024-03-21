import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {ReactElement, useState} from "react";
import {Catalog} from "@/types/catalog";
import {Button} from "@/components/ui/button.tsx";
import {Icons} from "@/components/ui/icons.tsx";

interface Props {
    catalog: Catalog
    onDeleteCatalog: (catalog: Catalog) => Promise<void>
    children: ReactElement
}

export const ConfirmDeleteCatalogDialog = ({catalog, children, onDeleteCatalog}: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const onConfirm = async () => {
        setIsLoading(true)
        await onDeleteCatalog(catalog)
        setIsLoading(false)
        setIsOpen(false)
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Excluir catálogo "{catalog.name}"?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Deseja realmente excluir este catálogo?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Cancelar
                    </AlertDialogCancel>
                    <Button className="bg-destructive hover:bg-destructive/90" onClick={onConfirm} disabled={isLoading}>
                        {isLoading && <Icons.loader className="mr-2 w-4 h-4 animate-spin" />}
                        Excluir
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}