import { ReactElement, useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getCurrentCity } from '@/lib/l18n'

interface Props {
    children: ReactElement,
    onChangeCity: (city: string | null) => void
}

export const SelectLocationDialog = ({ children, onChangeCity }: Props) => {
    const [city, setCity] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        getCurrentLocation()
    }, [])

    useEffect(() => {
        onChangeCity(city)
    }, [city, onChangeCity])

    const getCurrentLocation = async () => {
        setIsLoading(true)
        try {
            const currentCity = await getCurrentCity()
            sessionStorage.removeItem('location')
            setCity(currentCity)
            setIsOpen(false)
        } catch (error) {
            const currentCity = sessionStorage.getItem('location')
            setCity(currentCity)
            setIsOpen(!currentCity)
        }
        setIsLoading(false)
    }

    const setManualLocation = (currentCity: string) => {
        sessionStorage.setItem('location', currentCity)
        setCity(currentCity)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Selecionar Cidade</DialogTitle>
                    <DialogDescription>
                        Selecione sua cidade para uma melhor experiência.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <DialogClose asChild>
                        <Button onClick={() => setManualLocation('Penápolis')} disabled={isLoading}>
                            Penápolis
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}