import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
//import cors from 'cors'

import AuthUserBusiness from '@/api/business/AuthUserBusiness'
import { IAuthUser } from '@/api/modelsextra/IAuthUser'
import { IErrorResponse } from '@/api/modelsextra/IErrorResponse'
import Constants from '@/api/helpers/Constants'
import UtilInstance from '@/api/helpers/Util'
import { IResponse } from '@/api/modelsextra/IResponse'

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
      //.use(cors())
      .post(async (req, res: NextApiResponse<IResponse | IErrorResponse>) => {
            const { user, password } = req.body
            let el: AuthUserBusiness = new AuthUserBusiness()
            let dataDB: IAuthUser | IErrorResponse = await el.authUser(user, password)
            if ( !dataDB ) {
                  // 404 No existe usuario
                  res.status(204).json({ error: 'user not found' })
                  return
            } // Si hay error query
            else if ( ({ ...dataDB } as IErrorResponse).error ) {
                  let _d = dataDB as IErrorResponse
                  if (_d.code === 403) res.status(403).json(_d)
                  else res.status(404).json(_d)
                  return
            }else if ( (dataDB as IAuthUser).estado === Constants.code_status_baja) {
                  // 403 Usuario existe, pero inactivo
                  res.status(403).json({ error: 'user blocked' })
                  return
            }else if ( (dataDB as IAuthUser).estado === Constants.code_status_delete) {
                  // 404 Usuario existe, pero eliminado
                  res.status(204).json({ error: 'user delete' })
                  return
            }
            let { token, exp } = UtilInstance.createToken((dataDB as IAuthUser))
            res.setHeader('Set-Cookie', UtilInstance.getSerialize(token))
            res.json({ data: dataDB, token, exp })
      })

export default handler