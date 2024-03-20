import {ChangeEventHandler, useRef, useState} from "react";
import {colors} from "@/lib/colors.ts";
import {cn} from "@/lib/utils.ts";
import {Icons} from "@/components/ui/icons.tsx";

interface Props {
    id?: string
    onSelectImage: (image: string, dominantColor: string|null) => Promise<void>|void
    disabled?: boolean
    className?: string
}

export const ImgInput = ({id, onSelectImage, disabled = false, className = 'h-48'}: Props) => {
    const inputRef = useRef<HTMLInputElement|null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const selectImage = () => {
        inputRef.current?.click()
    }

    const onChangeImage: ChangeEventHandler<HTMLInputElement> = async (e) => {
        setIsLoading(true)
        const file = e.target.files?.item(0) || null
        if (file) {
            const fileUrl = '' + URL.createObjectURL(file)
            const dominantColor = await colors.getDominantColor(fileUrl)
            if (inputRef.current) inputRef.current.value = ''
            await onSelectImage(fileUrl, dominantColor)
        }
        setIsLoading(false)
    }

    return (
        <>
            <input
                id={id}
                className="hidden"
                ref={inputRef}
                type="file"
                accept="image/*"
                disabled={disabled}
                onChange={onChangeImage}
            />

            <div className={cn(
                className,
                'flex flex-col items-center justify-center',
                'border rounded-md border-indigo-500 border-dashed bg-indigo-50'
            )}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                        <Icons.loader className="animate-spin stroke-indigo-500 w-8 h-8"/>
                        <div className="text-sm font-semibold text-indigo-500 mt-2">Carregando...</div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center cursor-pointer w-full h-full rounded-md" onClick={selectImage}>
                        <Icons.image className="w-8 h-8 stroke-indigo-500"/>
                        <div className="text-sm font-semibold text-indigo-500 mt-2">Selecionar imagem...</div>
                    </div>
                )}
            </div>
        </>
    )
}