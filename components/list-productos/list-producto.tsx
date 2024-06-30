import style from './list-producto.module.css';
import { useRouter } from 'next/navigation';
import { IProducto } from '../../interfaces/producto';
import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";
import { generarSlug } from '@/utils/functions';

interface ListProductoProps {
    productos: IProducto[];
}

const base_url = process.env.NEXT_PUBLIC_API_URL;

export default function ListProductos({ productos }: Readonly<ListProductoProps>) {
    const router = useRouter();
    
    const toDetalle = (producto: IProducto) => {
        let slug = generarSlug(producto.nombre, producto.id);
        router.push(`/productos/${slug}`);
    }
    return (
        <div className={style.list}>
            {productos.map((producto, index) => (
                <Card  shadow="sm" key={index + "p"} isPressable onPress={() => toDetalle(producto)}
                    style={{zIndex: 1, cursor: "pointer"}}
                    >
                    <CardBody className="overflow-visible p-0">
                        <Image
                        shadow="sm"
                        radius="lg"
                        width="100%"
                        alt={producto.nombre}
                        className="w-full object-cover"
                        src={`${base_url}/${producto.imagenes[0].img_url}`}
                        />
                    </CardBody>
                    <CardFooter className={style.footer_card + " text-medium justify-between"}>
                        <b>{producto.nombre}</b>
                        <p className="text-default-500">{`${producto.precio} Bs.`}</p>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}