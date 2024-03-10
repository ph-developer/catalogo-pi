import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { SelectLocationDialog } from '@/components/dialogs/SelectLocationDialog'
import { useState } from 'react'

const Home = () => {
    const [city, setCity] = useState<string | null>(null)

    return (
        <>
            <header className='sticky top-0 z-50 w-full p-2 flex items-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                <SelectLocationDialog onChangeCity={setCity}>
                    <Button variant="ghost">
                        <Icons.mapPin className='h-4 w-4 mr-2' />
                        {city || 'Selecionar Cidade'}
                    </Button>
                </SelectLocationDialog>

                <Button variant="ghost" className='ml-auto'>
                    <Icons.login className='h-4 w-4 mr-2'/>
                    Entrar
                </Button>
            </header>
            <section className='p-2'>
                Home Page
            </section>
        </>
    )
}

export default Home