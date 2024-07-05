"use client";
import style from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICarrito } from '@/models/ICarrito';
import { getCarritoById, checkOut, crearPedido } from '@/services/carrito-service';
import { getUserByToken } from '@/services/usuario-service';
import { roundToTwoDecimals } from '@/utils/functions';
import { Button, Input, Select, SelectItem, CircularProgress } from "@nextui-org/react";
import { IoStorefrontOutline } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";
import { BiDetail } from "react-icons/bi";
import { MdOutlinePayment } from "react-icons/md";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from 'react-toastify';
import Image from "next/image";
import ListCart from '@/components/list-cart/list-cart';

export default function Carrito() {
    enum TypeOrder {
        TIENDA = 'tienda',
        DOMICILIO = 'domicilio'
    }
    const [loading, setLoading] = useState(true);
    const [areUser, setAreUser] = useState(false);
    const [carrito, setCarrito] = useState<ICarrito>(null);
    const [clickPagar , setClickPagar] = useState(false);
    const [showCart, setShowCart] = useState(true);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [totalPayment, setTotalPayment] = useState(0);
    const [selectedOption, setSelectedOption] = useState<TypeOrder>(TypeOrder.TIENDA);
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [returnFromPayment, setReturnFromPayment] = useState(false);
    const [sucursales, setSucursales] = useState([
        {id: "1", nombre: "Sucursal 1", direccion: "Av. 6 de Agosto", telefono: "7534567"},
        {id: "2", nombre: "Sucursal 2", direccion: "Av. 9 de Pampa", telefono: "7734567"},
        {id: "3", nombre: "Sucursal 3", direccion: "Av. 19 de Septiembre", telefono: "7434567"},
    ]);
    const [sucursalSelected, setSucursalSelected] = useState(new Set(["3"]));

    const router = useRouter();

    const onUpdateCarrito = (items) => {
        setTotalPayment(items.reduce((acc, item) => acc + (item.cantidad * item.producto.precio), 0));
        setCarrito({...carrito, items});
    }

    useEffect (() => {
        const fetchData = async () => {
            let id = 0;
            let res = await getUserByToken(sessionStorage.getItem("token"));
            sessionStorage.setItem("option", "tienda");
            if (res.success){
                setAreUser(true);
                setNombre(res.data.nombre);
                setCorreo(res.data.email);
                setDireccion(res.data.direccion);
                id = res.data.id;
            }
            if (id !== 0){
                getCarritoById(res.data.fk_carrito).then((response) => {
                    if (response.success){
                        setCarrito(response.data);
                        setTotalPayment(response.data.items.reduce((acc, item) => acc + (item.cantidad * item.producto.precio), 0));
                    }
                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                    setLoading(false);
                });
            }else{
                let carrito = JSON.parse(localStorage.getItem("carrito"));
                if (carrito){
                    setCarrito(carrito);
                    setTotalPayment(carrito.items.reduce((acc, item) => acc + (item.cantidad * item.producto.precio), 0));
                }
                setLoading(false);
            }
        }
        fetchData();
    },[]);

    const onContinueShopping = () => {
        router.push("/productos");
    }

    const onCheckout = () => {
        if (!areUser){
            showToast("Debes iniciar sesión para continuar", "error");
            return;
        }
        setShowCheckout(true);
        setShowCart(false);
        setShowPayment(false);
        setReturnFromPayment(false);
        setSelectedOption(TypeOrder.TIENDA);
        scrollToUp();
    }

    const onPayment = () => {
        setClickPagar(true);
        if (!areUser){
            showToast("Debes iniciar sesión para continuar", "error");
            return;
        }

        if (verificarCamposInformacion() === false){
            return;
        }
        let direccionAux = (selectedOption === TypeOrder.DOMICILIO) ? direccion : sucursales.find(sucursal => sucursal.id === sucursalSelected.values().next().value).nombre;
        sessionStorage.setItem("nombre", nombre);
        sessionStorage.setItem("correo", correo);
        sessionStorage.setItem("direccion", direccionAux);
        setShowCheckout(false);
        setShowCart(false);
        setReturnFromPayment(false);
        setShowPayment(true);
        scrollToUp();
    }

    const verificarCamposInformacion = () => {
        if (nombre === "" || correo === ""){
            showToast("Debes rellenar todos los campos", "error");
            return false;
        }
        if (selectedOption === TypeOrder.DOMICILIO && direccion === ""){
            showToast("Debes rellenar todos los campos", "error");
            return false;
        }
        return true
    }

    const returnToCart = () => {
        setShowCheckout(false);
        setShowCart(true);
        setShowPayment(false);
        setReturnFromPayment(false);
        setClickPagar(false);
        setSelectedOption(TypeOrder.TIENDA);
        scrollToUp();
    }

    const returnToCheckout = () => {
        setShowCheckout(true);
        setShowCart(false);
        setShowPayment(false);
        setReturnFromPayment(true);
        setClickPagar(false);
        scrollToUp();
    }

    const onSelectedOption = (option : string) => {
        sessionStorage.setItem("option", option);
        setClickPagar(false);
        setSelectedOption(option);
    }

    const scrollToUp = () => {
        let body = document.getElementById("root");
        body.scrollIntoView({behavior: "smooth"});
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

    const esTextoVacio = (texto: string) => {
        return texto.trim() === "";
    }

    const esCorreoValido = (correo: string) => {
        let re = /\S+@\S+\.\S+/;
        return re.test(correo);
    }

    return (
        <>
            { loading ? (
                    <div className="flex justify-center gap-4 min_height padding-main separation_to_top">
                        <CircularProgress color="danger" label="Cargando..." />
                    </div>
                ) : (
                    <div className={style.container + " min_height padding-main separation_to_top"}>
                        <h2 className={`title_page ${style.show}  ${showCart ? "" : style.hide_cart}`}>Mi carrito</h2>
                        <h2 className={`title_page ${style.back_button} ${style.show}  ${showCheckout ? "" : style.hide_checkout}`}>Orden  
                            <Button isIconOnly onPress={returnToCart}>
                                <IoMdArrowRoundBack/>
                            </Button>
                        </h2>
                        <h2 className={`title_page ${style.back_button} ${style.show}  ${showPayment ? "" : style.hide_checkout}`}>Pago
                            <Button isIconOnly onPress={returnToCheckout}>
                                <IoMdArrowRoundBack/>
                            </Button>
                        </h2>
                        <section className={`${style.container_cart} ${showCart ? "" : style.hide_cart}`}>
                            <div className={style.cart_list}>
                                {carrito && carrito.items.length > 0 && 
                                    <ListCart items={carrito.items} onUpdateCarrito={onUpdateCarrito} areUser={areUser} />}
                                {(carrito === null || (carrito && carrito.items.length === 0)) && 
                                    <div className={style.empty_cart}>
                                        <h2>Carrito vacío</h2>
                                    </div>
                                }
                            </div>
                            {carrito && carrito.items.length > 0 && 
                                <div className={style.info_cart}>
                                    <h2 className="border_botom_gray">Productos</h2>
                                    {carrito && <div>{carrito.items.map((item) =>{
                                        return (
                                        <p key = {item.fk_producto + "a"} className ={style.subtotal_producto}>
                                            {item.producto.nombre} 
                                            <span>{roundToTwoDecimals((item.cantidad * item.producto.precio)) + " Bs"}</span>
                                        </p>)
                                    })}</div>}
                                    <p className={style.subtotal}>
                                        Subtotal <span>
                                            {carrito && roundToTwoDecimals(carrito.items.reduce((acc, item) => acc + (item.cantidad * item.producto.precio), 0)) + " Bs"}
                                        </span>
                                    </p>
                                    <div className={style.buttons+" "+style.font_buttons}>
                                        <Button onPress={onContinueShopping}>
                                            Seguir comprando
                                        </Button>  
                                        <Button onPress={onCheckout}>
                                            Finalizar compra
                                        </Button>
                                    </div>
                                </div>
                            }
                        </section>
                        <section className={`${style.container_checkout} ${showCheckout ? (
                            returnFromPayment ? style.show_checkout_from_payment : ""
                            ) : ( showPayment ? style.hide_checkout_to_left : style.hide_checkout)}`}>
                                <div className={style.option_order}>
                                    <div className={`${style.option} ${ selectedOption === TypeOrder.TIENDA ? style.option_selected : ""}`}>
                                        <h2> <IoStorefrontOutline /> Recoger en la Tienda</h2>
                                        <p>Recoge tu pedido en nuestra tienda. Te enviaremos un correo cuando este listo.</p>
                                        <Button onPress={() => onSelectedOption(TypeOrder.TIENDA)}>
                                            Seleccionar
                                        </Button>
                                    </div>
                                    <div className={`${style.option} ${ selectedOption === TypeOrder.DOMICILIO ? style.option_selected : ""}`}>
                                        <h2> <TbTruckDelivery /> Envío a Domicilio</h2>
                                        <p>Recibe tu pedido en la puerta de tu casa. Te enviaremos un correo cuando este en camino.</p>
                                        <Button onPress={() => onSelectedOption(TypeOrder.DOMICILIO)}>
                                            Seleccionar
                                        </Button>
                                    </div>
                                </div>


                                <div className={style.option_order}>
                                    <div className={style.option}>
                                        <h2> <BiDetail /> Información de la orden</h2>
                                        <p> Revisa los productos de tu orden y rellena los siguientes campos. </p>

                                        <Input type="text" variant='underlined' label="Nombre completo" placeholder="Ingrese su nombre"
                                            value={nombre} onChange={(e) => setNombre(e.target.value)}
                                            isInvalid={(esTextoVacio(nombre) && clickPagar)}
                                            errorMessage = {(esTextoVacio(nombre) && clickPagar) ? "Ingrese un nombre" : ""}
                                        />

                                        <Input type="email" variant='underlined' label="Correo" placeholder="Correo de notificación" 
                                            value={correo} onChange={(e) => setCorreo(e.target.value)}
                                            isInvalid={(!esCorreoValido(correo) && clickPagar)}
                                            errorMessage = {(!esCorreoValido(correo) && clickPagar) ? "Ingrese un correo válido" : ""}
                                        />

                                        <Input className={`${style.show} ${selectedOption === TypeOrder.DOMICILIO ? "" : style.hide_address}`}
                                            type="text" variant='underlined' label="Dirección de envio" placeholder="Ingrese su dirección" 
                                            value={direccion} onChange={(e) => setDireccion(e.target.value)}
                                            isInvalid={(esTextoVacio(direccion) && clickPagar)}
                                            errorMessage = {(esTextoVacio(direccion) && clickPagar) ? "Ingrese una dirección" : ""}
                                        />
                                        <Select
                                            style={{zIndex: 0}}
                                            className={`${style.show} ${selectedOption === TypeOrder.TIENDA ? "" : style.hide_sucursal}`}
                                            variant='underlined'
                                            label="Selecciona una sucursal"
                                            placeholder="Elige una sucursal"
                                            selectedKeys={sucursalSelected}
                                            onSelectionChange={setSucursalSelected}
                                        >
                                            {sucursales.map((sucursal) => (
                                            <SelectItem key={sucursal.id}>
                                                {sucursal.nombre}
                                            </SelectItem>
                                            ))}
                                        </Select>

                                        <p className={style.subtotal}>
                                            Subtotal <span>
                                                {carrito && roundToTwoDecimals(carrito.items.reduce((acc, item) => acc + (item.cantidad * item.producto.precio), 0)) + " Bs"}
                                            </span>
                                        </p>

                                        <p className={style.subtotal + " border_botom_gray"}>
                                            Tarifa por envío <span>
                                                {selectedOption === TypeOrder.DOMICILIO ? "10 Bs" : "0 Bs"}
                                            </span>
                                        </p>

                                        <p className={style.subtotal}>
                                            Total <span className={style.total}>
                                                {selectedOption === TypeOrder.DOMICILIO ? totalPayment + 10 : totalPayment} Bs
                                            </span>
                                        </p>

                                        <div style={{display: "flex", justifyContent: "end"}}>

                                            <Button onPress={onPayment} 
                                                className="button-main"
                                                style = {{maxWidth: "80px"}}
                                            >
                                                Pagar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                        </section>

                        <section className={`${style.container_payment} ${showPayment ? "" : style.hide_checkout}`}>
                            <div className={style.option +" "+ style.payment} style={{border: "none", padding :"0px"}}>
                                <h2> <MdOutlinePayment /> Método de Pago</h2>
                                <p>Selecciona un método de pago seguro para completar tu compra, 
                                    PayPal es una forma segura y rápida de pagar en línea sin compartir tu información financiera.
                                </p>
                                <div className={style.paypal_container}>
                                    <PayPalScriptProvider
                                        options={{
                                            clientId: process.env.NEXT_PUBLIC_ID_PAYPAL
                                        }}>
                                        <PayPalButtons
                                            createOrder={ async () => {
                                                let usuario = sessionStorage.getItem("usuario");
                                                usuario = JSON.parse(usuario);
                                                let option = sessionStorage.getItem("option");
                                                let res = await checkOut(option === TypeOrder.DOMICILIO ? true : false, usuario.fk_carrito);
                                                if (res.success){
                                                    return res.data.id;
                                                }
                                            }}
                                            onCancel = {(data) => {
                                                showToast("Orden cancelada", "error");
                                            }}
                                            onApprove = {async (data, actions) => {
                                                await actions.order.capture()
                                                let usuario = sessionStorage.getItem("usuario");
                                                usuario = JSON.parse(usuario);
                                                let esdelivery = sessionStorage.getItem("option") === "domicilio";
                                                let nombreUsuario = sessionStorage.getItem("nombre");
                                                let correoUsuario = sessionStorage.getItem("correo");
                                                let direccionUsuario = sessionStorage.getItem("direccion");
                                                let res = await crearPedido(usuario.fk_carrito, esdelivery, nombreUsuario, direccionUsuario, correoUsuario);
                                                if (res.success){
                                                    showToast("Pedido realizado con éxito", "success");
                                                    sessionStorage.removeItem("option");
                                                    sessionStorage.removeItem("nombre");
                                                    sessionStorage.removeItem("correo");
                                                    sessionStorage.removeItem("direccion");
                                                    router.push("/perfil");
                                                }else{
                                                    showToast("Error al realizar el pedido", "error");
                                                }
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            </div>
                            <figure className={style.payment_image_container}>
                                <Image src="/image/pay.webp" alt="pay" 
                                    className={style.payment_image}
                                    width={100} height={100}
                                    unoptimized
                                    priority={true}
                                    />
                            </figure>
                        </section>
                    </div>
                )
            } 
        </>  
    )
}