'use client';
import style from './navbar.module.css';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IoSearchOutline } from "react-icons/io5";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, 
    Link, Input, DropdownItem, DropdownTrigger, Dropdown, 
    DropdownMenu, Avatar, NavbarMenu, NavbarMenuItem, NavbarMenuToggle} from '@nextui-org/react';
import { getUserByToken } from '@/services/usuario-service';

const  baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Navigation() {
    const router = useRouter();
    const [areUser, setAreUser] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [activePages, setActivePages] = useState<[]>([
        {nombre: "Nosotros", ruta: "/",  id: 1},
        {nombre: "Productos", ruta: "/productos",  id: 3},
        {nombre: "Carrito", ruta: "/carrito",  id: 2},
    ]);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token){
            getUserByToken(token).then((res) => {
                if (res.success){
                    setAreUser(true);
                    sessionStorage.setItem("usuario", JSON.stringify(res.data));
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }, []);

    const GetUserImage = () => {
        let user = JSON.parse(sessionStorage.getItem("usuario"));
        if (user === undefined || user.img_url === null || user.img_url === "") {
            return "/image/none_user.png";
        }else{
            return `${baseUrl}/${user.img_url}`;
        }
    }

    const buscar = () => {
        if (searchText.trim() !== ""){
            // router.push(`/buscar/${searchText.trim()}`);
            window.location.href = `/buscar/${searchText.trim()}`;
            setIsMenuOpen(false);
        }else{
            //router.push("/");
            window.location.href = "/";
            setIsMenuOpen(false);
        }
    }

    const presionoEnter = (event: any) => {
        if (event.key === "Enter"){
            buscar();
        }
    }

    const esRutaActiva = (ruta: string, rutaActual: string) => {
        if (ruta === '/' && rutaActual === '/') {
            return true;
        } else if (ruta === '/') {
            return false;
        }
        return rutaActual.startsWith(ruta);
    }

    const GetItemNav = (item: any) => {
        const rutaActual = usePathname();
        return (
            <NavbarItem key={item.id} isActive={item.isActive}>
                <Link 
                    style={{fontWeight: esRutaActiva(item.ruta, rutaActual) ? "bold" : "normal",
                    color: "#fff",
                    cursor: "pointer",
                    borderBottom: esRutaActiva(item.ruta, rutaActual) ? "2px solid #fff" : "none"
                    }}
                    color="foreground"
                    onClick={() => {
                        router.push(item.ruta)
                        // window.location.href = item.ruta;
                    }}
                >
                    {item.nombre}
                </Link>
            </NavbarItem>
        )
    }

    const GetItemMobile = (item: any) => {
        const rutaActual = usePathname();
        return (
            <NavbarMenuItem key={item.id}>
                <Link 
                    style={{fontWeight: esRutaActiva(item.ruta, rutaActual) ? "bold" : "normal",
                    color: "#000",
                    cursor: "pointer",
                    borderBottom: esRutaActiva(item.ruta, rutaActual) ? "2px solid #000" : "none"
                    }}
                    color="foreground"
                    href={item.ruta}
                    >
                    {item.nombre}
                </Link>
            </NavbarMenuItem>
        )
    }

    const getDropdownMenu = () => {
        if (areUser){
            return (
                <DropdownMenu>
                    <DropdownItem>
                        <strong>
                            {JSON.parse(sessionStorage.getItem("usuario")).nombre}
                        </strong>
                    </DropdownItem>
                    <DropdownItem
                        href="/perfil"
                        >
                        Perfil
                    </DropdownItem>
                    <DropdownItem onClick={() => {
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("usuario");
                        window.location.href = "/";
                    }}>Cerrar Sesión</DropdownItem>
                </DropdownMenu>
            )
        }else{
            return (
                <DropdownMenu>
                    <DropdownItem> 
                        <strong>
                            Usuario
                        </strong>
                    </DropdownItem>
                    <DropdownItem
                        onClick={() => {
                            router.push("/login")
                        }}
                        >
                        Iniciar Sesión
                    </DropdownItem>
                    {/* <DropdownItem>Registrarse</DropdownItem> */}
                </DropdownMenu>
            )
        }
    }

    return (
        <Navbar 
            className={`${style.navbar} padding-main`}
            onMenuOpenChange={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
            style={{
            backgroundColor: "var(--color-primary)",
        }}>
            <NavbarContent justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="md:hidden"
                    style={{color: "#fff"}}
                />
                <NavbarBrand className="mr-4">
                    <Image
                        className={style.logo}
                        src="/image/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        unoptimized
                        priority={true}
                        onClick={() => {
                            router.push("/")
                        }}
                    />
                </NavbarBrand>
                <NavbarContent className="hidden md:flex gap-3">
                    {activePages.map((item) => GetItemNav(item))}
                </NavbarContent>
            </NavbarContent>

            <NavbarContent as="div" className="items-center" justify="end">
                <Input
                    classNames={{
                        base: "max-w-full sm:max-w-[15rem] h-10",
                        mainWrapper: "h-full",
                        input: "text-small",
                        inputWrapper: "h-full font-normal text-default-500",
                    }}
                    className={style.input_nav_web_view}
                    placeholder="Buscar..." 
                    size="sm"
                    startContent={<IoSearchOutline size={18} />}
                    type="search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={presionoEnter}
                />
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                        isBordered
                        as="button"
                        className="transition-transform"
                        name="Jason Hughes"
                        size="sm"
                        src={ areUser ? GetUserImage() : "/image/none_user.png"}
                        />
                    </DropdownTrigger>
                    
                    {getDropdownMenu()}
                </Dropdown>
            </NavbarContent>
            <NavbarMenu>
                <Input
                    classNames={{
                        base: "max-w-full h-10",
                        mainWrapper: "h-full",
                        input: "text-small",
                        inputWrapper: "h-full font-normal text-default-500",
                    }}
                    placeholder="Buscar..."
                    size="sm"
                    startContent={<IoSearchOutline size={18} />}
                    type="search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={presionoEnter}
                    />
                {activePages.map((item, index) => (
                    GetItemMobile(item)
                ))}
            </NavbarMenu>
        </Navbar>
    )
}