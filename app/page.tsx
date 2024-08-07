"use client";
import { Link } from "@nextui-org/react";
import Image from "next/image";
export default function Home() {

  return (
    <main className="main min_height">
      <section className="section-1 padding-main">
        <div className="section-1-info">
          <h1 className="slogan_title">
            ¡Nuestros productos tradicionalmente deliciosos y ecológicamente responsables!
          </h1>
          <p className="paragraph-1">
            Somos un emprendimiento que intenta concientizar el uso de empaques
            plásticos en productos alimenticios, ofreciendo una alternativa ecológicamente más responsable y amigable con el medio ambiente.
          </p>
          <Link
            className="link-Button cursor-pointer"
            href="/productos"
          >
            Ver productos
          </Link>
        </div>
        <figure className="container-image-1">
          <Image
            className="imagen-1 image-style"
            src="/image/diseno-mark3.webp"
            alt="Logo"
            width={40}
            height={40}
            unoptimized
            priority={true}
          />
        </figure>
      </section>
      <section className="section-2 padding-main">
        <div className="section-2-container-mision">
          <h2 className="title-2 txt-justify">Horneatito</h2>
          <p className="paragraph-1 txt-justify">
            Estamos ubicados en la ciudad de Santa Cruz de la Sierra, ven y disfruta de nuestros productos,
            con la mejor calidad y sabor.
            Nuestra fábrica, proporciona un ambiente de trabajo seguro y agradable para nuestro equipo,
            para mayor información, puedes seguirnos en todas nuestras redes sociales.
          </p>
        </div>
        <div className="info-mision-vision">
          <div className="mision-vision">
            <div className="section-2-container-mision">
              <h2 className="title-2 txt-justify">Misión</h2>
              <p className="paragraph-1 txt-justify">
              Ofrecer cuñapés abizcochados de alta calidad en envases biodegradables, 
              promoviendo la tradición culinaria cruceña y el respeto por el medio 
              ambiente.
              </p>
            </div>
            <div className="section-2-container-mision">
              <h2 className="title-2 txt-justify">Visión</h2>
              <p className="paragraph-1 txt-justify">
              Ser líderes en el mercado de horneados tradicionales expandiendo nuestra
              presencia a nivel nacional e inspirar la adopción de prácticas sostenibles
              y respetuosas con el medio ambiente.
              </p>
            </div>
          </div>
          <figure className="banner-container">
            <Image
              className="imagen-banner radius-top"
              src="/image/banner-1.webp"
              alt="Banner"
              width={40}
              height={40}
              unoptimized
              priority={true}
            />
          </figure>
        </div>
      </section>
      <section className="section-3 padding-main">
        <div className="antecedente-container">
          <h2 className="title-2 border-bottom">Historia</h2>
          <p className="paragraph-1">
          Horneatito es una empresa boliviana fundada hace seis años en la ciudad 
          de Santa Cruz de la Sierra. Desde sus inicios, Horneatito se ha dedicado 
          a la producción y distribución de cuñapes abizcochados, un producto 
          tradicional boliviano altamente valorado por su sabor y calidad. <br /><br />
          Nuestra fábrica, estratégicamente ubicada en el segundo anillo de Paragua, 
          nos permite servir de manera eficiente a nuestros clientes en varios 
          departamentos del país, incluyendo La Paz, Cochabamba, Tarija, Chuquisaca y Beni. <br /><br />
          La demanda de productos tradicionales y la preocupación por el impacto ambiental 
          de los residuos plásticos han impulsado a Horneatito a adoptar prácticas innovadoras y 
          sostenibles. A través de este proyecto
          <br /><br />
          Nuestro equipo está compuesto por personas altamente capacitadas 
          y dedicadas, que comparten nuestra visión de ofrecer productos de 
          excelencia mientras cuidamos de nuestro entorno.
          </p>
        </div>
        <figure className="container-imagen-antecedentes">
          <Image
            className="imagen-antecendetes image-style"
            src="/image/diseno-mark1.webp"
            alt="Logo"
            width={40}
            height={40}
            unoptimized
            priority={true}
          />
        </figure>
      </section>
    </main>
  );
}
