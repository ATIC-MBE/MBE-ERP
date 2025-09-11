
import { Layout } from '@/components/Layout';
import MenuLeftContainer from '@/components/MenuLeftContainer';
import ContentContainer from '@/components/ContentContainer';
import VacacionesContainerShare from '@/components/share/vacaciones/VacacionesShare';
import { menu_myd } from '@/client/helpers/constants';

const Solicitudes = () => {
    const _itemSelected = 'myd_solicitudes';
    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_myd} itemSelected={_itemSelected} />
                <ContentContainer>
                    <VacacionesContainerShare 
                        pathAdd={`/myd/solicitudes/new`} 
                        pathEdit={`/myd/solicitudes`} 
                        typeTotalData="all_vacaciones" 
                        pathGetData="/api/share/vacaciones/" 
                    />
                </ContentContainer>
            </div>
        </Layout>
    );
}

export default Solicitudes;
