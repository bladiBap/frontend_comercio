import style from './footer.module.css';
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp    } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className={style.footer + " padding-main"}>
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
                <div>
                    <h2 className={style.txt_white + " " + style.title_logo_info}>Atención</h2>
                    <p className={style.txt_white}>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                    <p className={style.txt_white}>Sábados: 9:00 AM - 1:00 PM</p>
                </div>
            </div>
            <div className={style.container_icons}>
                <a href="https://www.facebook.com/horneatitos" target="_blank" rel="noreferrer">
                    <FaFacebookF className={style.icon_footer} />
                </a>
                <a href="https://www.instagram.com/horneatitos" target="_blank" rel="noreferrer">
                    <FaInstagram className={style.icon_footer} />
                </a>
                <a href="https://www.tiktok.com/@horneatitos" target="_blank" rel="noreferrer">
                    <FaTiktok className={style.icon_footer} />
                </a>
                <a href="https://wa.me/59175890424?text=Hola, me gustaría contactar con ustedes" target="_blank" rel="noreferrer">
                    <FaWhatsapp className={style.icon_footer} />
                </a>
            </div>
            <p className={style.txt_white + " txt-justify"}>© 2024 - Todos los derechos reservados</p>
        </footer>
    );
}