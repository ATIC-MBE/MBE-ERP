import { menu_rrhh_master } from "@/client/helpers/constants"
import useUser from "@/client/hooks/rrhhmaster/users/useUser"
import UserService from "@/client/services/UserService"
import ContentContainer from "@/components/ContentContainer"
import { Layout } from "@/components/Layout"
import MenuLeftContainer from "@/components/MenuLeftContainer"
import TableContainer from "@/components/TableContainer"
import Link from "next/link"


const Users = () => {

    const _itemSelected = 'rrhh_master_users'
    
    const userService = new UserService()

    const { listData, headerTable, loading } = useUser()

    const drawActions = () => {
        return (
            <>
                <Link className="p-2 h-min rounded-xl bg-[#0077bd] hover:bg-[#0077bd] text-white" href='/rrhhmaster/users/new'>Nuevo</Link>
            </>
        )
    }

    //Falta filtrar los resultados para que solo aparezcan trabajadores

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div>
                        <TableContainer drawactions={drawActions} title="Usuarios" header={headerTable} data={listData} loading={loading} />
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )

}
export default Users