import {cn} from '@/lib/utils'
import { useState } from 'react'
import { Skeleton } from './skeleton'
import { storage } from '@/lib/firebase'
import { getDownloadURL, ref } from 'firebase/storage'
import { useMount } from '@/hooks/use-mount'

interface Props {
    path: string
    className?: string
    onIsLoaded?: () => void
}

export const FirebaseLazyLoadImg = ({ path, onIsLoaded, className = '' }: Props) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [src, setSrc] = useState<string | null>(null)

    useMount(() => {
        getSrc()
    })

    const getSrc = async () => {
        const photoRef = ref(storage, path)
        const src = await getDownloadURL(photoRef)
        setSrc(src)
    }

    const onLoad = () => {
        setIsLoaded(true)
        onIsLoaded?.()
    }

    return (
        <div>
            {!!src && (
                <img 
                className={cn(
                    className,
                    {'h-0': !isLoaded}
                )} 
                onLoad={onLoad}
                src={src} 
                alt="" 
                />
            )}
            {!isLoaded && (
                <Skeleton className={cn(className)} />
            )}
        </div>
    )
}