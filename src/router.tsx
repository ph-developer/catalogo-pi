import { createBrowserRouter } from "react-router-dom";

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
