import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {NextUIProvider} from "@nextui-org/react";
import Navigation from '@components/navbar/navbar';
import Footer from '@components/footer/footer';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL ("https://horneatitos.shop"),
  alternates : {
    canonical: new URL ("https://horneatitos.shop"),
  },
  keywords : ["Horneatitos", "Panaderia", "Pan", "Bizcocho", "Bizcocho de maiz",
              "Bizcocho de maíz", "Cuñape", "Cuñapé", "Cuñape abizcochado", "Jallula",
              "Comercio electronico", "Tienda online", "Tienda virtual", "Tienda de pan",
              "Panaderia Artesanal", "Panaderia Ecologica", 
              "Panaderia Tradicional", "Panaderia Responsable", 
              "Panaderia Sostenible", "Panaderia Ecológica"],
  authors : [{ name : "Nicole Ferrufino Montaño"}, { name : "Rodrigo Ferrufino Montaño"}, { name : "Carlos Andrés Santa Cruz Natusch "},
              { name : "Bladimir Baptista Gonzales"}],
  publisher: "Horneatitos",
  openGraph: {
    title: "Horneatitos | Panadería tradicional y ecológica",
    description: "Bienvenidos a Horneatitos, la panadería tradicionalmente deliciosa y ecológicamente responsable",
    url: "https://horneatitos.shop",
    siteName: "Horneatitos",
    images: [
      {
        url: "https://horneatitos.shop/api/public/imagenes/productos/horneatito.jpg",
        width: 800,
        height: 600,
        alt: "Horneatitos",
      },
    ],
    locale: "es_BO",
    type: "website",
  },
  title : {
    template : "%s | Horneatitos",
    default : "Horneatitos | Panadería tradicional y ecológica",
  },
  description : "Bienvenidos a Horneatitos, la panadería tradicionalmente deliciosa y ecológicamente responsable.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/icon16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon32x32.png" />
      </head>
      <body className={inter.className} id="root">
        <NextUIProvider>
          <ToastContainer/>
          <Navigation />
          {children}
          <Footer />
        </NextUIProvider>
      </body>
    </html>
  );
}
