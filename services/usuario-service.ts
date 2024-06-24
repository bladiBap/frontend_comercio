import {IResponse} from '@/models/response';

const base_url = process.env.NEXT_PUBLIC_API_URL;

const getUsuarioById = async (id: number): Promise<IResponse> => {
    const res = await fetch(`${base_url}/usuario/${id}`);
    const data = await res.json();
    return data;
}

const getUserByToken = async (token: string): Promise<IResponse> => {
    const res = await fetch(`${base_url}/get_user_by_token`,{
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    return data;
}

const login = async (email: string, password: string): Promise<IResponse> => {
    const res = await fetch(`${base_url}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    });
    const data = await res.json();
    return data;
}

const crearUsuario = async (nombre: string, apellido: string, email: string, password: string): Promise<IResponse> => {
    const res = await fetch(`${base_url}/create_usuario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nombre, apellido, email, password, role: 'USER'})
    });
    const data = await res.json();
    return data;

}

export { getUsuarioById, getUserByToken, login, crearUsuario };