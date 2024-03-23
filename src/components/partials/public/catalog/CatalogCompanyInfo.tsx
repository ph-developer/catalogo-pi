import { Icons } from "@/components/ui/icons.tsx"
import { Catalog } from "@/types/catalog"
import { makeWhatsappUrl } from '@/lib/whatsapp.ts'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip.tsx'

interface Props {
    catalog: Catalog
}

export const CatalogCompanyInfo = ({ catalog }: Props) => {
    const openWhatsapp = () => {
        const url = makeWhatsappUrl(catalog.whatsapp)
        window.open(url)
    }

    return (
        <div className="text-justify space-y-1 text-sm" style={catalog ? {
            color: catalog.style.bgTextColor,
        } : {}}>
            <div>
                <span className="font-medium">Empresa: </span>
                <span>{catalog.company}</span>
            </div>
            <div>
                <span className="font-medium">CNPJ: </span>
                <span>{catalog.cnpj.formatCnpj()}</span>
            </div>
            <div>
                <span className="font-medium">Endereço: </span>
                <span>{catalog.address}</span>
            </div>
            <div className="flex items-center">
                <span className="font-medium pr-1">Whatsapp:</span>
                <span className="pr-1.5">{catalog.whatsapp.formatPhone()}</span>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>     
                            <span>                  
                                <Icons.whatsapp
                                    className="w-3.5 h-3.5 cursor-pointer fill-[#25d366]"
                                    onClick={openWhatsapp}
                                />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Chamar no WhatsApp</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}