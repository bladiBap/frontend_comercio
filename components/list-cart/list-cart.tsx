import style from './list-cart.module.css';
import Image from "next/image";
import { useState } from 'react';
import { Item } from '@/models/ICarrito';
import {Button} from "@nextui-org/react";
import { FaPlus, FaMinus} from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import {updateItemCarrito, deleteItemCarrito} from '@/services/carrito-service';

interface IProps {
    items : Item[];
    onUpdateCarrito : (items : Item[]) => void;
    areUser : boolean;
}

const base_url = process.env.NEXT_PUBLIC_API_URL;

export default function ListCart({items, onUpdateCarrito, areUser} : IProps) {

    const [itemsCarrito, setItemsCarrito] = useState<Item[]>(items);
    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [isLoadingSub, setIsLoadingSub] = useState(false);
    const [isLoadingDel, setIsLoadingDel] = useState(false);

    const onClickAdd = (item : Item) => () => {
        setIsLoadingAdd(true);
        if (areUser === false) {
            operationCarritoLocal(item, "add");
            setIsLoadingAdd(false);
            return;
        }
        updateItemCarrito(item.id, item.cantidad + 1).then((response) => {
            if(response.success){
                setItemsCarrito(itemsCarrito.map((i) => {
                    if(i.id === item.id){
                        i.cantidad += 1;
                    }
                    return i;
                }));
                onUpdateCarrito(itemsCarrito);
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setIsLoadingAdd(false);
        });
    }

    const onClickSub = (item : Item) => () => {
        if(item.cantidad > 1){
            setIsLoadingSub(true);

            if (areUser === false) {
                operationCarritoLocal(item, "sub");
                setIsLoadingSub(false);
                return;
            }

            updateItemCarrito(item.id, item.cantidad - 1).then((response) => {
                if(response.success){
                    setItemsCarrito(itemsCarrito.map((i) => {
                        if(i.id === item.id){
                            i.cantidad -= 1;
                        }
                        return i;
                    }));
                    onUpdateCarrito(itemsCarrito);
                }
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setIsLoadingSub(false);
            });
        }
    }

    const onClickDel = (item : Item) => () => {
        setIsLoadingDel(true);

        if (areUser === false) {
            operationCarritoLocal(item, "del");
            setIsLoadingDel(false);
            return;
        }

        deleteItemCarrito(item.id).then((response) => {
            if(response.success){
                let carritoAux = itemsCarrito.filter((i) => i.id !== item.id);
                setItemsCarrito(carritoAux);
                onUpdateCarrito(carritoAux);
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setIsLoadingDel(false);
        });
    }

    const operationCarritoLocal = (item, operation) => {
        let carrito = JSON.parse(localStorage.getItem("carrito" || "{}"));
        if (carrito.items.length > 0) {
            let index = carrito.items.findIndex((i) => i.fk_producto === item.fk_producto);
            if (index !== -1) {
                switch (operation) {
                    case "add":
                        carrito.items[index].cantidad += 1;
                        break;
                    case "sub":
                        carrito.items[index].cantidad -= 1;
                        break;
                    case "del":
                        carrito.items.splice(index, 1);
                        break;
                }
            }
            setItemsCarrito(carrito.items);
        }else{
            carrito = [];
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        onUpdateCarrito(carrito.items);
    }

    return (
        <div className={style.cart_list}>
            {itemsCarrito.map((item) => (
                <div key={item.fk_producto + "b"} className={style.item}>
                    <Image
                        className={style.item_image}
                        src={`${base_url}/${item.producto.imagenes[0].img_url}`} 
                        alt="Logo"
                        width={100}
                        height={100}
                        unoptimized
                        priority={true}
                    />
                    <div className={style.item_content}>
                        <div className={style.item_info}>
                            <h3>{item.producto.nombre}</h3>
                            <p>{"Precio: "+item.producto.precio + " Bs"}</p>
                        </div>

                        <div className={style.item_options}>
                            <Button isLoading={isLoadingSub} className={style.actions} isIconOnly color="danger" onPress={onClickSub(item)} >
                                <FaMinus className={style.icon} />
                            </Button>
                            <span className ={style.cantidad} >{item.cantidad}</span>
                            <Button isLoading={isLoadingAdd} className={style.actions} isIconOnly color="danger" onPress={onClickAdd(item)}>
                                <FaPlus className={style.icon} />
                            </Button>
                            <Button isLoading={isLoadingDel} className={style.buton_del} isIconOnly onPress={onClickDel(item)}>
                                <MdDeleteOutline className={style.icon_del} />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}