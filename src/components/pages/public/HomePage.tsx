import {useBgColor} from "@/hooks/use-bg-color.ts";
import {usePageTitle} from "@/hooks/use-page-title.ts";
import {Icons} from "@/components/ui/icons.tsx";
import {ExampleChart} from "@/components/partials/public/home/ExampleChart.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import exampleDesktopPage from '@/assets/example-desktop-page.png'
import exampleMobilePage from '@/assets/example-mobile-page.png'
import ReactFullPage from '@fullpage/react-fullpage';
import {useMount} from "@/hooks/use-mount.tsx";

const HomePage = () => {
    useBgColor()
    usePageTitle()

    useMount(() => console.clear())

    return (
        <>
            <ReactFullPage
                licenseKey="gplv3-license"
                scrollingSpeed={1000}
                credits={{enabled: true, label: 'made with fullpage.js', position: 'right'}}
                navigation
                render={() => (
                    <ReactFullPage.Wrapper>
                        <section className="section">
                            <div className="flex flex-wrap container justify-center items-center w-full mb-28">
                                <div className="flex items-center justify-center w-full md:w-1/2 md:pr-6">
                                    <div className="flex flex-col w-fit">
                                        <p className="text-4xl md:text-5xl font-semibold">
                                            Crie seu catálogo virtual gratuito
                                        </p>
                                        <p className="mt-4 font-light text-justify">
                                            Plataforma simples e prática para sua empresa
                                        </p>
                                        <Button className="mt-2 w-fit" asChild>
                                            <Link to="/register">Cadastre-se</Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className="relative flex items-center justify-center w-full md:w-1/2 mt-12 md:mt-0">
                                    <div className="border rounded-xl shadow-md overflow-hidden py-[1px]">
                                        <img src={exampleDesktopPage} alt="Página de exemplo (desktop)"/>
                                    </div>
                                    <div
                                        className="absolute border rounded-xl shadow-md overflow-hidden py-[1px] right-4 -bottom-2"
                                    >
                                        <img
                                            src={exampleMobilePage}
                                            alt="Página de exemplo (mobile)"
                                            className="h-52 sm:h-72 md:h-64 lg:h-72 xl:h-80"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="section">
                            <div
                                className="flex flex-wrap justify-center items-center container w-full mb-28">
                                <div className="flex items-center justify-center w-full md:w-1/2 h-72 md:h-96">
                                    <ExampleChart/>
                                </div>

                                <div className="flex items-center justify-center w-full md:w-1/2 mt-12 md:mt-0 md:pl-6">
                                    <div className="flex flex-col w-fit">
                                        <p className="text-2xl font-semibold">Contador de visitas</p>
                                        <p className="font-light text-justify">
                                            Obtenha insights para melhoras tomadas de decisão sabendo quais catálogos e
                                            quais produtos seus clientes mais visitam.
                                        </p>
                                        <p className="font-light text-justify">
                                            Acompanhe os acessos aos seus catálogos e produtos com gráficos em tempo
                                            real de visualizações, visitantes, e mais, sem necessidade de configurações
                                            extras, e sem custos.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="section">
                            <div className="flex flex-wrap container justify-center items-center w-full mb-28">
                                <div className="flex flex-col items-center justify-center w-full mb-4">
                                    <p className="text-xl font-semibold">Monte seu catálogo de forma</p>
                                    <p className="text-xl font-semibold text-indigo-500">fácil e prática</p>
                                </div>

                                <div className="flex flex-wrap w-full space-y-2 sm:space-y-0">
                                    <div className="flex flex-col items-center w-1/2">
                                        <div className="flex flex-col items-center max-w-56">
                                            <div>
                                                <Icons.tags className="h-10 w-10 stroke-indigo-500"/>
                                            </div>
                                            <div className="mt-2 font-semibold text-indigo-500">Flexível</div>
                                            <div className="text-sm text-center">
                                                Cadastre diversos catálogos, produtos e categorias
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center w-1/2">
                                        <div className="flex flex-col items-center max-w-56">
                                            <div>
                                                <Icons.dash className="h-10 w-10 stroke-indigo-500"/>
                                            </div>
                                            <div className="mt-2 font-semibold text-indigo-500">Insights</div>
                                            <div className="text-sm text-center">
                                                Obtenha relatórios diversificados em tempo real
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center w-full mt-12 mb-4">
                                    <p className="text-xl font-semibold">Nossas funcionalidades</p>
                                </div>

                                <div className="flex flex-wrap w-full">
                                    <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-4">
                                        <div className="flex flex-col items-center max-w-40">
                                            <div>
                                                <Icons.layers className="h-6 w-6 stroke-indigo-500"/>
                                            </div>
                                            <div className="mt-2 text-sm text-center font-semibold">
                                                Múltiplos catálogos, produtos e categorias
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-4">
                                        <div className="flex flex-col items-center w-40">
                                            <div>
                                                <Icons.tags className="h-6 w-6 stroke-indigo-500"/>
                                            </div>
                                            <div className="mt-2 text-sm text-center font-semibold">
                                                Produtos e categorias personalizados
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-4">
                                        <div className="flex flex-col items-center w-40">
                                            <div>
                                                <Icons.palette className="h-6 w-6 stroke-indigo-500"/>
                                            </div>
                                            <div className="mt-2 text-sm text-center font-semibold">
                                                Layout customizavel e responsivo
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-4">
                                        <div className="flex flex-col items-center w-40">
                                            <div>
                                                <Icons.eye className="h-6 w-6 stroke-indigo-500"/>
                                            </div>
                                            <div className="mt-2 text-sm text-center font-semibold">
                                                Visualização sem cadastro
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-4">
                                        <div className="flex flex-col items-center w-40">
                                            <div>
                                                <Icons.qrCode className="h-6 w-6 stroke-indigo-500"/>
                                            </div>
                                            <div className="mt-2 text-sm text-center font-semibold">
                                                Geração de QRCode
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-4">
                                        <div className="flex flex-col items-center w-40">
                                            <div>
                                                <Icons.lineChart className="h-6 w-6 stroke-indigo-500"/>
                                            </div>
                                            <div className="mt-2 text-sm text-center font-semibold">
                                                Múltiplos gráficos
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-4">
                                        <div className="flex flex-col items-center w-40">
                                            <div>
                                                <Icons.whatsapp className="h-6 w-6 fill-indigo-500"/>
                                            </div>
                                            <div className="mt-2 text-sm text-center font-semibold">
                                                Conversa via WhatsApp
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center w-1/2 md:w-1/4 mb-4">
                                        <div className="flex flex-col items-center w-40">
                                            <div>
                                                <Icons.dollarSign className="h-6 w-6 stroke-indigo-500"/>
                                            </div>
                                            <div className="mt-2 text-sm text-center font-semibold">
                                                Totalmente gratuito
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </ReactFullPage.Wrapper>
                )}
            />

            <footer className="sticky bottom-0 z-50 border-t bg-white shadow-sm">
                <div className="flex flex-col w-full items-center justify-center p-1 text-xs text-center">
                    <p>&#169; 2024 - Projeto Integrador em Computação VI (UNIVESP)</p>
                    <p>Turma 001 - DRP12-PJI610-SALA-001 GRUPO-003</p>
                </div>
            </footer>
        </>
    )
}

export default HomePage