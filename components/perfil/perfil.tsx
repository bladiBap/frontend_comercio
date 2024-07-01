'use client';
import style from './perfil.module.css';
import { useEffect, useState } from 'react';
import { Input, Avatar, Button, ButtonGroup, Chip, Accordion, 
    AccordionItem, CircularProgress, Divider} from '@nextui-org/react';
import Image from "next/image";
import {getMyProfile, updateUsuario} from '@/services/usuario-service';
import { toast } from 'react-toastify';

const base_Url = process.env.NEXT_PUBLIC_API_URL;

export default function Perfil (){

    const [isLoading , setIsLoading] = useState(true);
    const [isEditing , setIsEditing] = useState(false);
    const [doClickSend , setDoClickSend] = useState(false);
    const [imageFile , setImageFile] = useState(null);
    const [imageBase64 , setImageBase64] = useState('');
    const [User , setUser] = useState({});
    const [UserClone , setUserClone] = useState({});
    const [Pedidos , setPedidos] = useState([]);
    const [userNamesFixed , setUserNamesFixed] = useState('');
    const [userEmail , setUserEmail] = useState('');

    useEffect(() => {
        const fetch = async () => {
            let user = sessionStorage.getItem('usuario');
            getMyProfile(JSON.parse(user).id).then((res) => {
                setUser(res.data.usuario);
                setUserClone(res.data.usuario);
                setPedidos(res.data.pedidos);
                setUserNamesFixed(res.data.usuario.nombre + " " + res.data.usuario.apellido);
                setUserEmail(res.data.usuario.email);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setIsLoading(false);
            })
        }
        fetch();
    }, []);

    const getValidValue = (value: string) => {
        if (value === undefined) return '';
        return (value.trim() === '') ? '' : value;
    }

    const isValidTelefono = (value: string) => {
        if (value === undefined) return '';
        return value.match(/^[0-9]{8}$/);
    }

    const isValidCorreo = (value: string) => {
        if (value === undefined) return '';
        return value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
    }

    const isValidTexto = (value: string) => {
        if (value === undefined) return '';
        return value.trim() !== '';
    }

    const onFileChangeImageUser = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageFile(file);
                setImageBase64(reader.result as string);
            }
            reader.readAsDataURL(file);
        }
    }

    const setOriginalDataUser = () => {
        setImageFile(null);
        setUser(UserClone);
        setIsEditing(false);
        setDoClickSend(false);
    }
    
    const getUrlImage = () => {
        if (imageFile) {
            return imageBase64;
        }else if (User?.img_url !== '') {
            return `${base_Url}/${User?.img_url}`;
        }else{
            return '/image/none_user.png';
        }
    }

    const showToast = (message: string, type: String) => {
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

    const submitForm = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDoClickSend(true);

        if (!isValidTexto(User?.nombre) || !isValidTexto(User?.apellido) || !isValidCorreo(User?.email)) {
            showToast('Verifique los datos ingresados', 'error');
            return;
        }

        console.log(User?.telefono);

        if (!isValidTelefono(User?.telefono) && User?.telefono.trim() !== '') {
            showToast('Verifique los datos ingresados', 'error');
            return;
        }

        const formData = new FormData();
        
        if (User?.nombre.trim() !== ''){
            formData.append('nombre', User?.nombre);
        }

        if (User?.apellido.trim() !== ''){
            formData.append('apellido', User?.apellido);
        }

        if (User?.telefono.trim() !== ''){
            formData.append('telefono', User?.telefono);
        }

        if (User?.direccion.trim() !== ''){
            formData.append('direccion', User?.direccion);
        }

        if (User?.email.trim() !== ''){
            formData.append('email', User?.email.trim());
        }

        if (imageFile) {
            formData.append('imagen', imageFile);
        }

        fetchUpdateUser(formData);
    }

    const fetchUpdateUser = async (formData) => {
        let user = sessionStorage.getItem('usuario');
        updateUsuario(JSON.parse(user).id, formData).then((res) => {
            if (res.success) {
                showToast('Datos actualizados', 'success');
                sessionStorage.setItem('usuario', JSON.stringify(res.data));
                window.location.reload();
            }else{
                showToast('Error al actualizar los datos', 'error');
            }
        }).catch((error) => {
            console.log(error);
            showToast('Error al actualizar los datos', 'error');
        })
    }

    return (
        <>
            {
                isLoading ? (
                    <div className = {style.container + " min_height padding-main separation_to_top"}>
                        <CircularProgress className="loading" color="warning" label="Cargando..." />
                    </div>
                ):(
                    <div className = {style.container + " min_height padding-main separation_to_top"}>
                        <h1 className="title_page">Mi perfil</h1>
                        <Divider/>
                        <form className = {style.user_information} onSubmit={submitForm}>
                            <figure className={style.user_image_container}>
                                <Avatar src={getUrlImage()} isBordered  
                                    className={style.user_image} />
                                <div className={style.user_image_description}>
                                    <h3 className={style.user_image_title}>
                                        Hola, {userNamesFixed}
                                    </h3>

                                    <h3 className ={style.user_image_subtitle}>
                                        {userEmail}
                                    </h3>
                                    {
                                        isEditing && (
                                            <>
                                                <label htmlFor="imagen_user" className= {`${style.btn} ${ isEditing ? '' : style.disable_btn}`}>
                                                    Cambiar foto</label>
                                                <input type="file" id="imagen_user"
                                                    style={{opacity: 0, position: 'absolute', zIndex: -1}}
                                                    disabled = {!isEditing}
                                                    onChange={onFileChangeImageUser} />
                                            </>
                                        )
                                    }
                                </div>
                            </figure>
                            <Divider/>
                            <div className={style.user_data}>
                                <div className={style.user_data_header}>
                                    <h2 className = {style.subtitle_page}>Mi información</h2>
                                    <ButtonGroup>
                                        { isEditing ? (
                                            <>
                                                <Button size="sm" className= {style.color + ' ' + style.font_w}
                                                    onPress={() => { setOriginalDataUser(); }}
                                                    >Cancelar</Button>
                                                <Button size="sm" className= {style.font_w} color="default" 
                                                    type="submit"
                                                    >Guardar</Button> 
                                            </>
                                        ) : (
                                            <Button size="sm" className= {style.font_w} color="default"
                                            onPress={() => setIsEditing(!isEditing)}
                                            >Editar</Button>
                                        )}
                                    </ButtonGroup>
                                </div>
                                <div className={style.user_data_container}>
                                    <Input type="text"
                                        size="lg"
                                        variant="underlined" 
                                        label="Nombre"
                                        isReadOnly = {!isEditing}
                                        value={User?.nombre}
                                        onValueChange={(e)=>{
                                            setUser({...User, nombre: getValidValue(e)});
                                        }}
                                        isInvalid={!isValidTexto(User?.nombre) && doClickSend}
                                        errorMessage={(doClickSend && !isValidTexto(User?.nombre)) ? "Ingrese su nombre" : ""}
                                        color = {(doClickSend && !isValidTexto(User?.nombre)) ? "danger" : "default"}
                                        placeholder="Ingrese su nombre" 
                                        />
                                    <Input type="text"
                                        size="lg"
                                        variant="underlined" 
                                        label="Apellido"
                                        isReadOnly = {!isEditing}
                                        value={User?.apellido}
                                        onValueChange={(e)=>{
                                            setUser({...User, apellido: getValidValue(e)});
                                        }}
                                        isInvalid={!isValidTexto(User?.apellido) && doClickSend}
                                        errorMessage={(doClickSend && !isValidTexto(User?.apellido)) ? "Ingrese su apellido" : ""}
                                        color = {(doClickSend && !isValidTexto(User?.apellido)) ? "danger" : "default"}
                                        placeholder="Ingrese su nombre" 
                                        />
                                    <Input type="text"
                                        size="lg"
                                        variant="underlined" 
                                        label="Teléfono"
                                        isReadOnly = {!isEditing}
                                        value={User?.telefono}
                                        onValueChange={(e)=>{
                                            setUser({...User, telefono: getValidValue(e)});
                                        }}
                                        isInvalid={!isValidTelefono(User?.telefono) && doClickSend && User?.telefono.trim() !== ''}
                                        errorMessage={(doClickSend && !isValidTelefono(User?.telefono) && User?.telefono.trim() !== '' ) ? "Ingrese un teléfono válido" : ""}
                                        color = {(doClickSend && !isValidTelefono(User?.telefono) && User?.telefono.trim() !== '' ) ? "danger" : "default"}
                                        placeholder="Ingrese su nombre" 
                                        />
                                    <Input type="text"
                                        size="lg"
                                        variant="underlined" 
                                        label="Dirección"
                                        isReadOnly = {!isEditing}
                                        value={User?.direccion}
                                        onValueChange={(e)=>{
                                            setUser({...User, direccion: getValidValue(e)});
                                        }}
                                        placeholder="Ingrese su nombre" 
                                        />

                                    <Input type="email"
                                        size="lg"
                                        variant="underlined" 
                                        label="Correo"
                                        isReadOnly = {!isEditing}
                                        value={User?.email}
                                        onValueChange={(e)=>{
                                            setUser({...User, email : getValidValue(e)});
                                        }}
                                        isInvalid={!isValidCorreo(User?.email) && doClickSend}
                                        errorMessage={(doClickSend && !isValidCorreo(User?.email)) ? "Ingrese un correo válido" : ""}
                                        color = {(doClickSend && !isValidCorreo(User?.email)) ? "danger" : "default"}
                                        placeholder="Ingrese su nombre" 
                                        />
                                </div>
                            </div>
                        </form>
                        <section className = {style.user_orders}>
                            <h2 className = {style.subtitle_page}>Pedidos</h2>
                            {( Pedidos && Pedidos.length > 0) ? (
                                Pedidos.map((pedido, index) => {
                                    return (
                                        <section key={index+"a"} className={style.order_container}>
                                            <div className={style.order_header}>
                                                <div className = {style.order_info}>
                                                    <h3 className={style.order_info_txt}>
                                                        Orden # {pedido.id}
                                                    </h3>
                                                    <h3 className={style.order_info_txt}>
                                                        Ticket: {pedido.ticket}
                                                    </h3>
                                                    <h3>
                                                        {pedido.fecha}
                                                    </h3>
                                                </div>
                                                {pedido.completado ?  (<Chip className = {style.entregado}>Entregado</Chip>):(<Chip className = {style.no_entregado}>No entregado</Chip>)}
                                            </div>
                                            <Accordion>
                                                <AccordionItem key="1" aria-label="Accordion 1" subtitle={"Total: " + pedido.total +" Bs."}
                                                    title="Lista de productos">
                                                    <div className={style.order_products}>
                                                        {pedido.detalles.map((detalle, index) => {
                                                            return (
                                                                <div key={index+'b'} className={style.product_container}>
                                                                    <figure>
                                                                        <Image src={
                                                                            `${base_Url}/${detalle.producto.imagenes[0].img_url}`
                                                                        } alt={detalle.producto.nombre} 
                                                                            className={style.product_image_container}
                                                                            unoptimized
                                                                            priority={true}
                                                                            width={100} height={100} />
                                                                    </figure>
                                                                    <div className={style.product_description}>
                                                                        <h4 className={style.subtitle_detail}>{detalle.producto.nombre}</h4>
                                                                        <h4 className = {style.subtitle_detail_gray}>Cantidad: {detalle.cantidad}</h4>
                                                                        <h4 className={style.subtitle_detail}>{detalle.producto.precio} Bs.</h4>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </AccordionItem>
                                            </Accordion>
                                        </section>
                                    )
                                })
                            ):(
                                    <p>No tiene pedidos</p>
                                )
                            }
                        </section>
                    </div>
                )
            }
        </>
    )
}