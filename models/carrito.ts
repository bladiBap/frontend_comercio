import { IProducto } from './producto';

export interface ICarrito {
    id:         number;
    fk_usuario: number;
    createdAt:  Date;
    updatedAt:  Date;
    items:      Item[];
}

export interface Item {
    id:          number;
    fk_carrito:  number;
    fk_producto: number;
    cantidad:    number;
    createdAt:   Date;
    updatedAt:   Date;
    producto:    IProducto;
}