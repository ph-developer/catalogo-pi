import { createBrowserRouter } from "react-router-dom";
import {catalogAnalyticsLoader} from "@/loaders/catalog-analytics-loader.ts";
import {productAnalyticsLoader} from "@/loaders/product-analytics-loader.ts";

export const router = createBrowserRouter([
    {
        path: '',
        lazy: async () => ({
            Component: (await import('@/components/layouts/PublicLayout.tsx')).default
        }),
        children: [
            {
                path: '',
                lazy: async () => ({
                    Component: (await import('@/components/pages/public/HomePage.tsx')).default
                }),
            },
            {
                path: ':catalogUrl',
                loader: catalogAnalyticsLoader,
                lazy: async () => ({
                    Component: (await import('@/components/pages/public/CatalogPage.tsx')).default
                })
            },
            {
                path: ':catalogUrl/:productId',
                loader: productAnalyticsLoader,
                lazy: async () => ({
                    Component: (await import('@/components/pages/public/ProductPage.tsx')).default
                })
            }
        ]
    },
    {
        path: '',
        lazy: async () => ({
            Component: (await import('@/components/layouts/GuestLayout')).default
        }),
        children: [
            {
                path: 'login',
                lazy: async () => ({
                    Component: (await import('@/components/pages/auth/LoginPage.tsx')).default
                })
            },
            {
                path: 'register',
                lazy: async () => ({
                    Component: (await import('@/components/pages/auth/RegisterPage.tsx')).default
                })
            },
        ]
    },
    {
        path: '/dash',
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
                lazy: async () => ({
                    Component: (await import('@/components/pages/dashboard/CatalogsPage.tsx')).default
                }),
            },
            {
                path: 'catalogs/:catalogId',
                lazy: async () => ({
                    Component: (await import('@/components/pages/dashboard/CatalogPage.tsx')).default
                })
            }
        ]
    }
]);
