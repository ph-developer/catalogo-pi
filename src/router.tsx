import { createBrowserRouter } from "react-router-dom";
import {catalogLoader} from '@/loaders/catalog-loader'
import {catalogsLoader} from "@/loaders/catalogs-loader.ts";

export const router = createBrowserRouter([
    {
        path: '/',
        loader: catalogLoader,
        lazy: async () => ({
            Component: (await import('@/components/layouts/PublicLayout.tsx')).PublicLayout
        }),
        children: [
            {
                path: '',
                lazy: async () => ({
                    Component: (await import('@/components/pages/public/HomePage.tsx')).default
                }),
            },
            {
                path: ':catalogName',
                loader: catalogLoader,
                lazy: async () => ({
                    Component: (await import('@/components/pages/public/CatalogPage.tsx')).default
                })
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
                    Component: (await import('@/components/pages/auth/LoginPage.tsx')).default
                })
            },
        ]
    },
    {
        path: '/dash',
        loader: catalogsLoader,
        lazy: async () => ({
            Component: (await import('@/components/layouts/AuthLayout')).default
        }),
        children: [
            {
                path: '',
                lazy: async () => ({
                    Component: (await import('@/components/pages/dashboard/DashboardPage.tsx')).default
                }),
            },
            {
                path: 'catalogs',
                loader: catalogsLoader,
                lazy: async () => ({
                    Component: (await import('@/components/pages/dashboard/CatalogsPage.tsx')).default
                }),
            }
        ]
    }
]);
