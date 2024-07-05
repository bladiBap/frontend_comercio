import {IResponse} from '@/models/response';

const base_url = process.env.NEXT_PUBLIC_API_URL;

const getCarritoById = async (id: number): Promise<IResponse> => {
    const res = await fetch(`${base_url}/carrito/${id}`);
    const data = await res.json();
    return data;
}

const insertItemCarrito = async (fk_carrito: number, fk_producto: number, cantidad: number): Promise<IResponse> => {
    const res = await fetch(`${base_url}/carrito-item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({fk_carrito: fk_carrito, fk_producto: fk_producto, cantidad: cantidad})
    });
    const data = await res.json();
    return data;
}

const updateItemCarrito = async (id_item: number, cantidad: number): Promise<IResponse> => {
    const res = await fetch(`${base_url}/carrito-item/${id_item}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cantidad: cantidad})
    });
    const data = await res.json();
    return data;
}

const deleteItemCarrito = async (id_item: number): Promise<IResponse> => {
    const res = await fetch(`${base_url}/carrito-item/${id_item}`, {
        method: 'DELETE',
    });
    const data = await res.json();
    return data;
}

const sincronizarCarrito = async (items: any, fk_carrito: number): Promise<IResponse> => {
    const res = await fetch(`${base_url}/sincronizar_carrito`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({items: items, fk_carrito: fk_carrito})
    });
    const data = await res.json();
    return data;
}

const checkOut = async (
    is_delivery: boolean,
    fk_carrito: number,
): Promise<IResponse> => {
    const res = await fetch(`${base_url}/check_out`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({is_delivery: is_delivery, fk_carrito: fk_carrito})
    });
    const data = await res.json();
    return data;
}

const crearPedido = async (fk_carrito: number, esdelivery: boolean, nombre: string, direccion: string, correo: string): Promise<IResponse> => {
    let token = sessionStorage.getItem('token');
    const res = await fetch(`${base_url}/create_pedido`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fk_carrito: fk_carrito,
            esdelivery: esdelivery,
            nombre: nombre,
            direccion: direccion,
            correo: correo
        })
    });
    const data = await res.json();
    return data;
}



export { getCarritoById, updateItemCarrito, deleteItemCarrito,
    insertItemCarrito, sincronizarCarrito, checkOut, crearPedido
};