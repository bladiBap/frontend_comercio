import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {NextUIProvider} from "@nextui-org/react";
import Navigation from '@components/navbar/navbar';
import Footer from '@components/footer/footer';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tienda Horneatitos",
  description: "Tradicionalmente delicioso y ecologicamente responsable",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
