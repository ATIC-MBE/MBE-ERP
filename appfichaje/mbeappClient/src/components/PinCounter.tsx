import React, { useContext, useState } from 'react';
import UserContext from '@/client/context/UserContext';
// IMPORTACIÓN CORRECTA AL SINGLETON
import FetchApiService from '@/client/services/FetchApiService';

const PinCounter = () => {
    const { userData, updatePinsLocally } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);

    const user = typeof userData === 'function' ? userData() : userData;

    if (!user || !user.id) return null;

    const handleUpdatePins = async (value: number) => {
        if (isLoading) return;
        setIsLoading(true);
        
        // Actualizamos primero visualmente
        if (updatePinsLocally) {
            updatePinsLocally(value);
        }

        try {
            // CORRECCIÓN: Le añadimos 'api/' al principio de la ruta
            const responseData = await FetchApiService.update(`api/share/users/${user.id}/pins`, { id: user.id, value: value } as any);
            
            if (responseData === undefined) {
                console.error("Error al actualizar pins en base de datos");
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
            
            <button 
                onClick={() => handleUpdatePins(-1)}
                disabled={isLoading || (user.pins || 0) <= 0}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-50 hover:text-red-600 font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
                -
            </button>
            
            <span className="mx-3 font-bold text-gray-800 min-w-[20px] text-center">
                {user.pins || 0}
            </span>
            
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