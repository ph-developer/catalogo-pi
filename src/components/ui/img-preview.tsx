import {useState} from "react";
import {useMount} from "@/hooks/use-mount.tsx";
import {cn} from "@/lib/utils.ts";
import {Icons} from "@/components/ui/icons.tsx";

interface Props {
    imgSrc?: string | (() => Promise<string>)
    className?: string
    closeable?: boolean
    onClose?: () => void
}

export const ImgPreview = ({imgSrc, className, closeable = false, onClose}: Props) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [src, setSrc] = useState<string | null>(null)

    useMount(() => {
        if (typeof imgSrc === 'string') {
            setSrc(imgSrc)
        } else if (typeof imgSrc === 'function') {
            imgSrc().then(setSrc)
        }
    })

    const onLoad = () => {
        setIsLoaded(true)
    }

    return (
        <div className={cn(
            className,
            'border rounded-md border-dashed overflow-hidden',
            {
                'relative': isLoaded,
                'border-slate-500 bg-slate-50': isLoaded,
                'border-indigo-500 bg-indigo-50': !isLoaded
            },
        )}>
            {closeable && isLoaded && (
                <Icons.x onClick={onClose} className="absolute cursor-pointer right-0.5 top-0.5 stroke-destructive"/>
            )}
            <div className='flex flex-col h-full w-full items-center justify-center'>
                {!isLoaded && (
                    <div className="flex flex-col items-center justify-center">
                        <Icons.loader className="animate-spin stroke-indigo-500 w-8 h-8"/>
                        <div className="text-sm font-semibold text-indigo-500 mt-2">Carregando...</div>
                    </div>
                )}
                {!!src && (
                    <img
                        className={cn(
                            className,
                            {'h-0 w-0': !isLoaded}
                        )}
                        onLoad={onLoad}
                        src={src}
                        alt=""
                    />
                )}
            </div>
        </div>
    )
}