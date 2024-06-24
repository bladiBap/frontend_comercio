"use client"
import { useEffect, useState } from 'react';
import {getProductos} from '@/services/producto-service';
import {CircularProgress} from "@nextui-org/react";
import style from './page.module.css';

import ListProductos from '@/components/list-productos/list-producto';

export default function Productos() {

    const [productos, setProductos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        getProductos().then((res) => {
            if (res.success) {
                setProductos(res.data);
            }
        }).catch((err) => {
            console.log(err);
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
                <div className={style.mb + " min_height padding-main separation_to_top"}>
                    <h1 className="title_page">Lista de productos</h1>
                    <ListProductos productos={productos}/>
                </div>
                )
            }
        </>
    )
}