import UserContext from '@/client/context/UserContext'
// Make sure 'menu_ade_master' is exported from '@/client/helpers/constants'
// If it is a default export, use:
// import menu_ade_master from '@/client/helpers/constants'
// Otherwise, export it from the constants file as shown below.
import { menu_ade_master } from '@/client/helpers/constants'
import ContentContainer from '@/components/ContentContainer'
import HomeContainer from '@/components/HomeContainer'
import { Layout } from '@/components/Layout'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import React, { useContext, useEffect, useState } from 'react'
import BlockingModal from '@/components/BlockingModal';
const Ade = () => {
    const _itemSelected = 'ade_home'
    const { userData } = useContext(UserContext)
    const [currentModalIndex, setCurrentModalIndex] = useState(0);
    // 1. Array de pop-ups que queremos mostrar en orden
    const modals = [
        { title: 'Atención', message: 'Revisar las cuentas.' },
        { title: 'Atención', message: 'Facturas' },
        // puedes añadir tantos objetos como quieras
    ];
    
    // Cuando montamos la página, aseguramos que el modal aparece
    useEffect(() => {
        const seen = JSON.parse(localStorage.getItem('atic_modals_seen') || 'null');
        if (Array.isArray(seen) && seen.length === modals.length) {
            // todos marcados como vistos
            setCurrentModalIndex(modals.length);
        }
    }, []);
    // // (Opcional) Si quieres recordar en localStorage y no repetir en nuevas sesiones:

    const handleConfirm = () => {
        const next = currentModalIndex + 1;
        // Guardar que este modal ha sido visto
        // const seen = JSON.parse(localStorage.getItem('atic_modals_seen') || '[]');
        // seen.push(currentModalIndex);
        // localStorage.setItem('atic_modals_seen', JSON.stringify(seen));

        setCurrentModalIndex(next);
    };
    // Mientras haya un modal pendiente, lo mostramos. Una vez currentModalIndex >= modals.length, desaparece.
    const showModal = currentModalIndex < modals.length;
    return (

        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_ade_master} itemSelected={_itemSelected} />
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

export default Ade