import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {ReactElement} from "react";
import {LazyLoadImg} from "@/components/ui/lazy-load-img.tsx";

interface Props {
    src: string|(() => Promise<string>)
    children: ReactElement
}

export const ImgDialog = ({src, children}: Props) => {
    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent className="flex justify-center sm:max-w-96">
                <LazyLoadImg imgSrc={src} className="object-contain h-80 w-80 mt-6" />
            </DialogContent>
        </Dialog>
    )
}