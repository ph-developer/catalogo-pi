import {useBgColor} from "@/hooks/use-bg-color.ts";
import {usePageTitle} from "@/hooks/use-page-title.ts";
import {Icons} from "@/components/ui/icons.tsx";
import {ExampleChart} from "@/components/partials/public/home/ExampleChart.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import exampleDesktopPage from '@/assets/example-desktop-page.png'

const HomePage = () => {
    useBgColor()
    usePageTitle()

    return (
        <section>
            <div className="flex flex-wrap pt-6 container mx-auto">
                <div className="flex flex-wrap justify-center items-center w-full">
                    <div className="flex items-center justify-center p-6 w-full md:w-1/2 min-h-96">
                        <div className="flex flex-col w-fit">
                            <p className="text-5xl font-semibold">Crie seu catálogo virtual gratuito</p>
                            <p className="mt-4 font-light text-justify">Plataforma simples e prática para sua empresa</p>
                            <Button className="mt-2 w-fit" asChild>
                                <Link to="/register">Cadastre-se</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center p-2 w-full md:w-1/2 min-h-96">
                        <div className="border rounded-xl shadow-md overflow-hidden py-[1px]">
                            <img src={exampleDesktopPage} alt="Página de exemplo (desktop)"/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col p-2 py-10 w-full">
                    <div className="flex flex-col items-center justify-center w-full pb-4">
                        <p className="text-xl font-semibold">Monte seu catálogo com</p>
                        <p className="text-xl font-semibold text-indigo-500">facilmente e simplicidade</p>
                    </div>
                    <div className="flex flex-wrap w-full space-y-2 sm:space-y-0">
                        <div className="flex flex-col items-center w-full sm:w-1/2">
                            <div className="flex flex-col items-center max-w-56">
                                <div>
                                    <Icons.tags className="h-10 w-10 stroke-indigo-500"/>
                                </div>
                                <div className="font-semibold text-indigo-500">Facilidade</div>
                                <div className="text-sm text-center">
                                    Cadastre diversos catálogos, produtos e categorias
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-full sm:w-1/2">
                            <div className="flex flex-col items-center max-w-56">
                                <div>
                                    <Icons.dash className="h-10 w-10 stroke-indigo-500"/>
                                </div>
                                <div className="font-semibold text-indigo-500">Insights</div>
                                <div className="text-sm text-center">
                                    Obtenha relatórios diversificados em tempo real
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center items-center w-full">
                    <div className="flex items-center justify-center py-2 w-full md:w-1/2 h-96">
                        <ExampleChart />
                    </div>
                    <div className="flex items-center justify-center p-6 w-full md:w-1/2 h-96">
                        <div className="flex flex-col w-fit">
                            <p className="text-2xl font-semibold">Contador de visitas</p>
                            <p className="font-light text-justify">
                                Obtenha insights para melhoras tomadas de decisão sabendo quais catálogos e quais
                                produtos seus clientes mais visitam.
                            </p>
                            <p className="font-light text-justify">
                                Acompanhe os acessos aos seus catálogos e produtos com gráficos em tempo real de
                                visualizações, visitantes, e mais, sem necessidade de configurações extras, e sem
                                custos.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col p-10 w-full">
                    <div className="flex flex-col items-center justify-center w-full pb-4">
                        <p className="text-xl font-semibold">Nossas funcionalidades</p>
                    </div>
                    <div className="flex flex-wrap w-full pb-4">
                        <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-2">
                            <div className="flex flex-col items-center max-w-56">
                                <div>
                                    <Icons.layers className="h-6 w-6 stroke-indigo-500"/>
                                </div>
                                <div className="text-sm text-center font-semibold">
                                    Múltiplos catálogos
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-2">
                            <div className="flex flex-col items-center max-w-56">
                                <div>
                                    <Icons.tags className="h-6 w-6 stroke-indigo-500"/>
                                </div>
                                <div className="text-sm text-center font-semibold">
                                    Produtos e categorias personalizados
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-2">
                            <div className="flex flex-col items-center max-w-56">
                                <div>
                                    <Icons.palette className="h-6 w-6 stroke-indigo-500"/>
                                </div>
                                <div className="text-sm text-center font-semibold">
                                    Tema e layout customizados
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-2">
                            <div className="flex flex-col items-center max-w-56">
                                <div>
                                    <Icons.eye className="h-6 w-6 stroke-indigo-500"/>
                                </div>
                                <div className="text-sm text-center font-semibold">
                                    Visualização sem cadastro
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap w-full space-y-2 sm:space-y-0">
                        <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-2">
                            <div className="flex flex-col items-center max-w-56">
                                <div>
                                    <Icons.qrCode className="h-6 w-6 stroke-indigo-500"/>
                                </div>
                                <div className="text-sm text-center font-semibold">
                                    Geração de QRCode
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-2">
                            <div className="flex flex-col items-center max-w-56">
                                <div>
                                    <Icons.lineChart className="h-6 w-6 stroke-indigo-500"/>
                                </div>
                                <div className="text-sm text-center font-semibold">
                                    Múltiplos gráficos
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-2">
                            <div className="flex flex-col items-center max-w-56">
                                <div>
                                    <Icons.whatsapp className="h-6 w-6 fill-indigo-500"/>
                                </div>
                                <div className="text-sm text-center font-semibold">
                                    Conversa via WhatsApp
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-2">
                            <div className="flex flex-col items-center max-w-56">
                                <div>
                                    <Icons.dollarSign className="h-6 w-6 stroke-indigo-500"/>
                                </div>
                                <div className="text-sm text-center font-semibold">
                                    Totalmente gratuito
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomePage