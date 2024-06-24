import {IResponse} from '@/models/response';

const base_url = process.env.NEXT_PUBLIC_API_URL;

const getProductos = async (): Promise<IResponse> => {
    const res = await fetch(`${base_url}/get_productos`);
    const data = await res.json();
    return data;
}

const getProductoById = async (id: number): Promise<IResponse> => {
    const res = await fetch(`${base_url}/get_producto_by_id/${id}`);
    const data = await res.json();
    return data;
}

const buscarProductos = async (nombre: string): Promise<IResponse> => {
    const res = await fetch(`${base_url}/buscar_producto?texto=${nombre}`);
    const data = await res.json();
    return data;
}


export { getProductos, getProductoById, buscarProductos };