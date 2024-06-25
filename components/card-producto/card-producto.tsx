"use client";
import style from './card-producto.module.css'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getIdBySlug, generarSlug } from '@/utils/functions'
import { getProductoById, getProductos } from '@/services/producto-service'
import { insertItemCarrito } from '@/services/carrito-service'
import { getUserByToken } from "@/services/usuario-service";

import {Button, CircularProgress} from "@nextui-org/react";
import { FaPlus, FaMinus, FaShoppingCart  } from "react-icons/fa";
import { toast } from 'react-toastify';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const base_url = process.env.NEXT_PUBLIC_API_URL

export default function CardProducto() {

    const { slug } = useParams()
    const id = getIdBySlug(slug)
    const [isLoading, setIsLoading] = useState(true)
    const [producto, setProducto] = useState(null)
    const [areUser, setAreUser] = useState(false)
    const [cantidad, setCantidad] = useState(1)
    const [images, setImages] = useState([])
    const [loadinButtonCart, setLoadingButtonCart] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            let res = await getUserByToken(sessionStorage.getItem("token"))
            if (res.success) {
                setAreUser(true)
            }
            getProductoById(parseInt(id)).then((res) => {
                if (res.success) {
                    setProducto(res.data)
                    setImages(res.data.imagenes.map((imagen) => {
                        return {
                            original: base_url + "/"+ imagen.img_url,
                            thumbnail: base_url+ "/" + imagen.img_url,
                            thumbnailClass : style.thumbnail
                        }
                    }))
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })
        }
        fetchData()
    }, [])

    const onClickAdd = () => {
        setCantidad(cantidad + 1)
    }

    const onClickSub = () => {
        if (cantidad > 1) {
            setCantidad(cantidad - 1)
        }
    }

    const onClickAddCarrito = () => {
        setLoadingButtonCart(true)
        if (!areUser) {
            let carrito = JSON.parse(localStorage.getItem("carrito"))
            if (carrito === null || carrito === undefined || carrito.length === 0) {
                carrito = {
                    items: [
                        {
                            cantidad: cantidad,
                            fk_producto: parseInt(id),
                            producto : {
                                nombre: producto.nombre,
                                precio: producto.precio,
                                descripcion: producto.descripcion,
                                peso: producto.peso,
                                imagenes: [
                                    producto.imagenes[0]
                                ]
                            }
                        }
                    ]
                }
                localStorage.setItem("carrito", JSON.stringify(carrito))
            }else{
                let hayElProducto = carrito.items.find((item) => item.fk_producto === parseInt(id))
                if (hayElProducto !== undefined) {
                    carrito.items.map((item) => {
                        if (item.fk_producto === parseInt(id)) {
                            item.cantidad += cantidad
                        }
                        return item
                    })
                }else{
                    carrito.items.push({
                        cantidad: cantidad,
                        fk_producto: parseInt(id),
                        producto : {
                            nombre: producto.nombre,
                            precio: producto.precio,
                            descripcion: producto.descripcion,
                            peso: producto.peso,
                            imagenes: [
                                producto.imagenes[0]
                            ]
                        }
                    })
                }
                localStorage.setItem("carrito", JSON.stringify(carrito))
            }
            showToast("Producto agregado al carrito", "success")
            setLoadingButtonCart(false)
            return;
        }else{
            let usuario = JSON.parse(sessionStorage.getItem("usuario"))

            insertItemCarrito(usuario.fk_carrito, parseInt(id), cantidad).then((res) => {
                if (res.success) {
                    showToast("Producto agregado al carrito", "success")
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoadingButtonCart(false)
            })
        }
    }

    const showToast = (message: string, type: string) => {
        return toast(message, {
            type: type,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };


    return (
        <>
            {
                isLoading ? (
                    <div className="flex justify-center gap-4 min_height padding-main separation_to_top">
                        <CircularProgress color="danger" label="Cargando..." />
                    </div>
                ):(
                    <div className={style.container + " padding-main separation_to_top"}>
                        <ImageGallery
                            additionalClass = {style.galeria}
                            items={images}
                            showPlayButton={false}
                            showFullscreenButton={false}
                            infinite={false}
                            showNav={false}
                        />
                        
                        
                        <div className={style.info}>
                            <h1>{producto?.nombre}</h1>
                            <p>{producto?.descripcion}</p>
                            <div>
                                <p className={style.sub_tittle} >Precio</p>
                                <p className={style.sub_tittle_value}>{producto?.precio} Bs.</p>
                                <p className ={style.sub_tittle} >Stock</p>
                                <p className={style.sub_tittle_value} >{producto?.stock} ud.</p>
                                <p className ={style.sub_tittle} >Peso</p>
                                <p className={style.sub_tittle_value} >{producto?.peso} gr.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button className={style.actions} isIconOnly color="danger" onPress={onClickSub}>
                                    <FaMinus className={style.icon} />
                                </Button>
                                <span className ={style.cantidad} >{cantidad}</span>
                                <Button className={style.actions} isIconOnly color="danger" onPress={onClickAdd}>
                                    <FaPlus className={style.icon} />
                                </Button>
                            </div>
                            
                            <Button isLoading={loadinButtonCart} startContent={<FaShoppingCart className={style.icon} />} 
                                onPress={onClickAddCarrito}
                                className={style.buton_cart} size="large">
                                    Agregar al carrito
                                </Button>
                        </div>
                    </div>
                )
            }
        </>
    )
}