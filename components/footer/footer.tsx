import style from './footer.module.css';
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp    } from "react-icons/fa";
import {Link} from "@nextui-org/react";

export default function Footer() {
    return (
        <footer className={style.footer + " padding-main"}>
            <div className={style.container_footer_info}>
                <div className={style.container_footer_logo}>
                    <Image
                        className={style.logo_footer}
                        src="/image/logo.png"
                        alt="Logo"
                        width={10}
                        height={10}
                        unoptimized
                        priority={true}/>
                    <div className={style.divider}></div>
                    <div className={style.container_info_atencion}>
                        <h2 className={style.txt_white + " " + style.title_logo_info}>Atención</h2>
                        <p className={style.txt_white +" "+ style.txt_p}>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                        <p className={style.txt_white +" "+ style.txt_p}>Sábados: 9:00 AM - 1:00 PM</p>
                    </div>
                </div>

                <div className={style.container_footer_links}>
                    <h3 className={style.txt_white + " " + style.title_logo_info} >Acerca de Horneatito</h3>
                    <div className={style.container_links}>
                        <Link href="/" className={style.txt_white +" "+ style.txt_p}>Nosotros</Link>
                        <Link href="/productos" className={style.txt_white +" "+ style.txt_p}>Productos</Link>
                    </div>
                </div>
            </div>
            <div className={style.container_icons}>
                <a href="https://www.facebook.com/horneatitos.bolivia" target="_blank" rel="noreferrer">
                    <FaFacebookF className={style.icon_footer} />
                </a>
                <a href="https://www.instagram.com/horneatito.bolivia?igsh=cmZtZnYwdGR3MXVs" target="_blank" rel="noreferrer">
                    <FaInstagram className={style.icon_footer} />
                </a>
                <a href="https://www.tiktok.com/@horneatito?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer">
                    <FaTiktok className={style.icon_footer} />
                </a>
                <a href="https://wa.me/message/OB2IWZ75IXW6O1" target="_blank" rel="noreferrer">
                    <FaWhatsapp className={style.icon_footer} />
                </a>
            </div>
            <p className={style.txt_white + " txt-justify"}>© 2024 - Todos los derechos reservados</p>
        </footer>
    );
}