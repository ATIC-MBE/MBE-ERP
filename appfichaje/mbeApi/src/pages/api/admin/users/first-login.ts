import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import MiddlewareInstance from '@/api/helpers/Middleware'
import UtilInstance from '@/api/helpers/Util'
import UserFirstLoginBusiness from '@/api/business/UserFirstLoginBusiness'
import { IResponse } from '@/api/modelsextra/IResponse'
import { IErrorResponse } from '@/api/modelsextra/IErrorResponse'
import { IUserFirstLogin } from '@/api/modelsextra/IUserFirstLogin'

const handler = nc(
      {
            onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
                  console.error(err.stack)
                  res.status(500).end('Something broke!')
            },
            onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
                  res.status(404).end('Page is not found')
            }
      })
      .use(MiddlewareInstance.verifyToken)
      .get(async (req, res: NextApiResponse<IResponse | IErrorResponse>) => {
            UtilInstance.getDataRequest(req) // Solo para validar permisos y consistencia
            const business = new UserFirstLoginBusiness()
            const dataDB = await business.getAll()

            if (!dataDB) {
                  res.status(404).json({ error: 'data not found' })
                  return
            }

            if ((dataDB as IErrorResponse).error) {
                  const error = dataDB as IErrorResponse
                  if (error.code === 403) res.status(403).json(error)
                  else res.status(404).json(error)
                  return
            }

            if ((dataDB as Array<IUserFirstLogin>).length === 0) {
                  res.status(404).json({ error: 'data not found' })
                  return
            }

            res.json({ data: dataDB })
      })

export default handler
