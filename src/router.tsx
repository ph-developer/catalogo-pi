import { createBrowserRouter } from "react-router-dom";
import {catalogLoader} from '@/loaders/catalog-loader'
import {catalogsLoader} from "@/loaders/catalogs-loader.ts";

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
            },
            {
                path: ':catalogName',
                loader: catalogLoader,
                lazy: async () => ({
                    Component: (await import('@/components/pages/CatalogPage')).default
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
                    Component: (await import('@/components/pages/LoginPage')).default
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
                    Component: (await import('@/components/pages/DashboardPage')).default
                }),
            },
            {
                path: 'catalogs',
                loader: catalogsLoader,
                lazy: async () => ({
                    Component: (await import('@/components/pages/CatalogsPage')).default
                }),
            }
        ]
    }
]);
