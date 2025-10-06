import UserContext from '@/client/context/UserContext'
import { menu_aca_master } from '@/client/helpers/constants'
import ContentContainer from '@/components/ContentContainer'
import HomeContainer from '@/components/HomeContainer'
import { Layout } from '@/components/Layout'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import React, { useContext, useEffect, useState } from 'react'
import { AiFillPlusCircle } from 'react-icons/ai'
import BlockingModal from '@/components/BlockingModal';

const Acamaster = () => {
	const _itemSelected = 'aca_home'
	const { userData } = useContext(UserContext)
	const [currentModalIndex, setCurrentModalIndex] = useState(0);
	// 1. Array de pop-ups que queremos mostrar en orden
	const modals = [
		{ title: 'Atención', message: 'S. RRHH.' },
        { title: 'Atención', message: 'Leer correos.' },
        { title: 'Atención', message: 'Revisar las cuentas.' },
        { title: 'Atención', message: 'Cobros.' },
		{ title: 'Atención', message: 'Organización.' },
		{ title: 'P1N', message: 'Recuerda además de poner los P1Nes, resolverlos por la tarde.' },
        { title: 'Examen diario', message: 'Recuerda revisar tu correo personal por si te ha llegado.' },
        // puedes añadir tantos objetos como quieras
	];
	useEffect(() => {
		const seen = JSON.parse(localStorage.getItem('acamaster_modals_seen') || 'null');
		if (Array.isArray(seen) && seen.length === modals.length) {
			setCurrentModalIndex(modals.length);
		}
	}, []);
	const handleConfirm = () => {
		const next = currentModalIndex + 1;
		setCurrentModalIndex(next);
	};
	const showModal = currentModalIndex < modals.length;
	return (
		<Layout>
			<div className="h-100 bg-image p-5 pt-2 flex ">
				<MenuLeftContainer data={menu_aca_master} itemSelected={_itemSelected} />
				<ContentContainer>
					{/* Si aún quedan pop-ups pendientes, bloquea la pantalla */}
					{showModal && (
						<BlockingModal
							title={modals[currentModalIndex].title}
							message={modals[currentModalIndex].message}
							onConfirm={handleConfirm}
						/>
					)}
					<span>ACAMASTER &#128218;</span>
					<HomeContainer data={userData()}>
					</HomeContainer>
				</ContentContainer>
			</div>
		</Layout>
	)
}

export default Acamaster;
