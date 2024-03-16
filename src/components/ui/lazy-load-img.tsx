import {cn} from '@/lib/utils'
import {useState} from 'react'
import {Skeleton} from './skeleton'
import {useMount} from '@/hooks/use-mount'

interface Props {
    imgSrc?: string|(() => Promise<string>)
    className?: string
    onIsLoaded?: () => void
}

export const LazyLoadImg = ({imgSrc, onIsLoaded, className = ''}: Props) => {
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
                <Skeleton className={cn(className)}/>
            )}
        </div>
    )
}