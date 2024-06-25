import CardProducto from '@/components/card-producto/card-producto'
import { getIdBySlug, generarSlug } from '@/utils/functions'
import { getProductoById, getProductos } from '@/services/producto-service'

const base_url = process.env.NEXT_PUBLIC_API_URL

export const getStaticPaths = async () => {
    const res = await getProductos();
    const productos = res.data;
    const paths = productos.map((producto) => ({
        params: { slug: generarSlug(producto.nombre, producto.id) },
    }));
    return { paths, fallback: true };
}

export async function generateMetadata({ params }: any) {
    const slug = params.slug as string;
    const id = getIdBySlug(slug);
    const res = await getProductoById(parseInt(id!));
    const producto = res.data;
    if (res.success === false){
        return {
            title: "Producto no encontrado",
        }
    }

    let tituloArray = producto.nombre.split(" ");
    tituloArray = tituloArray.filter((palabra) => palabra !== '');
    const palabrasExcluir = ['de', 'la', 'el', 'en', 'y', 'a', 'con', 'para', 'por', 'del', 'los', 'las', 'un', 'una', 'unos', 'unas', 'al', 'lo', 'su', 'sus', 'es', 'este', 'esta', 'esto', 'estos', 'estas', 'no', 'da', 'que', 'como', 'cuando', 'donde', 'quien', 'cual'];
    let keyWordsTitulo = tituloArray.filter((palabra) => !palabrasExcluir.includes(palabra.toLowerCase()));
    return {
        title: producto.nombre,
        description: producto.descripcion,
        url : "https://horneatitos.shop/productos/" + slug,
        alternates: {
            canonical: "https://horneatitos.shop/productos/" + slug,
        },
        openGraph: {
            title: producto.nombre + " | Horneatitos",
            description: producto.descripcion,
            url: "https://horneatitos.shop/productos/" + slug,
            siteName: "Horneatitos",
            images: [
                {
                    url: "https://horneatitos.shop/api/" + producto.imagenes[0].img_url,
                    width: 800,
                    height: 600,
                    alt: producto.nombre,
                },
            ],
            locale: "es_BO",
            type: "website",
        },
        keywords: keyWordsTitulo,
        image: "https://horneatitos.shop/api/" + producto.imagenes[0].img_url,
    }
}

export default function DetalleProducto () {
    
    return (
        <>
            <CardProducto /> 
        </>
    )
}