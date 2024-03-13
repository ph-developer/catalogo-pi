import { createBrowserRouter } from "react-router-dom";


export const router = createBrowserRouter([
    {
        path: '/',
        lazy: async () => ({
            Component: (await import('@/components/layouts/CatalogLayout')).default
        }),
        children: [
            {
                path: '',
                lazy: async () => ({
                    Component: (await import('@/components/pages/HomePage')).default
                }),
            }
        ]
    },
    {
        path: '/login',
        lazy: async () => ({
            Component: (await import('@/components/layouts/GuestLayout')).default
        }),
        children: [
            {
                path: '',
                lazy: async () => ({
                    Component: (await import('@/components/pages/LoginPage')).default
                })
            },
        ]
    },
    {
        path: '/painel',
        lazy: async () => ({
            Component: (await import('@/components/layouts/AuthLayout')).default
        }),
        children: [
            {
                path: '',
                lazy: async () => ({
                    Component: (await import('@/components/pages/PainelPage')).default
                }),
            }
        ]
    }
]);
