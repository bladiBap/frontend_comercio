import ProductosComponent from '@/components/productos/productos';


export const metadata = {
    openGraph: {
        title: "Productos | Horneatitos",
        description: "Conoce todos los productos que tenemos en Horneatitos",
        url: "https://horneatitos.shop/productos",
        siteName: "Horneatitos",
        images: [
            {
                url: "https://horneatitos.shop/api/public/imagenes/logo.png",
                width: 800,
                height: 600,
                alt: "Horneatitos",
            },
        ],
        locale: "es_BO",
        type: "website",
    },
    keywords: ["Horneatitos", "Panaderia", "Pan", "Bizcocho", "Bizcocho de maiz", "Productos Horneatitos"],
    title: "Productos",
    description: "Conoce todos los productos que tenemos en Horneatitos",
}

export default function Productos() {

    return (
        <>
            <ProductosComponent />
        </>
    )
}