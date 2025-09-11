import { Layout } from "@/components/Layout"
import InventarioBuscar from "@/components/da/inventario/InventarioBuscar"
import InventarioHeader from "@/components/da/inventario/InventarioHeader"
import InventarioLista from "@/components/da/inventario/InventarioLista"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const InventoryById = () => {

    const [pisoId,setPisoId]= useState<number>(0)

    const [nameItem,setNameItem]= useState<any>([])

    const router = useRouter()

    let id = Number((router.query.id as string) || 0)

    useEffect(() => {

        setPisoId(id)

    })

    return (

        <Layout>
            
            {/* <InventarioHeader pisoId={pisoId}/>

            <InventarioBuscar setNameItem={setNameItem}/>

            <InventarioLista nameItem={nameItem}/> */}
    
        </Layout>
        
    )}

export default InventoryById

