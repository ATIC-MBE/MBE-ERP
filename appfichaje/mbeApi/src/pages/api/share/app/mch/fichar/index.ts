import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import { IErrorResponse } from '@/api/modelsextra/IErrorResponse'
import { IResponse } from '@/api/modelsextra/IResponse'
import UtilInstance from '@/api/helpers/Util'
import MiddlewareInstance from '@/api/helpers/Middleware'
import FichajeOficinaBLL from '@/api/business/FichajeOficinaBLL'
import { IFichajeOficina } from '@/api/models/IFichajeOficina'
import { IFichajeLateSummary } from '@/api/modelsextra/IFichajeLateSummary'

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
    .use(MiddlewareInstance.verifyToken)
    .post(async (req, res: NextApiResponse<IResponse | IErrorResponse>) => { 
        const {idUserLogin, filterState, usernameLogin} = UtilInstance.getDataRequest(req)
        let el: FichajeOficinaBLL = new FichajeOficinaBLL(idUserLogin, filterState, true)
        
        // Data save on DB
        let data: IFichajeOficina = {
            usuario: usernameLogin,
            token: req.body.qr || UtilInstance.getUUID(),
            ip: req.body.ip || undefined,
            tipo_ejecucion: 'automatico',
            estado: 1,
            observacion: '',
            idusuario: idUserLogin,
            idusuario_ultimo_cambio: idUserLogin
        }

        let dataDB: IFichajeOficina | IErrorResponse = await el.fichar(data)
        
        if ( !dataDB ) {
                res.status(404).json({ error: 'data not found' })
                return
        }
    if ( ({ ...dataDB } as IErrorResponse).error ) {
                // 409: conflicto con los datos enviados
                res.status(409).json(dataDB as IErrorResponse)
                return
        }

    const dataRecord = dataDB as IFichajeOficina
        let lateSummary: IFichajeLateSummary | undefined = undefined
        try {
            const summaryResult = await el.getLateSummaryByUserAndWeek({
                usuario: usernameLogin,
        referenceDate: dataRecord.fecha,
                thresholdTime: '09:04:00',
                limit: 3
            })
            if (!('error' in (summaryResult as IErrorResponse))) {
                lateSummary = summaryResult as IFichajeLateSummary
            }
        } catch (err) {
            console.error('Error obtaining late summary:', err)
        }

        const responsePayload: IResponse = { data: dataRecord }
        if (lateSummary) {
            responsePayload.meta = { lateSummary }
        }

        res.json(responsePayload)
    })

export default handler