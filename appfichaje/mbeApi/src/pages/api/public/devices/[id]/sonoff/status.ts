import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import { IErrorResponse } from '@/api/modelsextra/IErrorResponse'
import { IResponse } from '@/api/modelsextra/IResponse'
import UtilInstance from '@/api/helpers/Util'
import ParametrosGeneralesBusiness from '@/api/business/ParametrosGeneralesBusiness';
import { IParametrosGenerales } from '@/api/models/IParametrosGenerales';
import { IDevice } from '@/api/models/IDevice';
import DeviceBusiness from '@/api/business/DeviceBusiness';
import EWeLinkInstance from '@/api/helpers/EWeLink';

const handler = nc(
    {
        onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
                console.error(err.stack);
                res.status(500).end("Something broke!");
        },
        onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
            res.status(404).end("Page is not found");
        }
    })
    // .use(MiddlewareInstance.verifyToken)
    .get(async (req, res: NextApiResponse<IResponse | IErrorResponse>) => {
        const {idUserLogin, filterState} = UtilInstance.getDataRequest(req)
        let el: ParametrosGeneralesBusiness = new ParametrosGeneralesBusiness(idUserLogin, filterState, false)
        let elDevice: DeviceBusiness = new DeviceBusiness(idUserLogin, filterState, false)
            
        // Obtiene el token de acceso de eWeLink
        let dataDB: IParametrosGenerales | IErrorResponse = await el.getByCode('TOKEN-EWELINK')
        dataDB = dataDB as IParametrosGenerales

        // Obtener codigo del dispositivo
        let dataDeviceDB: IDevice | IErrorResponse = await elDevice.getSOnOffById(BigInt(parseInt(req.query.id as string)))
        dataDeviceDB = dataDeviceDB as IDevice
        // console.log(dataDeviceDB)
        
        const response = await EWeLinkInstance.getCurrentStatus(dataDB.valor, dataDeviceDB.codigo)
        // const response = await EWeLinkInstance.getLastStatus(dataDB.valor, dataDeviceDB.codigo)
        // console.log(response)

        res.json({ data: response })
    })
    .post(async (req, res: NextApiResponse<IResponse | IErrorResponse>) => {
        const {idUserLogin, filterState} = UtilInstance.getDataRequest(req)
        let el: ParametrosGeneralesBusiness = new ParametrosGeneralesBusiness(idUserLogin, filterState, false)
        let elDevice: DeviceBusiness = new DeviceBusiness(idUserLogin, filterState, false)
                
        // Obtiene el token de acceso de eWeLink
        let dataDB: IParametrosGenerales | IErrorResponse = await el.getByCode('TOKEN-EWELINK')
        dataDB = dataDB as IParametrosGenerales

        // Obtener codigo del dispositivo
        let dataDeviceDB: IDevice | IErrorResponse = await elDevice.getSOnOffById(BigInt(parseInt(req.query.id as string)))
        dataDeviceDB = dataDeviceDB as IDevice
        
        const response = await EWeLinkInstance.setStatus(dataDB.valor, dataDeviceDB.codigo)
        // console.log(response)

        res.json({ data: response })
    })

export default handler