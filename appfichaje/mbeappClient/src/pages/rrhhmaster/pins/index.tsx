import { Layout } from '@/components/Layout';
import MenuLeftContainer from '@/components/MenuLeftContainer';
import ContentContainer from '@/components/ContentContainer';
import { menu_rrhh_master } from '@/client/helpers/constants';
import React, { useEffect, useState } from 'react';
// IMPORTACIÓN CORRECTA AL SINGLETON
import FetchApiService from '@/client/services/FetchApiService';

const PinsManagement = () => {
    const _itemSelected = 'rrhhmaster_pins';
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // CORRECCIÓN: Le añadimos 'api/' al principio de la ruta
            const responseData = await FetchApiService.getAllData('api/share/users'); 
            
            if (responseData && Array.isArray(responseData)) {
                setUsers(responseData);
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
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Control Global de Pins</h2>
                            <span className="bg-emerald-100 text-emerald-800 py-1 px-4 rounded-full text-sm font-semibold">
                                Total Usuarios: {users.length}
                            </span>
                        </div>
                        
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-4"></div>
                                    <p className="text-gray-500 font-medium">Cargando base de datos...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <table className="w-full text-left border-collapse bg-white">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                            <th className="p-4 font-semibold">Empleado</th>
                                            <th className="p-4 font-semibold hidden md:table-cell">Usuario / Email</th>
                                            <th className="p-4 font-semibold text-center">Pins Acumulados</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.length > 0 ? (
                                            users.map((u, index) => (
                                                <tr key={u.id || index} className="hover:bg-emerald-50/50 transition-colors text-sm">
                                                    <td className="p-4">
                                                        <p className="font-bold text-gray-800">
                                                            {u.nombre_completo || `${u.nombre || ''} ${u.apellido || ''}`}
                                                        </p>
                                                        <p className="text-xs text-gray-400 md:hidden">{u.username}</p>
                                                    </td>
                                                    <td className="p-4 hidden md:table-cell text-gray-500">
                                                        <div>
                                                            <p className="font-medium">{u.username}</p>
                                                            <p className="text-xs">{u.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="inline-flex items-center justify-center min-w-[3rem] bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm text-base">
                                                            {u.pins || 0}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="text-center p-12 text-gray-500">
                                                    No se encontraron usuarios o la sesión ha expirado.
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