"use client"
import style from './buscar-list.module.css';
import { useEffect, useState, useMemo } from 'react';
import {useRouter} from 'next/navigation';
import {buscarProductos} from '@/services/producto-service';
import { CircularProgress } from "@nextui-org/react";
import ListProductos from '@/components/list-productos/list-producto';

export default function BuscarList({ params }: any) {
    const [isLoading, setIsLoading] = useState(true);
    const [nombre, setNombre] = useState('');
    const [productos, setProductos] = useState([]);
    const route = useRouter();

    useEffect(() => {
        if (params.nombre === '') {
            route.push('/');
        }else{
            setNombre(params.nombre.replace(/%20/g, ' '));
        }
    },[
        params,
        route
    ]);

    useMemo(() => {
        if (nombre.trim() !== ""){
            setIsLoading(true);
            buscarProductos(nombre).then((response) => {
                if (response.success){
                    setProductos(response.data);
                }
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setIsLoading(false);
            })
        }
    }, [nombre]);

    return (
        <>
            {
                isLoading ? (
                    <div className="flex justify-center gap-4 min_height padding-main separation_to_top">
                        <CircularProgress color="danger" label="Cargando..." />
                    </div>
                ):(
                    <div className={"min_height padding-main separation_to_top"}>
                        <h1 className="title_page">Resultados de: <span className={style.txtSearch}>{nombre}</span></h1>
                        <ListProductos productos={productos}/>
                    </div>
                )
            }
        </>
    )
}