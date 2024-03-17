import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {ReactElement} from "react";
import QrCode from "react-qr-code";

interface Props {
    url: string
    children: ReactElement
}

export const UrlQrCodeDialog = ({url, children}: Props) => {
    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent className="flex justify-center sm:max-w-96">
                <QrCode value={`${document.location.origin}/${url}`} className="h-80 w-80 mt-6"/>
            </DialogContent>
        </Dialog>
    )
}