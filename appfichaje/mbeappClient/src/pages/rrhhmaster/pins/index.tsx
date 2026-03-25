import { Layout } from '@/components/Layout';
import MenuLeftContainer from '@/components/MenuLeftContainer';
import ContentContainer from '@/components/ContentContainer';
import { menu_rrhh_master } from '@/client/helpers/constants';
import React, { useEffect, useState } from 'react';
import { FetchApiService } from '@/client/services/FetchApiService';

const PinsManagement = () => {
    // Esto asegura que el botón del menú lateral se marque como activo
    const _itemSelected = 'rrhhmaster_pins';
    
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const api = new FetchApiService();
            // Llama a la ruta genérica que devuelve todos los usuarios
            // Asegúrate de que esta ruta devuelva también el campo 'pins'
            const response = await api.get('share/users'); 
            
            if (response.status && response.data) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error("Error obteniendo la lista de usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex">
                <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div className="bg-white p-8 rounded-2xl shadow-sm w-full border border-gray-100">
                        {/* Cabecera de la tabla */}
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Control Global de Pins</h2>
                            <span className="bg-emerald-100 text-emerald-800 py-1 px-4 rounded-full text-sm font-semibold">
                                Total Usuarios: {users.length}
                            </span>
                        </div>
                        
                        {/* Estado de Carga */}
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <p className="text-gray-500 font-medium">Cargando base de datos de usuarios...</p>
                            </div>
                        ) : (
                            /* Tabla de Datos */
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <table className="w-full text-left border-collapse bg-white">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                            <th className="p-4 font-semibold">Empleado</th>
                                            <th className="p-4 font-semibold hidden md:table-cell">Email / Contacto</th>
                                            <th className="p-4 font-semibold text-center">Pins Acumulados</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.length > 0 ? (
                                            users.map((u) => (
                                                <tr key={u.id} className="hover:bg-emerald-50/50 transition-colors">
                                                    <td className="p-4">
                                                        <p className="font-bold text-gray-800">{u.nombre} {u.apellido}</p>
                                                        <p className="text-xs text-gray-400 md:hidden">{u.email}</p>
                                                    </td>
                                                    <td className="p-4 hidden md:table-cell text-gray-500 text-sm">
                                                        {u.email}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="inline-flex items-center justify-center min-w-[3rem] bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm">
                                                            {u.pins || 0}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="text-center p-8 text-gray-500">
                                                    No se encontraron usuarios en la base de datos.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    );
};

export default PinsManagement;