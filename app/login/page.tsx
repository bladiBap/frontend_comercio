"use client"

import style from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {Input, Button} from "@nextui-org/react";
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import { toast } from "react-toastify";
import { login, crearUsuario } from "@/services/usuario-service";
import { sincronizarCarrito } from "@/services/carrito-service";
import Image from "next/image";


export default function LoginPage() {

    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleLogin, setIsVisibleLogin] = useState(true);
    const [isVisibleRegister, setIsVisibleRegister] = useState(false);
    const [doLogin, setDoLogin] = useState(false);
    const [doRegister, setDoRegister] = useState(false);

    const esValidoCorreo = (correo : string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(correo);
    }

    const esValidoTexto = (texto : string) => {
        return texto.length > 1;
    }

    const [correoLogin , setCorreoLogin] = useState("");
    const [contrasenaLogin , setContrasenaLogin] = useState("");

    const [nombreRegister , setNombreRegister] = useState("");
    const [apellidoRegister , setApellidoRegister] = useState("");
    const [correoRegister , setCorreoRegister] = useState("");
    const [contrasenaRegister , setContrasenaRegister] = useState("");

    const router = useRouter();

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    }

    const handleLogin = (e : any) => {
        e.preventDefault();
        e.stopPropagation();
        setDoLogin(true);

        if (!esValidoCorreo(correoLogin.trim()) || !esValidoTexto(contrasenaLogin.trim())){
            showToast("Revise los campos", "error");
            return;
        }
        fetchLogin();
    }

    const fetchLogin = () => {
        login(correoLogin, contrasenaLogin).then((res) => {
            if (res.success){
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("usuario", JSON.stringify(res.data.usuario));
                if (hayCarritoEnLocalStorage() != null){
                    sincronizarCarrito(hayCarritoEnLocalStorage().items, res.data.usuario.fk_carrito).then((res) => {
                        if (res.success){
                            localStorage.removeItem("carrito");
                        }else{
                            showToast(res.message, "error");
                            return;
                        }
                        window.location.href = "/";
                    });
                }else{
                    window.location.href = "/";
                }
            }else{
                showToast(res.message, "error");
            }
        }).catch((error) => {
            console.log(error);
            showToast("Ocurrió un error", "error");
        });
    }


    const handleRegister = (e : any) => {
        e.preventDefault();
        e.stopPropagation();
        setDoRegister(true);

        if (!esValidoTexto(nombreRegister.trim()) || !esValidoTexto(apellidoRegister.trim()) || !esValidoCorreo(correoRegister.trim()) || !esValidoTexto(contrasenaRegister.trim())){
            showToast("Revise los campos", "error");
            return;
        }

        fetchRegister();
    }

    const fetchRegister = () => {
        crearUsuario(nombreRegister, apellidoRegister, correoRegister, contrasenaRegister).then((res) => {
            if (res.success){
                showToast(res.message, "success");
                clearAllInputs();
                changeForm();
            }else{
                showToast(res.message, "error");
            }
        });
    }

    const changeForm = () => {
        clearAllInputs();
        setIsVisibleLogin(!isVisibleLogin);
        setIsVisibleRegister(!isVisibleRegister);
    }

    const clearAllInputs = () => {
        setCorreoLogin("");
        setContrasenaLogin("");
        setNombreRegister("");
        setApellidoRegister("");
        setCorreoRegister("");
        setContrasenaRegister("");
        setDoLogin(false);
        setDoRegister(false);
    }

    const showToast = (message: string, type: string) => {
        return toast(message, {
            type: type,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    };

    const hayCarritoEnLocalStorage = () => {
        let carrito = localStorage.getItem("carrito");
        if (carrito != null && carrito != undefined){
            return JSON.parse(carrito);
        }else{
            return null;
        }
    }

    return (
        <div className={style.container + " min_height padding-main separation_to_top"}>
            <section className={style.login_container}>
                <form 
                    className={`${style.form} ${isVisibleLogin ? "" : style.hide_login_form}`} 
                    onSubmit={handleLogin}>
                    <h2>Iniciar sesión</h2>
                    <p>Ingresa tu correo y contraseña para acceder a tu cuenta y poder realizar tus compras.</p>
                    <div className={style.input_container}>
                        <Input type="email"
                            size="md"
                            variant="underlined" 
                            label="Correo"
                            value={correoLogin}
                            onValueChange={setCorreoLogin}
                            isInvalid={!esValidoCorreo(correoLogin) && doLogin} 
                            errorMessage={(doLogin && !esValidoCorreo(correoLogin)) ? "Correo inválido" : ""}
                            color={(doLogin && !esValidoCorreo(correoLogin)) ? "danger" : "default"}
                            placeholder="Ingrese su correo" />
                    </div>

                    <div className={style.input_container}>
                        <Input
                            label="Contraseña"
                            size="md"
                            variant="underlined"
                            value={contrasenaLogin}
                            onValueChange={setContrasenaLogin}
                            isInvalid={!esValidoTexto(contrasenaLogin) && doLogin}
                            errorMessage={(doLogin && !esValidoTexto(contrasenaLogin.trim())) ? "Ingrese su contraseña" : ""}
                            color={(doLogin && !esValidoTexto(contrasenaLogin.trim())) ? "danger" : "default"}
                            placeholder="Ingrese su contraseña"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <FaEye  className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            />
                    </div>
                    <Button
                        className={style.login_button + " button-main"}
                        type="submit"
                        size="lg"
                        >
                        Iniciar sesión
                    </Button>
                    <p style={{cursor: "pointer"}}
                        onClick={changeForm}
                    >¿No tienes una cuenta? Regístrate.</p>
                </form>

                <form 
                    className={`${style.form} ${isVisibleRegister ? "" : style.hide_register_form}`}
                    onSubmit={handleRegister}>
                    <h2>Registrarse</h2>
                    <div className={style.input_container}>
                        <Input type="text"
                            size="md"
                            variant="underlined" 
                            label="Nombre"
                            value={nombreRegister}
                            onValueChange={setNombreRegister}
                            isInvalid={!esValidoTexto(nombreRegister) && doRegister}
                            errorMessage={(doRegister && !esValidoTexto(nombreRegister)) ? "Ingrese su nombre" : ""}
                            color={(doRegister && !esValidoTexto(nombreRegister)) ? "danger" : "default"}
                            placeholder="Ingrese su nombre" />
                    </div>
                    <div className={style.input_container}>
                        <Input type="text"
                            size="md"
                            variant="underlined" 
                            label="Apellido"
                            value={apellidoRegister}
                            onValueChange={setApellidoRegister}
                            isInvalid={!esValidoTexto(apellidoRegister) && doRegister}
                            errorMessage={(doRegister && !esValidoTexto(apellidoRegister)) ? "Ingrese su apellido" : ""}
                            color={(doRegister && !esValidoTexto(apellidoRegister)) ? "danger" : "default"}
                            placeholder="Ingrese su apellido" />
                    </div>
                    <div className={style.input_container}>
                        <Input type="email"
                            size="md"
                            variant="underlined" 
                            label="Correo" 
                            value={correoRegister}
                            onValueChange={setCorreoRegister}
                            isInvalid={!esValidoCorreo(correoRegister) && doRegister}
                            errorMessage={(doRegister && !esValidoCorreo(correoRegister)) ? "Correo inválido" : ""}
                            color={(doRegister && !esValidoCorreo(correoRegister)) ? "danger" : "default"}
                            placeholder="Ingrese su correo" />
                    </div>
                    <div className={style.input_container}>
                        <Input
                            label="Contraseña"
                            size="md"
                            variant="underlined"
                            value={contrasenaRegister}
                            onValueChange={setContrasenaRegister}
                            isInvalid={!esValidoTexto(contrasenaRegister) && doRegister}
                            errorMessage={(doRegister && !esValidoTexto(contrasenaRegister.trim())) ? "Ingrese su contraseña" : ""}
                            color={(doRegister && !esValidoTexto(contrasenaRegister.trim())) ? "danger" : "default"}
                            placeholder="Ingrese su contraseña"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <FaEyeSlash  className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <FaEye className="text-2xl text-default-400 pointer-events-none" />
                                )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            />
                    </div>
                    <Button
                        className={style.login_button + " button-main"}
                        type="submit"
                        size="lg"
                        >
                        Registrarse
                    </Button>
                    <p style={{cursor: "pointer"}}
                        onClick={changeForm}
                    >¿Ya tienes una cuenta? Inicia sesión.</p>
                </form>
                <figure>
                    <Image src="/image/diseno-mark5.jpg" alt="Login" 
                        className={style.login_image}
                        width={100} height={100}
                        unoptimized
                        priority={true}
                        />
                </figure>
            </section>
        </div>
    )
}