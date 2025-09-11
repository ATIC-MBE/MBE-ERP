import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_dn_master, menu_rrhh_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
// import useGrupoPro from "@/client/hooks/dnmaster/grupo/propietario/useGrupoPro"
import TableContainerPrescriptor from "@/components/TableContainerPrescriptor"
import useGrupoPro from "@/client/hooks/rrhhmaster/grupo/propietario/useGrupoPro"

// EDITAR, para tu pantalla
const GrupoPropietario = () => {

    const _itemSelected = 'rrhh_master_sucess_propietario'
    const {     listData, 
                headerTable, 
                loading, 
                filterFields,
                handleChange, 
                handleSearch,
                goEditData } = useGrupoPro() // Editar tu archivo useGrupoPro

    const drawActions = () => {
        return (<></>)
    }

    const drawfilters = () => {
        return (
            <>
                <div className='grid grid-cols-1 space-x-2 justify-end'>
                    <div className="w-[100%] flex text-xs">
                        <div className="w-[80%] flex text-xs ml-0">
                            <label className='p-2 h-min w-[4.5rem] bg-[#0077bd] text-white rounded-l-full col-span-1'>Buscar</label>
                            <input placeholder="Grupo / Nombres / Teléfonos" className="h-min rounded-r-full p-2 w-[14rem] outline-blue-800" onChange={handleChange} value={filterFields.search_all} type="text" name='search_all' />
                        </div>
                        
                        <button onClick={handleSearch} className='ml-2 bg-[#0077bd] h-min text-white p-2 text-[1rem] border border-blue rounded-xl' type='button'>Buscar</button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div>
                        <TableContainerPrescriptor actionOnRow={goEditData} nro_cols={7} drawactions={drawActions} drawfilters={drawfilters} title="Propietarios"  header={headerTable} data={listData} loading={loading} />
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default GrupoPropietario