import LoginComponent from '@/components/login/login';

export function generateMetadata() {
    let title = `Iniciar Sesión`;
    return {
        title : title,
        description: `Inicia sesión en Horneatitos para poder realizar tus compras`,
        url : `https://horneatitos.shop/login`,
        alternates : {
            canonical: `https://horneratitos.shop/login`
        },
        openGraph: {
            title: title + " | Horneatitos",
            description: `Inicia sesión en Horneatitos para poder realizar tus compras`,
            url: `https://horneatitos.shop/login`,
            siteName: "Horneatitos",
            images: [
                {
                    url: "https://horneatitos.shop/api/public/imagenes/productos/horneatito.jpg",
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

export default function LoginPage() {
    return (
        <LoginComponent />
    )
}