import React, { useContext, useState } from 'react';
import UserContext from '@/client/context/UserContext';
import { FetchApiService } from '@/client/services/FetchApiService';

const PinCounter = () => {
    // Extraemos el usuario y la función para actualizar del Contexto Global
    const { userData, updatePinsLocally } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);

    // userData a veces viene como función o como objeto directo, lo resolvemos:
    const user = typeof userData === 'function' ? userData() : userData;

    // Si la app está cargando y aún no hay usuario, no mostramos el contador
    if (!user || !user.id) return null;

    const handleUpdatePins = async (value: number) => {
        if (isLoading) return;
        setIsLoading(true);
        
        // 1. Actualización Visual Instantánea (Optimista)
        if (updatePinsLocally) {
            updatePinsLocally(value);
        }

        // 2. Enviamos la petición real al Backend
        try {
            const api = new FetchApiService();
            // Llama al endpoint PATCH que creamos en el backend
            const response = await api.patch(`share/users/${user.id}/pins`, { value });
            
            if (!response.status) {
                // Si la BD falla, revertimos el cambio visual
                console.error("Error al actualizar pins");
                if (updatePinsLocally) updatePinsLocally(-value); 
            }
        } catch (error) {
             console.error("Error de red al intentar actualizar los pins");
             if (updatePinsLocally) updatePinsLocally(-value);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center bg-emerald-50 rounded-full px-3 py-1 mr-4 shadow-sm border border-emerald-100">
            <span className="text-emerald-700 font-bold mr-3 text-xs tracking-wider">PINS</span>
            
            {/* Botón Restar */}
            <button 
                onClick={() => handleUpdatePins(-1)}
                disabled={isLoading || (user.pins || 0) <= 0} // Evitamos que baje de 0
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-50 hover:text-red-600 font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
                -
            </button>
            
            {/* Contador Central */}
            <span className="mx-3 font-bold text-gray-800 min-w-[20px] text-center">
                {user.pins || 0}
            </span>
            
            {/* Botón Sumar */}
            <button 
                onClick={() => handleUpdatePins(1)}
                disabled={isLoading}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
                +
            </button>
        </div>
    );
};

export default PinCounter;