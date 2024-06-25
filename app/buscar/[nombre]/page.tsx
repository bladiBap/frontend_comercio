import BuscarList from '@/components/buscar-list/buscar-list';

export function generateMetadata({ params }: any) {
    const nombre = decodeURIComponent(params.nombre);
    let title = `Buscando ${nombre}`;

    return {
        title : title,
        description: `Busca productos relacionados con ${nombre}`,
        url : `https://horneatitos.shop/buscar/${nombre}`,
        alternates : {
            canonical: `https://horneatitos.shop/buscar/${nombre}`
        },
        openGraph: {
            title: title + " | Horneatitos",
            description: `Busca productos relacionados con ${nombre}`,
            url: `https://horneatitos.shop/buscar/${nombre}`,
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
        keywords : ["Horneatitos", "Panaderia", "Pan", "Bizcocho", "Bizcocho de maiz","Cuñape", 
            "Cuñape abizcochado", "Jallula","Comercio electronico", "Tienda online", "Tienda virtual", 
            "Tienda de pan","Panaderia Artesanal", "Panaderia Ecologica", "Panaderia Tradicional", 
            "Panaderia Responsable", "Panaderia Sostenible", "Panaderia Ecológica"]
    }
}



export default function Buscador ({params}: any) {

    return (
        <BuscarList params={params} />
    )
}