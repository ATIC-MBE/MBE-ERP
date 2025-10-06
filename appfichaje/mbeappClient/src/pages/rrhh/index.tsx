import UserContext from '@/client/context/UserContext'
import { menu_rrhh } from '@/client/helpers/constants'
import ContentContainer from '@/components/ContentContainer'
import HomeContainer from '@/components/HomeContainer'
import { Layout } from '@/components/Layout'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import React, { useContext, useEffect, useState } from 'react'
import { AiFillPlusCircle } from 'react-icons/ai'
import BlockingModal from '@/components/BlockingModal';

const RRHH = () => {
    const _itemSelected = 'rrhh_home'
    const { userData } = useContext(UserContext)
    const [currentModalIndex, setCurrentModalIndex] = useState(0);

    // 1. Array de pop-ups que queremos mostrar en orden
    const modals = [
        { title: 'Atención', message: 'Sucesos RRHH.' },
        { title: 'Atención', message: 'Leer correos y comprobar la asistencia.' },
        { title: 'P1N', message: 'Recuerda además de poner los P1Nes, resolverlos por la tarde.' },
        { title: 'Examen diario', message: 'Recuerda revisar tu correo personal por si te ha llegado.' },
        // puedes añadir tantos objetos como quieras
    ];
    // Cuando montamos la página, aseguramos que el modal aparece
    useEffect(() => {
        const seen = JSON.parse(localStorage.getItem('rrhh_modals_seen') || 'null');
        if (Array.isArray(seen) && seen.length === modals.length) {
            // todos marcados como vistos
            setCurrentModalIndex(modals.length);
        }
    }, []);
    // (Opcional) Si quieres recordar en localStorage y no repetir en nuevas sesiones:
    const handleConfirm = () => {
        const next = currentModalIndex + 1;
        // Guardar que este modal ha sido visto
        // const seen = JSON.parse(localStorage.getItem('rrhh_modals_seen') || '[]');
        // seen.push(currentModalIndex);
        // localStorage.setItem('rrhh_modals_seen', JSON.stringify(seen));

        setCurrentModalIndex(next);

        // Si hemos cerrado el último modal (Examen diario), activar tareas diarias
        if (next >= modals.length) {
            // Disparar evento para mostrar tareas diarias después de un breve delay
            setTimeout(() => {
                if (typeof window.showDailyTasksNotification === 'function') {
                    window.showDailyTasksNotification();
                }
            }, 500);
        }
    };

    // Mientras haya un modal pendiente, lo mostramos. Una vez currentModalIndex >= modals.length, desaparece.
    const showModal = currentModalIndex < modals.length;
    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh} itemSelected={_itemSelected} />
                <ContentContainer>
                    {/* Si aún quedan pop-ups pendientes, bloquea la pantalla */}
                    {showModal && (
                        <BlockingModal
                            title={modals[currentModalIndex].title}
                            message={modals[currentModalIndex].message}
                            onConfirm={handleConfirm}
                        />
                    )}
                    <HomeContainer data={userData()}>
                    </HomeContainer>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default RRHH